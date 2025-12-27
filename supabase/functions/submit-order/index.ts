import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter
// Limits: 5 orders per IP per 10 minutes
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

// Clean up old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_ORDERS_PER_WINDOW = 5;

let lastCleanup = Date.now();

function cleanupRateLimiter() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [ip, limit] of rateLimiter.entries()) {
      if (limit.resetAt <= now) {
        rateLimiter.delete(ip);
      }
    }
    lastCleanup = now;
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimiter();
  
  const now = Date.now();
  const limit = rateLimiter.get(ip);
  
  if (!limit || limit.resetAt <= now) {
    // New window
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_ORDERS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW };
  }
  
  if (limit.count >= MAX_ORDERS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: limit.resetAt - now };
  }
  
  limit.count++;
  return { allowed: true, remaining: MAX_ORDERS_PER_WINDOW - limit.count, resetIn: limit.resetAt - now };
}

// Input validation matching the database constraints
function validateOrder(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // customer_name: 3-100 characters
  if (!data.customer_name || typeof data.customer_name !== 'string') {
    errors.push('Customer name is required');
  } else if (data.customer_name.length < 3 || data.customer_name.length > 100) {
    errors.push('Customer name must be between 3 and 100 characters');
  }
  
  // phone: must match ^0[567][0-9]{8}$ pattern
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone number is required');
  } else if (!/^0[567][0-9]{8}$/.test(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // wilaya: required, max 50 characters
  if (!data.wilaya || typeof data.wilaya !== 'string') {
    errors.push('Wilaya is required');
  } else if (data.wilaya.length > 50) {
    errors.push('Wilaya name is too long');
  }
  
  // commune: required, max 100 characters
  if (!data.commune || typeof data.commune !== 'string') {
    errors.push('Commune is required');
  } else if (data.commune.length > 100) {
    errors.push('Commune name is too long');
  }
  
  // delivery_type: must be 'office' or 'home'
  if (!data.delivery_type || !['office', 'home'].includes(data.delivery_type)) {
    errors.push('Delivery type must be "office" or "home"');
  }
  
  // prices: must be non-negative numbers
  if (typeof data.product_price !== 'number' || data.product_price < 0) {
    errors.push('Invalid product price');
  }
  
  if (typeof data.delivery_price !== 'number' || data.delivery_price < 0) {
    errors.push('Invalid delivery price');
  }
  
  if (typeof data.total_price !== 'number' || data.total_price < 0) {
    errors.push('Invalid total price');
  }
  
  return { valid: errors.length === 0, errors };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${ip.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many orders. Please try again later.',
          resetIn: Math.ceil(rateLimit.resetIn / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString()
          } 
        }
      );
    }
    
    // Parse request body
    const orderData = await req.json();
    
    // Validate input
    const validation = validateOrder(orderData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with service role for inserting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert order
    const { data, error } = await supabase.from('orders').insert({
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      wilaya: orderData.wilaya,
      commune: orderData.commune,
      delivery_type: orderData.delivery_type,
      product_id: orderData.product_id || null,
      product_price: orderData.product_price,
      delivery_price: orderData.delivery_price,
      total_price: orderData.total_price,
      status: 'pending'
    }).select().single();
    
    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Order created successfully: ${data.id} from IP: ${ip.substring(0, 8)}...`);
    
    return new Response(
      JSON.stringify({ success: true, orderId: data.id }),
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        } 
      }
    );
    
  } catch (error) {
    console.error('Error processing order:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

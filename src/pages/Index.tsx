import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/landing/HeroSection";
import OrderForm from "@/components/landing/OrderForm";
import TrustSection from "@/components/landing/TrustSection";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import Footer from "@/components/landing/Footer";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  stock_count: number;
}

interface DeliverySettings {
  office_price: number;
  home_price: number;
}

const Index = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .limit(1)
          .single();

        if (products) {
          setProduct(products);
        }

        // Fetch delivery settings
        const { data: delivery } = await supabase
          .from("delivery_settings")
          .select("*")
          .limit(1)
          .single();

        if (delivery) {
          setDeliverySettings(delivery);
        }
      } catch (error) {
        // Only log in development to avoid exposing internal details in production
        if (import.meta.env.DEV) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product?.name || "حفارة HONESTPRO 800 واط"} | أفضل سعر في الجزائر</title>
        <meta 
          name="description" 
          content={`اشتري ${product?.name || "حفارة HONESTPRO 800 واط"} بأفضل سعر في الجزائر. الدفع عند الاستلام. توصيل لجميع الولايات.`} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <main className="min-h-screen">
        <HeroSection product={product} onOrderClick={scrollToOrderForm} />
        
        <div ref={orderFormRef}>
          <OrderForm product={product} deliverySettings={deliverySettings} />
        </div>
        
        <TrustSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Index;

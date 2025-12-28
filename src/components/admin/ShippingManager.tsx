import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Truck, Save, MessageSquare, MapPin } from "lucide-react";
import { wilayas } from "@/data/algeriaLocations";

interface FreeShippingWilaya {
  id: string;
  wilaya_code: string;
  wilaya_name: string;
  is_active: boolean;
}

interface DeliverySettings {
  id: string;
  office_price: number;
  home_price: number;
  whatsapp_number: string | null;
}

interface SiteSettings {
  id: string;
  whatsapp_template: string;
}

const ShippingManager = () => {
  const [freeShipping, setFreeShipping] = useState<FreeShippingWilaya[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [freeShipRes, deliveryRes, siteRes] = await Promise.all([
        supabase.from("free_shipping_wilayas").select("*"),
        supabase.from("delivery_settings").select("*").limit(1).maybeSingle(),
        supabase.from("site_settings").select("id, whatsapp_template").limit(1).maybeSingle(),
      ]);

      if (freeShipRes.error) throw freeShipRes.error;
      if (deliveryRes.error) throw deliveryRes.error;
      if (siteRes.error) throw siteRes.error;

      setFreeShipping(freeShipRes.data || []);
      setDeliverySettings(deliveryRes.data);
      setSiteSettings(siteRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFreeShipping = async (wilaya: { code: string; name: string }) => {
    const existing = freeShipping.find(w => w.wilaya_code === wilaya.code);

    try {
      if (existing) {
        // Remove from free shipping
        const { error } = await supabase
          .from("free_shipping_wilayas")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        setFreeShipping(freeShipping.filter(w => w.id !== existing.id));
      } else {
        // Add to free shipping
        const { data, error } = await supabase
          .from("free_shipping_wilayas")
          .insert({
            wilaya_code: wilaya.code,
            wilaya_name: wilaya.name,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        setFreeShipping([...freeShipping, data]);
      }
    } catch (error) {
      console.error("Error toggling free shipping:", error);
      toast({ title: "خطأ", description: "فشل في تحديث الشحن المجاني", variant: "destructive" });
    }
  };

  const saveDeliverySettings = async () => {
    if (!deliverySettings) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("delivery_settings")
        .update({
          office_price: deliverySettings.office_price,
          home_price: deliverySettings.home_price,
          whatsapp_number: deliverySettings.whatsapp_number,
        })
        .eq("id", deliverySettings.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث أسعار التوصيل" });
    } catch (error) {
      console.error("Error saving delivery settings:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الإعدادات", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveWhatsAppTemplate = async () => {
    if (!siteSettings) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ whatsapp_template: siteSettings.whatsapp_template })
        .eq("id", siteSettings.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث قالب الواتساب" });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({ title: "خطأ", description: "فشل في حفظ القالب", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">إعدادات الشحن والتوصيل</h2>
      </div>

      {/* Delivery Prices */}
      {deliverySettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أسعار التوصيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>سعر التوصيل للمكتب (دج)</Label>
                <Input
                  type="number"
                  value={deliverySettings.office_price}
                  onChange={e => setDeliverySettings({
                    ...deliverySettings,
                    office_price: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>سعر التوصيل للمنزل (دج)</Label>
                <Input
                  type="number"
                  value={deliverySettings.home_price}
                  onChange={e => setDeliverySettings({
                    ...deliverySettings,
                    home_price: Number(e.target.value)
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>رقم الواتساب للتواصل</Label>
              <Input
                value={deliverySettings.whatsapp_number || ""}
                onChange={e => setDeliverySettings({
                  ...deliverySettings,
                  whatsapp_number: e.target.value
                })}
                placeholder="+213555123456"
                dir="ltr"
              />
            </div>
            <Button onClick={saveDeliverySettings} disabled={saving}>
              <Save className="h-4 w-4 ml-2" />
              حفظ أسعار التوصيل
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Free Shipping Wilayas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            الولايات ذات الشحن المجاني
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            حدد الولايات التي سيكون فيها التوصيل مجانياً
          </p>
          <ScrollArea className="h-64 border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {wilayas.map(wilaya => {
                const isFree = freeShipping.some(w => w.wilaya_code === wilaya.code);
                return (
                  <div
                    key={wilaya.code}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      isFree ? "bg-success/10 border border-success/30" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleFreeShipping(wilaya)}
                  >
                    <Checkbox checked={isFree} />
                    <span className="text-sm">
                      {wilaya.code} - {wilaya.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <p className="text-sm text-muted-foreground mt-2">
            {freeShipping.length} ولاية مختارة للشحن المجاني
          </p>
        </CardContent>
      </Card>

      {/* WhatsApp Template */}
      {siteSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              قالب رسالة الواتساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              استخدم المتغيرات التالية: {"{customer_name}"}, {"{product}"}, {"{total}"}, {"{wilaya}"}, {"{phone}"}
            </p>
            <Textarea
              value={siteSettings.whatsapp_template || ""}
              onChange={e => setSiteSettings({
                ...siteSettings,
                whatsapp_template: e.target.value
              })}
              className="min-h-[120px]"
              placeholder="مرحباً {customer_name}..."
            />
            <Button onClick={saveWhatsAppTemplate} disabled={saving}>
              <Save className="h-4 w-4 ml-2" />
              حفظ القالب
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingManager;

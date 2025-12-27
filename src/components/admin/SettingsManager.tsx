import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings, RefreshCw, Truck, MessageCircle } from "lucide-react";

interface DeliverySettings {
  id: string;
  home_price: number;
  office_price: number;
  whatsapp_number: string | null;
}

const SettingsManager = () => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    home_price: 700,
    office_price: 500,
    whatsapp_number: "+213555123456",
  });
  const { toast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("delivery_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعدادات",
        variant: "destructive",
      });
    } else if (data) {
      setSettings(data);
      setFormData({
        home_price: data.home_price,
        office_price: data.office_price,
        whatsapp_number: data.whatsapp_number || "+213555123456",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    const { error } = await supabase
      .from("delivery_settings")
      .update({
        home_price: formData.home_price,
        office_price: formData.office_price,
        whatsapp_number: formData.whatsapp_number,
      })
      .eq("id", settings.id);

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد إعدادات للتعديل</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            أسعار التوصيل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="office_price">التوصيل للمكتب (دج)</Label>
              <Input
                id="office_price"
                type="number"
                value={formData.office_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    office_price: Number(e.target.value),
                  }))
                }
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground">
                سعر التوصيل إلى مكتب شركة التوصيل
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="home_price">التوصيل للمنزل (دج)</Label>
              <Input
                id="home_price"
                type="number"
                value={formData.home_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    home_price: Number(e.target.value),
                  }))
                }
                placeholder="700"
              />
              <p className="text-xs text-muted-foreground">
                سعر التوصيل إلى باب المنزل
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            رقم واتساب المتجر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">رقم الواتساب</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  whatsapp_number: e.target.value,
                }))
              }
              placeholder="+213555123456"
              dir="ltr"
              className="text-left"
            />
            <p className="text-xs text-muted-foreground">
              رقم الواتساب الرسمي للتواصل مع العملاء (بالصيغة الدولية)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 ml-2" />
          )}
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );
};

export default SettingsManager;

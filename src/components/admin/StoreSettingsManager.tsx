import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Store, Phone, Mail, MapPin, Clock } from "lucide-react";

interface StoreSettings {
  id: string;
  about_us: string;
  phone: string;
  email: string;
  address: string;
  working_hours_weekdays: string;
  working_hours_friday: string;
}

const StoreSettingsManager = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    about_us: "",
    phone: "",
    email: "",
    address: "",
    working_hours_weekdays: "",
    working_hours_friday: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          about_us: data.about_us,
          phone: data.phone,
          email: data.email,
          address: data.address,
          working_hours_weekdays: data.working_hours_weekdays,
          working_hours_friday: data.working_hours_friday,
        });
      }
    } catch (error) {
      console.error("Error fetching store settings:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل إعدادات المتجر",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await supabase.functions.invoke("update-store-settings", {
        body: {
          about_us: formData.about_us,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          working_hours_weekdays: formData.working_hours_weekdays,
          working_hours_friday: formData.working_hours_friday,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "تم الحفظ",
        description: "تم تحديث إعدادات المتجر بنجاح",
      });
      
      // Refresh settings after save
      fetchSettings();
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* About Us Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Store className="w-5 h-5" />
            من نحن
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="about_us">نص التعريف بالمتجر</Label>
            <Textarea
              id="about_us"
              value={formData.about_us}
              onChange={(e) =>
                setFormData({ ...formData, about_us: e.target.value })
              }
              placeholder="أدخل وصف المتجر..."
              className="min-h-[120px] text-right"
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Phone className="w-5 h-5" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+213 555 123 456"
                dir="ltr"
                className="text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@store.dz"
                dir="ltr"
                className="text-left"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              العنوان
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="الجزائر العاصمة"
              dir="rtl"
              className="text-right"
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Clock className="w-5 h-5" />
            ساعات العمل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="working_hours_weekdays">أيام الأسبوع</Label>
            <Input
              id="working_hours_weekdays"
              value={formData.working_hours_weekdays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  working_hours_weekdays: e.target.value,
                })
              }
              placeholder="السبت - الخميس: 9:00 - 18:00"
              dir="rtl"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="working_hours_friday">يوم الجمعة</Label>
            <Input
              id="working_hours_friday"
              value={formData.working_hours_friday}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  working_hours_friday: e.target.value,
                })
              }
              placeholder="الجمعة: عطلة"
              dir="rtl"
              className="text-right"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 ml-2" />
              حفظ جميع الإعدادات
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StoreSettingsManager;

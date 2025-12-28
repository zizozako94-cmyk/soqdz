import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Palette, Save, Type, Circle, Square, RectangleHorizontal } from "lucide-react";

interface SiteSettings {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  border_radius: string;
  sticky_order_bar: boolean;
  show_sales_popup: boolean;
  hero_video_url: string | null;
}

const fontOptions = [
  { value: "Cairo", label: "Cairo (افتراضي)" },
  { value: "Tajawal", label: "Tajawal" },
  { value: "Almarai", label: "Almarai" },
  { value: "IBM Plex Sans Arabic", label: "IBM Plex Sans Arabic" },
];

const radiusOptions = [
  { value: "sharp", label: "حاد", icon: Square },
  { value: "rounded", label: "مستدير", icon: Circle },
  { value: "pill", label: "كبسولة", icon: RectangleHorizontal },
];

const BrandIdentityManager = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          font_family: settings.font_family,
          border_radius: settings.border_radius,
          sticky_order_bar: settings.sticky_order_bar,
          show_sales_popup: settings.show_sales_popup,
          hero_video_url: settings.hero_video_url,
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث إعدادات العلامة التجارية" });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الإعدادات", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!settings) {
    return <div className="text-center text-muted-foreground">لا توجد إعدادات</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">هوية العلامة التجارية</h2>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الألوان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Label>اللون الأساسي</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={e => updateSetting("primary_color", e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <Input
                  value={settings.primary_color}
                  onChange={e => updateSetting("primary_color", e.target.value)}
                  className="font-mono"
                />
              </div>
              <div 
                className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: settings.primary_color }}
              >
                معاينة
              </div>
            </div>

            <div className="space-y-3">
              <Label>اللون الثانوي (الذهبي)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.secondary_color}
                  onChange={e => updateSetting("secondary_color", e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <Input
                  value={settings.secondary_color}
                  onChange={e => updateSetting("secondary_color", e.target.value)}
                  className="font-mono"
                />
              </div>
              <div 
                className="h-16 rounded-lg flex items-center justify-center font-semibold"
                style={{ backgroundColor: settings.secondary_color }}
              >
                معاينة
              </div>
            </div>

            <div className="space-y-3">
              <Label>لون التمييز (النجاح)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={e => updateSetting("accent_color", e.target.value)}
                  className="w-12 h-12 rounded-lg border cursor-pointer"
                />
                <Input
                  value={settings.accent_color}
                  onChange={e => updateSetting("accent_color", e.target.value)}
                  className="font-mono"
                />
              </div>
              <div 
                className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: settings.accent_color }}
              >
                معاينة
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            الخطوط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>نوع الخط</Label>
            <Select value={settings.font_family} onValueChange={v => updateSetting("font_family", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="p-4 bg-muted rounded-lg text-lg"
              style={{ fontFamily: settings.font_family }}
            >
              هذا نص تجريبي لمعاينة الخط المختار
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">شكل الحواف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {radiusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => updateSetting("border_radius", option.value)}
                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                  settings.border_radius === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <option.icon className={`h-8 w-8 ${
                  settings.border_radius === option.value ? "text-primary" : "text-muted-foreground"
                }`} />
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UI Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">خيارات العرض</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">شريط الطلب المثبت</p>
              <p className="text-sm text-muted-foreground">
                يظهر شريط صغير للشراء يتبع المستخدم أثناء التمرير
              </p>
            </div>
            <Switch
              checked={settings.sticky_order_bar}
              onCheckedChange={checked => updateSetting("sticky_order_bar", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">نوافذ المبيعات المنبثقة</p>
              <p className="text-sm text-muted-foreground">
                إظهار إشعارات المبيعات الأخيرة لزيادة الثقة
              </p>
            </div>
            <Switch
              checked={settings.show_sales_popup}
              onCheckedChange={checked => updateSetting("show_sales_popup", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>رابط فيديو البطل (اختياري)</Label>
            <Input
              value={settings.hero_video_url || ""}
              onChange={e => updateSetting("hero_video_url", e.target.value || null)}
              placeholder="https://example.com/video.mp4"
              dir="ltr"
            />
            <p className="text-sm text-muted-foreground">
              أضف رابط فيديو ليظهر بدلاً من الصور في قسم البطل
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full">
        <Save className="h-4 w-4 ml-2" />
        {saving ? "جاري الحفظ..." : "حفظ جميع التغييرات"}
      </Button>
    </div>
  );
};

export default BrandIdentityManager;

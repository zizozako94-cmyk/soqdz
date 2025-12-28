import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Code, Save, Facebook, Music2, Camera } from "lucide-react";

interface SiteSettings {
  id: string;
  facebook_pixel: string | null;
  tiktok_pixel: string | null;
  snapchat_pixel: string | null;
}

const PixelManager = () => {
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
        .select("id, facebook_pixel, tiktok_pixel, snapchat_pixel")
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

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          facebook_pixel: settings.facebook_pixel,
          tiktok_pixel: settings.tiktok_pixel,
          snapchat_pixel: settings.snapchat_pixel,
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث أكواد البكسل" });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الإعدادات", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!settings) {
    return <div className="text-center text-muted-foreground">لا توجد إعدادات</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">مركز البكسل والتتبع</h2>
      </div>

      <div className="grid gap-6">
        {/* Facebook Pixel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              Facebook Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>معرف البكسل (Pixel ID)</Label>
            <Input
              value={settings.facebook_pixel || ""}
              onChange={e => setSettings({ ...settings, facebook_pixel: e.target.value || null })}
              placeholder="1234567890123456"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              أدخل معرف Facebook Pixel الخاص بك لتتبع الزوار والتحويلات
            </p>
          </CardContent>
        </Card>

        {/* TikTok Pixel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Music2 className="h-5 w-5" />
              TikTok Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>معرف البكسل (Pixel ID)</Label>
            <Input
              value={settings.tiktok_pixel || ""}
              onChange={e => setSettings({ ...settings, tiktok_pixel: e.target.value || null })}
              placeholder="ABCDEFGHIJ1234567890"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              أدخل معرف TikTok Pixel الخاص بك لتتبع أحداث التحويل
            </p>
          </CardContent>
        </Card>

        {/* Snapchat Pixel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#FFFC00]" />
              Snapchat Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>معرف البكسل (Pixel ID)</Label>
            <Input
              value={settings.snapchat_pixel || ""}
              onChange={e => setSettings({ ...settings, snapchat_pixel: e.target.value || null })}
              placeholder="abc123def456-789"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              أدخل معرف Snapchat Pixel الخاص بك لتتبع الإعلانات
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={saveSettings} disabled={saving} className="w-full">
        <Save className="h-4 w-4 ml-2" />
        {saving ? "جاري الحفظ..." : "حفظ جميع أكواد البكسل"}
      </Button>
    </div>
  );
};

export default PixelManager;

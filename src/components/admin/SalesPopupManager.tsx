import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, Save, User, MapPin } from "lucide-react";

interface SalesPopup {
  id: string;
  customer_name: string;
  wilaya: string;
  product_name: string;
  is_fake: boolean;
  is_active: boolean;
}

const SalesPopupManager = () => {
  const [popups, setPopups] = useState<SalesPopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_popups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPopups(data || []);
    } catch (error) {
      console.error("Error fetching popups:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPopup = async () => {
    try {
      const newPopup = {
        customer_name: "عميل جديد",
        wilaya: "الجزائر العاصمة",
        product_name: "حفارة HONESTPRO 800 واط",
        is_fake: true,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("sales_popups")
        .insert(newPopup)
        .select()
        .single();

      if (error) throw error;
      setPopups([data, ...popups]);
      toast({ title: "تمت الإضافة", description: "تم إضافة إشعار جديد" });
    } catch (error) {
      console.error("Error adding popup:", error);
      toast({ title: "خطأ", description: "فشل في إضافة الإشعار", variant: "destructive" });
    }
  };

  const updatePopup = (id: string, field: keyof SalesPopup, value: any) => {
    setPopups(prev =>
      prev.map(popup =>
        popup.id === id ? { ...popup, [field]: value } : popup
      )
    );
  };

  const savePopup = async (popup: SalesPopup) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sales_popups")
        .update({
          customer_name: popup.customer_name,
          wilaya: popup.wilaya,
          product_name: popup.product_name,
          is_fake: popup.is_fake,
          is_active: popup.is_active,
        })
        .eq("id", popup.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث الإشعار بنجاح" });
    } catch (error) {
      console.error("Error saving popup:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الإشعار", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deletePopup = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sales_popups")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPopups(popups.filter(p => p.id !== id));
      toast({ title: "تم الحذف", description: "تم حذف الإشعار بنجاح" });
    } catch (error) {
      console.error("Error deleting popup:", error);
      toast({ title: "خطأ", description: "فشل في حذف الإشعار", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">إشعارات المبيعات (Social Proof)</h2>
        </div>
        <Button onClick={addPopup} size="sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة إشعار
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        أنشئ إشعارات مبيعات وهمية أو حقيقية لزيادة الثقة. ستظهر للزوار بشكل عشوائي.
      </p>

      <div className="grid gap-4">
        {popups.map(popup => (
          <Card key={popup.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <User className="h-3 w-3" />
                      اسم العميل
                    </Label>
                    <Input
                      value={popup.customer_name}
                      onChange={e => updatePopup(popup.id, "customer_name", e.target.value)}
                      placeholder="اسم العميل"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      الولاية
                    </Label>
                    <Input
                      value={popup.wilaya}
                      onChange={e => updatePopup(popup.id, "wilaya", e.target.value)}
                      placeholder="الولاية"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">المنتج</Label>
                    <Input
                      value={popup.product_name}
                      onChange={e => updatePopup(popup.id, "product_name", e.target.value)}
                      placeholder="اسم المنتج"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={popup.is_fake}
                      onCheckedChange={checked => updatePopup(popup.id, "is_fake", checked)}
                    />
                    <span className="text-xs text-muted-foreground">وهمي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={popup.is_active}
                      onCheckedChange={checked => updatePopup(popup.id, "is_active", checked)}
                    />
                    <span className="text-xs text-muted-foreground">مفعل</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => savePopup(popup)}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePopup(popup.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <span className="font-medium">{popup.customer_name}</span>
                <span className="text-muted-foreground"> من </span>
                <span className="font-medium">{popup.wilaya}</span>
                <span className="text-muted-foreground"> اشترى </span>
                <span className="text-primary font-medium">{popup.product_name}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {popups.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد إشعارات. أضف إشعاراً جديداً للبدء.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPopupManager;

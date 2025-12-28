import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge, Plus, Trash2, Save, GripVertical, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrustBadge {
  id: string;
  icon_name: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  badge_type: string;
}

const iconList = [
  "CheckCircle", "Shield", "Truck", "CreditCard", "Award", "Star", "Heart",
  "ThumbsUp", "Package", "Clock", "Lock", "Zap", "Gift", "Headphones",
  "RotateCcw", "MapPin", "Phone", "Mail", "Users", "Building", "Home",
  "Settings", "HelpCircle", "AlertCircle", "Info", "Bell", "Calendar"
];

const TrustBadgesManager = () => {
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from("trust_badges")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBadge = async () => {
    try {
      const newBadge = {
        icon_name: "CheckCircle",
        title: "شارة جديدة",
        description: "",
        sort_order: badges.length + 1,
        is_active: true,
        badge_type: "guarantee",
      };

      const { data, error } = await supabase
        .from("trust_badges")
        .insert(newBadge)
        .select()
        .single();

      if (error) throw error;
      setBadges([...badges, data]);
      toast({ title: "تمت الإضافة", description: "تم إضافة شارة جديدة" });
    } catch (error) {
      console.error("Error adding badge:", error);
      toast({ title: "خطأ", description: "فشل في إضافة الشارة", variant: "destructive" });
    }
  };

  const updateBadge = (id: string, field: keyof TrustBadge, value: any) => {
    setBadges(prev =>
      prev.map(badge =>
        badge.id === id ? { ...badge, [field]: value } : badge
      )
    );
  };

  const saveBadge = async (badge: TrustBadge) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("trust_badges")
        .update({
          icon_name: badge.icon_name,
          title: badge.title,
          description: badge.description,
          sort_order: badge.sort_order,
          is_active: badge.is_active,
        })
        .eq("id", badge.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث الشارة بنجاح" });
    } catch (error) {
      console.error("Error saving badge:", error);
      toast({ title: "خطأ", description: "فشل في حفظ الشارة", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteBadge = async (id: string) => {
    try {
      const { error } = await supabase
        .from("trust_badges")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBadges(badges.filter(b => b.id !== id));
      toast({ title: "تم الحذف", description: "تم حذف الشارة بنجاح" });
    } catch (error) {
      console.error("Error deleting badge:", error);
      toast({ title: "خطأ", description: "فشل في حذف الشارة", variant: "destructive" });
    }
  };

  const renderIcon = (iconName: string, className = "h-5 w-5") => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  const filteredIcons = iconList.filter(icon =>
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

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
          <Badge className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">شارات الثقة والضمانات</h2>
        </div>
        <Button onClick={addBadge} size="sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة شارة
        </Button>
      </div>

      <div className="grid gap-4">
        {badges.map((badge, index) => (
          <Card key={badge.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-5 w-5 cursor-grab" />
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>

                <Popover open={selectedBadgeId === badge.id} onOpenChange={(open) => setSelectedBadgeId(open ? badge.id : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      {renderIcon(badge.icon_name)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="ابحث عن أيقونة..."
                          value={iconSearch}
                          onChange={e => setIconSearch(e.target.value)}
                          className="pr-8"
                        />
                      </div>
                      <ScrollArea className="h-48">
                        <div className="grid grid-cols-5 gap-1">
                          {filteredIcons.map(icon => (
                            <Button
                              key={icon}
                              variant={badge.icon_name === icon ? "default" : "ghost"}
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => {
                                updateBadge(badge.id, "icon_name", icon);
                                setSelectedBadgeId(null);
                                setIconSearch("");
                              }}
                            >
                              {renderIcon(icon, "h-4 w-4")}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="flex-1 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">العنوان</Label>
                    <Input
                      value={badge.title}
                      onChange={e => updateBadge(badge.id, "title", e.target.value)}
                      placeholder="عنوان الشارة"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">الوصف (اختياري)</Label>
                    <Input
                      value={badge.description || ""}
                      onChange={e => updateBadge(badge.id, "description", e.target.value)}
                      placeholder="وصف الشارة"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={badge.is_active}
                      onCheckedChange={checked => updateBadge(badge.id, "is_active", checked)}
                    />
                    <span className="text-sm text-muted-foreground">مفعل</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => saveBadge(badge)}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBadge(badge.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrustBadgesManager;

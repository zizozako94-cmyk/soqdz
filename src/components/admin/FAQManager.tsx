import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Plus, Trash2, Save, GripVertical, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FAQItem {
  id: string;
  icon_name: string;
  title: string;
  content: string;
  sort_order: number;
  is_active: boolean;
}

const iconList = [
  "HelpCircle", "RotateCcw", "Shield", "Truck", "Headphones", "Clock",
  "Package", "CreditCard", "MapPin", "Phone", "Mail", "Settings",
  "AlertCircle", "Info", "CheckCircle", "Star", "Heart", "Lock"
];

const FAQManager = () => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    try {
      const newItem = {
        icon_name: "HelpCircle",
        title: "سؤال جديد",
        content: "الإجابة هنا...",
        sort_order: items.length + 1,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("faq_items")
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;
      setItems([...items, data]);
      toast({ title: "تمت الإضافة", description: "تم إضافة سؤال جديد" });
    } catch (error) {
      console.error("Error adding FAQ item:", error);
      toast({ title: "خطأ", description: "فشل في إضافة السؤال", variant: "destructive" });
    }
  };

  const updateItem = (id: string, field: keyof FAQItem, value: any) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const saveItem = async (item: FAQItem) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("faq_items")
        .update({
          icon_name: item.icon_name,
          title: item.title,
          content: item.content,
          sort_order: item.sort_order,
          is_active: item.is_active,
        })
        .eq("id", item.id);

      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تحديث السؤال بنجاح" });
    } catch (error) {
      console.error("Error saving FAQ item:", error);
      toast({ title: "خطأ", description: "فشل في حفظ السؤال", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("faq_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
      toast({ title: "تم الحذف", description: "تم حذف السؤال بنجاح" });
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      toast({ title: "خطأ", description: "فشل في حذف السؤال", variant: "destructive" });
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
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">الأسئلة الشائعة</h2>
        </div>
        <Button onClick={addItem} size="sm">
          <Plus className="h-4 w-4 ml-2" />
          إضافة سؤال
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card key={item.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-5 w-5 cursor-grab" />
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>

                  <Popover open={selectedItemId === item.id} onOpenChange={(open) => setSelectedItemId(open ? item.id : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="shrink-0">
                        {renderIcon(item.icon_name)}
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
                                variant={item.icon_name === icon ? "default" : "ghost"}
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => {
                                  updateItem(item.id, "icon_name", icon);
                                  setSelectedItemId(null);
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

                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">العنوان</Label>
                    <Input
                      value={item.title}
                      onChange={e => updateItem(item.id, "title", e.target.value)}
                      placeholder="عنوان السؤال"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={checked => updateItem(item.id, "is_active", checked)}
                      />
                      <span className="text-sm text-muted-foreground">مفعل</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => saveItem(item)}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mr-16 space-y-1">
                  <Label className="text-xs">المحتوى</Label>
                  <Textarea
                    value={item.content}
                    onChange={e => updateItem(item.id, "content", e.target.value)}
                    placeholder="محتوى الإجابة..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQManager;

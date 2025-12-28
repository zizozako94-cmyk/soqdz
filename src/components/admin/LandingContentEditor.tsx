import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Save, Type, FileText, MessageSquare, Building } from "lucide-react";

interface ContentSection {
  id: string;
  section_key: string;
  content: Record<string, string>;
  updated_at: string;
}

const LandingContentEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("landing_content")
        .select("*")
        .order("section_key");

      if (error) throw error;
      const parsed = (data || []).map(item => ({
        ...item,
        content: (typeof item.content === 'object' && item.content !== null ? item.content : {}) as Record<string, string>
      }));
      setSections(parsed);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (sectionKey: string, field: string, value: string) => {
    setSections(prev =>
      prev.map(section =>
        section.section_key === sectionKey
          ? { ...section, content: { ...section.content, [field]: value } }
          : section
      )
    );
  };

  const saveSection = async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const section = sections.find(s => s.section_key === sectionKey);
      if (!section) return;

      const { error } = await supabase
        .from("landing_content")
        .update({ content: section.content })
        .eq("section_key", sectionKey);

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم تحديث المحتوى بنجاح",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ المحتوى",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const getSectionIcon = (key: string) => {
    switch (key) {
      case "hero": return <Type className="h-5 w-5" />;
      case "order_form": return <FileText className="h-5 w-5" />;
      case "trust_section": return <MessageSquare className="h-5 w-5" />;
      case "footer": return <Building className="h-5 w-5" />;
      default: return <Type className="h-5 w-5" />;
    }
  };

  const getSectionTitle = (key: string) => {
    switch (key) {
      case "hero": return "قسم البطل (Hero)";
      case "order_form": return "نموذج الطلب";
      case "trust_section": return "قسم الثقة";
      case "footer": return "التذييل (Footer)";
      default: return key;
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      urgency_text: "نص الاستعجال",
      limited_badge: "شارة العرض المحدود",
      cta_button: "زر الإجراء",
      price_label: "عنوان السعر",
      cod_label: "عنوان الدفع عند الاستلام",
      title: "العنوان",
      subtitle: "العنوان الفرعي",
      submit_button: "زر الإرسال",
      security_note: "ملاحظة الأمان",
      about_title: "عنوان من نحن",
      about_text: "نص من نحن",
      contact_title: "عنوان التواصل",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      address: "العنوان",
      hours_title: "عنوان ساعات العمل",
      hours_text: "نص ساعات العمل",
    };
    return labels[field] || field;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Type className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">محرر المحتوى</h2>
      </div>

      {sections.map(section => (
        <Card key={section.section_key} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getSectionIcon(section.section_key)}
            </div>
            <CardTitle className="text-lg">{getSectionTitle(section.section_key)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(section.content).map(([field, value]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`${section.section_key}-${field}`}>
                    {getFieldLabel(field)}
                  </Label>
                  {field.includes("text") || field === "about_text" || field === "hours_text" ? (
                    <Textarea
                      id={`${section.section_key}-${field}`}
                      value={value}
                      onChange={e => updateSection(section.section_key, field, e.target.value)}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <Input
                      id={`${section.section_key}-${field}`}
                      value={value}
                      onChange={e => updateSection(section.section_key, field, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={() => saveSection(section.section_key)}
              disabled={saving === section.section_key}
              className="w-full md:w-auto"
            >
              <Save className="h-4 w-4 ml-2" />
              {saving === section.section_key ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LandingContentEditor;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RotateCcw, Shield, Headphones, Truck, CheckCircle } from "lucide-react";

const TrustSection = () => {
  const trustItems = [
    {
      id: "return",
      icon: RotateCcw,
      title: "سياسة الاسترجاع",
      content: "يمكنك استرجاع المنتج خلال 7 أيام من تاريخ الاستلام في حالة وجود أي عيب في التصنيع. يجب أن يكون المنتج في حالته الأصلية مع جميع الملحقات والتغليف الأصلي. تكاليف الشحن للإرجاع تكون على عاتق العميل إلا في حالة وجود عيب مصنعي.",
    },
    {
      id: "warranty",
      icon: Shield,
      title: "الضمان",
      content: "نقدم ضمان سنة كاملة على جميع منتجاتنا ضد عيوب التصنيع. يشمل الضمان إصلاح أو استبدال القطع المعيبة مجاناً. لا يشمل الضمان الأضرار الناتجة عن سوء الاستخدام أو الحوادث أو الإصلاحات غير المعتمدة.",
    },
    {
      id: "support",
      icon: Headphones,
      title: "خدمة العملاء",
      content: "فريق خدمة العملاء متاح للرد على استفساراتكم من السبت إلى الخميس من الساعة 9 صباحاً حتى 6 مساءً. يمكنكم التواصل معنا عبر الواتساب أو الهاتف للحصول على المساعدة الفنية أو الاستفسار عن الطلبات.",
    },
    {
      id: "delivery",
      icon: Truck,
      title: "التوصيل",
      content: "نوفر خدمة التوصيل لجميع ولايات الوطن. مدة التوصيل تتراوح بين 2-5 أيام عمل حسب الولاية. يمكنك اختيار التوصيل للمكتب أو للمنزل. الدفع يكون عند الاستلام بعد معاينة المنتج.",
    },
  ];

  const guarantees = [
    "منتجات أصلية 100%",
    "ضمان سنة كاملة",
    "الدفع عند الاستلام",
    "توصيل لكل الولايات",
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        {/* Guarantees Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 bg-card p-4 rounded-xl shadow-soft"
            >
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-semibold text-sm md:text-base">{guarantee}</span>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            معلومات مهمة
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {trustItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-card rounded-2xl shadow-soft border-none px-6 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-semibold text-lg">{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

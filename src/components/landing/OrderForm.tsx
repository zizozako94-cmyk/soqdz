import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, MapPin, Truck, Home, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wilayas, getWilayaByName } from "@/data/algeriaLocations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100),
  phone: z.string().regex(/^0[567]\d{8}$/, "رقم الهاتف غير صحيح (يجب أن يبدأ ب 05, 06 أو 07)"),
  wilaya: z.string().min(1, "الرجاء اختيار الولاية"),
  commune: z.string().min(1, "الرجاء اختيار البلدية"),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  product: {
    id: string;
    name: string;
    price: number;
  } | null;
  deliverySettings: {
    office_price: number;
    home_price: number;
  } | null;
}

const OrderForm = ({ product, deliverySettings }: OrderFormProps) => {
  const [deliveryType, setDeliveryType] = useState<"office" | "home">("office");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const watchedWilaya = watch("wilaya");
  const selectedWilayaData = getWilayaByName(watchedWilaya);

  const productPrice = product?.price || 9200;
  const officePrice = deliverySettings?.office_price || 500;
  const homePrice = deliverySettings?.home_price || 700;
  const deliveryPrice = deliveryType === "office" ? officePrice : homePrice;
  const totalPrice = productPrice + deliveryPrice;

  const handleWilayaChange = (value: string) => {
    setSelectedWilaya(value);
    setValue("wilaya", value);
    setValue("commune", "");
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: data.customerName,
        phone: data.phone,
        wilaya: data.wilaya,
        commune: data.commune,
        delivery_type: deliveryType,
        product_id: product?.id,
        product_price: productPrice,
        delivery_price: deliveryPrice,
        total_price: totalPrice,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "✅ تم تسجيل طلبك بنجاح!",
        description: "سنتواصل معك قريباً لتأكيد الطلب",
      });

      reset();
      setDeliveryType("office");
      setSelectedWilaya("");
    } catch (error) {
      // Log only in development, avoid exposing error details in production
      if (import.meta.env.DEV) {
        console.error("Order error:", error);
      }
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تسجيل طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-16 bg-card">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              📦 أكمل طلبك الآن
            </h2>
            <p className="text-muted-foreground">
              املأ المعلومات التالية وسنتواصل معك لتأكيد الطلب
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-background rounded-3xl shadow-strong p-6 md:p-8 space-y-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <User className="w-5 h-5 text-gold" />
                الاسم واللقب
              </Label>
              <Input
                {...register("customerName")}
                placeholder="أدخل اسمك الكامل"
                className="h-12 text-base"
              />
              {errors.customerName && (
                <p className="text-destructive text-sm">{errors.customerName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Phone className="w-5 h-5 text-gold" />
                رقم الهاتف
              </Label>
              <Input
                {...register("phone")}
                placeholder="مثال: 0555123456"
                className="h-12 text-base"
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-destructive text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Wilaya */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-gold" />
                الولاية
              </Label>
              <Select onValueChange={handleWilayaChange} value={watchedWilaya}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {wilayas.map((wilaya) => (
                    <SelectItem key={wilaya.code} value={wilaya.name}>
                      {wilaya.code} - {wilaya.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.wilaya && (
                <p className="text-destructive text-sm">{errors.wilaya.message}</p>
              )}
            </div>

            {/* Commune */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-gold" />
                البلدية
              </Label>
              <Select
                onValueChange={(value) => setValue("commune", value)}
                disabled={!selectedWilayaData}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={selectedWilayaData ? "اختر البلدية" : "اختر الولاية أولاً"} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {selectedWilayaData?.communes.map((commune) => (
                    <SelectItem key={commune} value={commune}>
                      {commune}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.commune && (
                <p className="text-destructive text-sm">{errors.commune.message}</p>
              )}
            </div>

            {/* Delivery Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Truck className="w-5 h-5 text-gold" />
                نوع التوصيل
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType("office")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "office"
                      ? "border-gold bg-gold/10 shadow-gold"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Building className={`w-8 h-8 mx-auto mb-2 ${deliveryType === "office" ? "text-gold" : "text-muted-foreground"}`} />
                  <p className="font-semibold">للمكتب</p>
                  <p className="text-gold font-bold">{officePrice} دج</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("home")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "home"
                      ? "border-gold bg-gold/10 shadow-gold"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Home className={`w-8 h-8 mx-auto mb-2 ${deliveryType === "home" ? "text-gold" : "text-muted-foreground"}`} />
                  <p className="font-semibold">للمنزل</p>
                  <p className="text-gold font-bold">{homePrice} دج</p>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-lg mb-4">ملخص الطلبية</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">سعر المنتج</span>
                <span className="font-semibold">{productPrice.toLocaleString()} دج</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">سعر التوصيل</span>
                <span className="font-semibold">{deliveryPrice.toLocaleString()} دج</span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between text-xl">
                <span className="font-bold">المجموع الكلي</span>
                <span className="font-bold text-gold">{totalPrice.toLocaleString()} دج</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري التسجيل..." : "✅ تأكيد الطلب"}
            </Button>

            {/* Security Note */}
            <p className="text-center text-sm text-muted-foreground">
              🔒 معلوماتك محمية ولن تُشارك مع أي طرف ثالث
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;

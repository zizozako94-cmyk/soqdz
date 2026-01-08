import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, MapPin, Truck, Home, Building, Gift, MapPinned } from "lucide-react";
import { trackPurchase, trackInitiateCheckout } from "@/lib/metaPixel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationCombobox } from "./LocationCombobox";
import { wilayas, getWilayaByName } from "@/data/algeriaLocations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100),
  phone: z.string().regex(/^0[567]\d{8}$/, "رقم الهاتف غير صحيح (يجب أن يبدأ ب 05, 06 أو 07)"),
  wilaya: z.string().min(1, "الرجاء اختيار الولاية"),
  commune: z.string().min(1, "الرجاء اختيار البلدية"),
  residence: z.string().max(200).optional(),
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

interface WilayaPrice {
  wilaya_name: string;
  home_price: number;
  office_price: number;
}

const OrderForm = ({ product, deliverySettings }: OrderFormProps) => {
  const [deliveryType, setDeliveryType] = useState<"office" | "home">("office");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freeShippingWilayas, setFreeShippingWilayas] = useState<string[]>([]);
  const [wilayaPrices, setWilayaPrices] = useState<WilayaPrice[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch free shipping wilayas and wilaya prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [freeShipRes, pricesRes] = await Promise.all([
          supabase
            .from("free_shipping_wilayas")
            .select("wilaya_name")
            .eq("is_active", true),
          supabase
            .from("wilaya_delivery_prices")
            .select("wilaya_name, home_price, office_price")
        ]);
        
        if (freeShipRes.data) {
          setFreeShippingWilayas(freeShipRes.data.map(w => w.wilaya_name));
        }
        if (pricesRes.data) {
          setWilayaPrices(pricesRes.data);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

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
  const watchedCommune = watch("commune");
  const selectedWilayaData = getWilayaByName(watchedWilaya);

  // Prepare wilaya options for combobox
  const wilayaOptions = useMemo(() => 
    wilayas.map((wilaya) => ({
      value: wilaya.name,
      label: wilaya.name,
      code: wilaya.code,
    })),
    []
  );

  // Prepare commune options based on selected wilaya
  const communeOptions = useMemo(() => {
    if (!selectedWilayaData) return [];
    return selectedWilayaData.communes.map((commune) => ({
      value: commune,
      label: commune,
    }));
  }, [selectedWilayaData]);

  const productPrice = product?.price || 9200;
  
  // Get wilaya-specific prices
  const currentWilayaPrice = wilayaPrices.find(w => w.wilaya_name === watchedWilaya);
  const officePrice = currentWilayaPrice?.office_price || deliverySettings?.office_price || 350;
  const homePrice = currentWilayaPrice?.home_price || deliverySettings?.home_price || 600;
  
  // Check if selected wilaya has free shipping
  const isFreeShipping = watchedWilaya && freeShippingWilayas.includes(watchedWilaya);
  const deliveryPrice = isFreeShipping ? 0 : (deliveryType === "office" ? officePrice : homePrice);
  const totalPrice = productPrice + deliveryPrice;

  const handleWilayaChange = (value: string) => {
    setSelectedWilaya(value);
    setValue("wilaya", value);
    setValue("commune", "");
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // Use edge function with rate limiting for order submission
      const response = await supabase.functions.invoke('submit-order', {
        body: {
          customer_name: data.customerName,
          phone: data.phone,
          wilaya: data.wilaya,
          commune: data.commune,
          residence: data.residence || "",
          delivery_type: deliveryType,
          product_id: product?.id,
          product_price: productPrice,
          delivery_price: deliveryPrice,
          total_price: totalPrice,
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to submit order');
      }

      // Check for rate limit error in response data
      if (response.data?.error) {
        if (response.data.error.includes('Too many orders')) {
          toast({
            title: "الرجاء الانتظار",
            description: "لقد قمت بإرسال عدة طلبات. يرجى المحاولة لاحقاً.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(response.data.error);
      }

      // Track Facebook Pixel Purchase event on successful order
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: totalPrice,
          currency: 'DZD',
          content_name: product?.name || "Product",
          content_type: "product",
          content_ids: product?.id ? [product.id] : []
        });
        console.log('Facebook Pixel: Purchase event tracked successfully', { value: totalPrice, currency: 'DZD' });
      }

      // Navigate to success page
      navigate("/success");
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
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="bg-background rounded-3xl shadow-strong p-6 md:p-8 space-y-6"
            onFocus={() => {
              // Track InitiateCheckout when user starts filling the form
              trackInitiateCheckout({ value: productPrice, currency: "DZD" });
            }}
          >
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
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base md:text-lg font-semibold">
                <MapPin className="w-5 h-5 text-gold" />
                الولاية
              </Label>
              <LocationCombobox
                options={wilayaOptions}
                value={watchedWilaya || ""}
                onValueChange={handleWilayaChange}
                placeholder="🔍 ابحث واختر الولاية"
                searchPlaceholder="اكتب اسم الولاية أو رقمها..."
                emptyMessage="لم يتم العثور على ولاية"
                showCode={true}
              />
              {errors.wilaya && (
                <p className="text-destructive text-sm font-medium">{errors.wilaya.message}</p>
              )}
            </div>

            {/* Commune */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base md:text-lg font-semibold">
                <MapPin className="w-5 h-5 text-gold" />
                البلدية
              </Label>
              <LocationCombobox
                options={communeOptions}
                value={watchedCommune || ""}
                onValueChange={(value) => setValue("commune", value)}
                placeholder={selectedWilayaData ? "🔍 ابحث واختر البلدية" : "اختر الولاية أولاً"}
                searchPlaceholder="اكتب اسم البلدية..."
                emptyMessage="لم يتم العثور على بلدية"
                disabled={!selectedWilayaData}
              />
              {errors.commune && (
                <p className="text-destructive text-sm font-medium">{errors.commune.message}</p>
              )}
            </div>

            {/* Residence / Place of Residence (Optional) */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base md:text-lg font-semibold">
                <MapPinned className="w-5 h-5 text-gold" />
                مكان الإقامة
                <span className="text-muted-foreground text-sm font-normal">(اختياري)</span>
              </Label>
              <Input
                {...register("residence")}
                placeholder="مثال: حي 500 مسكن، عمارة ب، رقم 12"
                className="min-h-[55px] h-auto py-3 px-4 text-base md:text-lg font-medium border-2 border-border/60 hover:border-gold/50 focus:border-gold bg-background hover:bg-muted/30 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
              />
            </div>

            {/* Free Shipping Notice */}
            {isFreeShipping && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-bold text-green-700 dark:text-green-300">🎉 شحن مجاني!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">هذه الولاية تستفيد من الشحن المجاني</p>
                </div>
              </div>
            )}

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
                  <p className={`font-bold ${isFreeShipping ? "text-green-600 line-through" : "text-gold"}`}>
                    {isFreeShipping ? `${officePrice} دج` : `${officePrice} دج`}
                  </p>
                  {isFreeShipping && <p className="text-green-600 font-bold">مجاني</p>}
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
                  <p className={`font-bold ${isFreeShipping ? "text-green-600 line-through" : "text-gold"}`}>
                    {isFreeShipping ? `${homePrice} دج` : `${homePrice} دج`}
                  </p>
                  {isFreeShipping && <p className="text-green-600 font-bold">مجاني</p>}
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
                <span className={`font-semibold ${isFreeShipping ? "text-green-600" : ""}`}>
                  {isFreeShipping ? "مجاني 🎁" : `${deliveryPrice.toLocaleString()} دج`}
                </span>
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

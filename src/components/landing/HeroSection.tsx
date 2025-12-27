import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  product: {
    name: string;
    price: number;
    description: string;
    features: string[];
    images: string[];
    stock_count: number;
  } | null;
  onOrderClick: () => void;
}

const HeroSection = ({ product, onOrderClick }: HeroSectionProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Default images if no product images
  const images = product?.images?.length 
    ? product.images 
    : ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Product Info */}
          <div className="space-y-6 animate-fade-in order-2 lg:order-1">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-urgent/10 text-urgent px-4 py-2 rounded-full animate-pulse-slow">
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">
                ⚡ تبقى فقط {product?.stock_count || 50} قطعة!
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {product?.name || "حفارة HONESTPRO 800 واط"}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product?.description || "حفارة احترافية بقوة 800 واط موديل YAE2259 - جودة عالية وأداء ممتاز"}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {(product?.features || ["قوة 800 واط", "موديل YAE2259", "ضمان سنة كاملة", "صناعة متينة"]).map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-soft"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Award className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="bg-card p-6 rounded-2xl shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">السعر</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gold">
                      {(product?.price || 9200).toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground">دج</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">الدفع عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              onClick={onOrderClick}
            >
              🛒 اطلب الآن
            </Button>
          </div>

          {/* Product Images */}
          <div className="relative order-1 lg:order-2">
            <div className="relative bg-card rounded-3xl shadow-strong overflow-hidden aspect-square">
              {/* Image Slider */}
              <div className="relative w-full h-full">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ${
                      index === currentImage 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-95"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`صورة المنتج ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-soft hover:shadow-medium transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-soft hover:shadow-medium transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImage 
                        ? "bg-gold w-8" 
                        : "bg-card/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-gold text-secondary-foreground px-6 py-3 rounded-2xl shadow-gold font-bold text-lg animate-float">
              🔥 عرض محدود
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

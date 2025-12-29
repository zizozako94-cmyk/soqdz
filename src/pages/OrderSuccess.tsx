import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const hasPlayedConfetti = useRef(false);

  useEffect(() => {
    if (hasPlayedConfetti.current) return;
    hasPlayedConfetti.current = true;

    // Fire confetti from both sides
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#D4AF37', '#1E3A5F', '#22c55e', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst in the center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });
    }, 300);
  }, []);

  return (
    <>
      <Helmet>
        <title>تم تأكيد الطلب بنجاح</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Animated Checkmark */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-success/10 rounded-full animate-pulse" />
            <div className="relative w-full h-full bg-success rounded-full flex items-center justify-center shadow-lg animate-scale-in">
              <CheckCircle className="w-16 h-16 text-white animate-bounce-soft" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              تهانينا! تم استلام طلبك بنجاح
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              شكراً لثقتك بنا. سيقوم فريق خدمة العملاء بالاتصال بك خلال الساعات القادمة لتأكيد طلبيتك وترتيب عملية التوصيل.
            </p>
          </div>

          {/* Order Confirmation Icon */}
          <div className="flex justify-center gap-4 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <span className="text-2xl">📦</span>
              <span>طلبك قيد المعالجة</span>
            </div>
          </div>

          {/* Back Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/")}
              className="min-w-[200px]"
            >
              العودة للمتجر
            </Button>
          </div>

          {/* Contact Info */}
          <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.9s' }}>
            📞 إذا كان لديك أي استفسار، لا تتردد في التواصل معنا عبر واتساب
          </p>
        </div>
      </main>
    </>
  );
};

export default OrderSuccess;

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

const WhatsAppButton = ({ phoneNumber = "213555123456" }: WhatsAppButtonProps) => {
  const handleClick = () => {
    const message = encodeURIComponent("مرحباً، أريد الاستفسار عن المنتج");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-whatsapp text-white p-4 rounded-full shadow-strong hover:shadow-float hover:scale-110 transition-all duration-300 animate-bounce-soft"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
};

export default WhatsAppButton;

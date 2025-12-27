import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-right">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">من نحن</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              نحن متجر إلكتروني جزائري متخصص في توفير أفضل الأدوات والمعدات بأسعار تنافسية مع خدمة توصيل لجميع الولايات.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <Phone className="w-5 h-5" />
                <span dir="ltr">+213 555 123 456</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <Mail className="w-5 h-5" />
                <span>contact@store.dz</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5" />
                <span>الجزائر العاصمة</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">ساعات العمل</h3>
            <p className="text-primary-foreground/80">
              السبت - الخميس: 9:00 - 18:00
              <br />
              الجمعة: عطلة
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

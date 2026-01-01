import { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StoreSettings {
  about_us: string;
  phone: string;
  email: string;
  address: string;
  working_hours_weekdays: string;
  working_hours_friday: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    about_us: "نحن متجر إلكتروني جزائري متخصص في توفير أفضل الأدوات والمعدات بأسعار تنافسية مع خدمة توصيل لجميع الولايات.",
    phone: "+213 555 123 456",
    email: "contact@store.dz",
    address: "الجزائر العاصمة",
    working_hours_weekdays: "السبت - الخميس: 9:00 - 18:00",
    working_hours_friday: "الجمعة: عطلة",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .maybeSingle();

      if (data && !error) {
        setSettings({
          about_us: data.about_us,
          phone: data.phone,
          email: data.email,
          address: data.address,
          working_hours_weekdays: data.working_hours_weekdays,
          working_hours_friday: data.working_hours_friday,
        });
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-right">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">من نحن</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              {settings.about_us}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <Phone className="w-5 h-5" />
                <span dir="ltr">{settings.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <Mail className="w-5 h-5" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">ساعات العمل</h3>
            <p className="text-primary-foreground/80">
              {settings.working_hours_weekdays}
              <br />
              {settings.working_hours_friday}
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

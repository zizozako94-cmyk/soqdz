import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Package, RefreshCw, Image, Plus, X, Upload, Camera } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
  features: string[] | null;
  stock_count: number | null;
}

const ProductsManager = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 9200,
    images: [] as string[],
    stock_count: 50,
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المنتج",
        variant: "destructive",
      });
    } else if (data) {
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        price: data.price,
        images: data.images || [],
        stock_count: data.stock_count || 50,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSave = async () => {
    if (!product) return;

    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        images: formData.images,
        stock_count: formData.stock_count,
      })
      .eq("id", product.id);

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحفظ",
        description: "تم حفظ تغييرات المنتج بنجاح",
      });
    }
    setSaving(false);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "خطأ",
          description: `الملف ${file.name} ليس صورة صالحة`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: `الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت`,
          variant: "destructive",
        });
        continue;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        toast({
          title: "خطأ في الرفع",
          description: `فشل في رفع ${file.name}`,
          variant: "destructive",
        });
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      uploadedUrls.push(urlData.publicUrl);
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast({
        title: "تم الرفع",
        description: `تم رفع ${uploadedUrls.length} صورة بنجاح`,
      });
    }

    setUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>لا يوجد منتج للتعديل</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          تعديل المنتج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المنتج</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="HONESTPRO 800W"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">السعر (دج)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              placeholder="9200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">وصف المنتج</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="أدخل وصف المنتج..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">الكمية المتوفرة</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock_count}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stock_count: Number(e.target.value),
              }))
            }
            placeholder="50"
            className="w-32"
          />
        </div>

        <div className="space-y-4">
          <Label>صور المنتج</Label>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Mobile-friendly upload buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 h-14 sm:h-12 text-base sm:text-sm border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {uploading ? (
                <RefreshCw className="h-5 w-5 ml-2 animate-spin" />
              ) : (
                <Upload className="h-5 w-5 ml-2" />
              )}
              {uploading ? "جاري الرفع..." : "رفع صور من الجهاز"}
            </Button>
            
            {/* Camera button for mobile */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                  fileInputRef.current.removeAttribute('capture');
                }
              }}
              disabled={uploading}
              className="flex-1 h-14 sm:h-12 text-base sm:text-sm border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors sm:hidden"
            >
              <Camera className="h-5 w-5 ml-2" />
              التقاط صورة
            </Button>
          </div>
          
          {/* URL input as alternative */}
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="أو أدخل رابط الصورة..."
              className="flex-1"
            />
            <Button onClick={addImage} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder.svg";
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {formData.images.length === 0 && (
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>لا توجد صور - اضغط لرفع صور</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsManager;

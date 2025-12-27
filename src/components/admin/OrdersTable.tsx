import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, RefreshCw, Package } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  delivery_type: string;
  total_price: number;
  status: string;
}

const statusOptions = [
  { value: "pending", label: "قيد الانتظار", color: "bg-yellow-500" },
  { value: "confirmed", label: "مؤكد", color: "bg-blue-500" },
  { value: "shipped", label: "تم الشحن", color: "bg-purple-500" },
  { value: "delivered", label: "تم التوصيل", color: "bg-green-500" },
  { value: "cancelled", label: "ملغى", color: "bg-red-500" },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الطلبات",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive",
      });
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح",
      });
    }
    setUpdating(null);
  };

  const openWhatsApp = (phone: string, customerName: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0")
      ? `213${cleanPhone.slice(1)}`
      : cleanPhone;
    const message = encodeURIComponent(
      `مرحباً ${customerName}، نتواصل معك بخصوص طلبك من HONESTPRO.`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs text-white ${
          statusOption?.color || "bg-gray-500"
        }`}
      >
        {statusOption?.label || status}
      </span>
    );
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          إدارة الطلبات ({orders.length})
        </CardTitle>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد طلبات حتى الآن</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">التوصيل</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-right whitespace-nowrap">
                      {format(new Date(order.created_at), "dd/MM/yyyy", {
                        locale: ar,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.customer_name}
                    </TableCell>
                    <TableCell className="text-right" dir="ltr">
                      {order.phone}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.wilaya} - {order.commune}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.delivery_type === "home" ? "المنزل" : "المكتب"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {order.total_price.toLocaleString()} دج
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value)
                        }
                        disabled={updating === order.id}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            {getStatusBadge(order.status)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() =>
                          openWhatsApp(order.phone, order.customer_name)
                        }
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;

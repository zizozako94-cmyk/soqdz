export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      delivery_settings: {
        Row: {
          home_price: number
          id: string
          office_price: number
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          home_price?: number
          id?: string
          office_price?: number
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          home_price?: number
          id?: string
          office_price?: number
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          content: string
          created_at: string
          icon_name: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      free_shipping_wilayas: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          wilaya_code: string
          wilaya_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          wilaya_code: string
          wilaya_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          wilaya_code?: string
          wilaya_name?: string
        }
        Relationships: []
      }
      landing_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          commune: string
          created_at: string
          customer_name: string
          delivery_price: number
          delivery_type: string
          id: string
          phone: string
          product_id: string | null
          product_price: number
          status: string
          total_price: number
          updated_at: string
          wilaya: string
        }
        Insert: {
          commune: string
          created_at?: string
          customer_name: string
          delivery_price: number
          delivery_type: string
          id?: string
          phone: string
          product_id?: string | null
          product_price: number
          status?: string
          total_price: number
          updated_at?: string
          wilaya: string
        }
        Update: {
          commune?: string
          created_at?: string
          customer_name?: string
          delivery_price?: number
          delivery_type?: string
          id?: string
          phone?: string
          product_id?: string | null
          product_price?: number
          status?: string
          total_price?: number
          updated_at?: string
          wilaya?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          name: string
          price: number
          stock_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          name: string
          price?: number
          stock_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          stock_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      sales_popups: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          is_active: boolean | null
          is_fake: boolean | null
          product_name: string
          wilaya: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          is_active?: boolean | null
          is_fake?: boolean | null
          product_name: string
          wilaya: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          is_active?: boolean | null
          is_fake?: boolean | null
          product_name?: string
          wilaya?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          border_radius: string | null
          created_at: string
          facebook_pixel: string | null
          font_family: string | null
          hero_video_url: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
          show_sales_popup: boolean | null
          snapchat_pixel: string | null
          sticky_order_bar: boolean | null
          tiktok_pixel: string | null
          updated_at: string
          whatsapp_template: string | null
        }
        Insert: {
          accent_color?: string | null
          border_radius?: string | null
          created_at?: string
          facebook_pixel?: string | null
          font_family?: string | null
          hero_video_url?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_sales_popup?: boolean | null
          snapchat_pixel?: string | null
          sticky_order_bar?: boolean | null
          tiktok_pixel?: string | null
          updated_at?: string
          whatsapp_template?: string | null
        }
        Update: {
          accent_color?: string | null
          border_radius?: string | null
          created_at?: string
          facebook_pixel?: string | null
          font_family?: string | null
          hero_video_url?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          show_sales_popup?: boolean | null
          snapchat_pixel?: string | null
          sticky_order_bar?: boolean | null
          tiktok_pixel?: string | null
          updated_at?: string
          whatsapp_template?: string | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          about_us: string
          address: string
          created_at: string
          email: string
          id: string
          phone: string
          updated_at: string
          working_hours_friday: string
          working_hours_weekdays: string
        }
        Insert: {
          about_us?: string
          address?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string
          working_hours_friday?: string
          working_hours_weekdays?: string
        }
        Update: {
          about_us?: string
          address?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string
          working_hours_friday?: string
          working_hours_weekdays?: string
        }
        Relationships: []
      }
      trust_badges: {
        Row: {
          badge_type: string | null
          created_at: string
          description: string | null
          icon_name: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          badge_type?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          badge_type?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

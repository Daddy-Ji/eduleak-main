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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audience: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      coachings: {
        Row: {
          brand_color: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          brand_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          brand_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      course_files: {
        Row: {
          course_id: string
          created_at: string
          display_order: number
          file_url: string
          id: string
          name: string
        }
        Insert: {
          course_id: string
          created_at?: string
          display_order?: number
          file_url: string
          id?: string
          name: string
        }
        Update: {
          course_id?: string
          created_at?: string
          display_order?: number
          file_url?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_files_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          coaching_id: string | null
          course_type: Database["public"]["Enums"]["course_type"]
          cover_url: string | null
          created_at: string
          description: string | null
          display_order: number
          exam_id: string | null
          external_url: string | null
          id: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          coaching_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          exam_id?: string | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          coaching_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          exam_id?: string | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_coaching_id_fkey"
            columns: ["coaching_id"]
            isOneToOne: false
            referencedRelation: "coachings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      featured_institutes: {
        Row: {
          created_at: string
          display_order: number
          id: string
          link_url: string | null
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          link_url?: string | null
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          link_url?: string | null
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          title: string
          youtube_id: string
          youtube_url: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          title: string
          youtube_id: string
          youtube_url: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          title?: string
          youtube_id?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_active: boolean
          link_url: string | null
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          title?: string
        }
        Relationships: []
      }
      portals: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          embed_in_app: boolean
          emoji: string | null
          id: string
          is_active: boolean
          link_url: string | null
          logo_url: string | null
          subtitle: string | null
          title: string
          whatsapp_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          embed_in_app?: boolean
          emoji?: string | null
          id?: string
          is_active?: boolean
          link_url?: string | null
          logo_url?: string | null
          subtitle?: string | null
          title: string
          whatsapp_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          embed_in_app?: boolean
          emoji?: string | null
          id?: string
          is_active?: boolean
          link_url?: string | null
          logo_url?: string | null
          subtitle?: string | null
          title?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          cta_button_text: string | null
          cta_button_url: string | null
          cta_subtitle: string | null
          cta_title: string | null
          footer_text: string | null
          founders: Json
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          institutes_subtitle: string | null
          institutes_title: string | null
          intro_animation_enabled: boolean | null
          portals_subtitle: string | null
          portals_title: string | null
          site_logo_url: string | null
          site_name: string | null
          tagline: string | null
          telegram_popup_enabled: boolean | null
          telegram_popup_every_visit: boolean | null
          telegram_url: string | null
          updated_at: string
          who_subtitle: string | null
          who_title: string | null
          why_subtitle: string | null
          why_title: string | null
        }
        Insert: {
          cta_button_text?: string | null
          cta_button_url?: string | null
          cta_subtitle?: string | null
          cta_title?: string | null
          footer_text?: string | null
          founders?: Json
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          institutes_subtitle?: string | null
          institutes_title?: string | null
          intro_animation_enabled?: boolean | null
          portals_subtitle?: string | null
          portals_title?: string | null
          site_logo_url?: string | null
          site_name?: string | null
          tagline?: string | null
          telegram_popup_enabled?: boolean | null
          telegram_popup_every_visit?: boolean | null
          telegram_url?: string | null
          updated_at?: string
          who_subtitle?: string | null
          who_title?: string | null
          why_subtitle?: string | null
          why_title?: string | null
        }
        Update: {
          cta_button_text?: string | null
          cta_button_url?: string | null
          cta_subtitle?: string | null
          cta_title?: string | null
          footer_text?: string | null
          founders?: Json
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          institutes_subtitle?: string | null
          institutes_title?: string | null
          intro_animation_enabled?: boolean | null
          portals_subtitle?: string | null
          portals_title?: string | null
          site_logo_url?: string | null
          site_name?: string | null
          tagline?: string | null
          telegram_popup_enabled?: boolean | null
          telegram_popup_every_visit?: boolean | null
          telegram_url?: string | null
          updated_at?: string
          who_subtitle?: string | null
          who_title?: string | null
          why_subtitle?: string | null
          why_title?: string | null
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
      why_us: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          title?: string
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
      app_role: "admin" | "user"
      course_type: "youtube" | "pdf" | "external"
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
      app_role: ["admin", "user"],
      course_type: ["youtube", "pdf", "external"],
    },
  },
} as const

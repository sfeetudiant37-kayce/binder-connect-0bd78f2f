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
      matches: {
        Row: {
          client_fit_score: number
          client_id: string
          contact_revealed: boolean
          created_at: string
          id: string
          initiated_by: Database["public"]["Enums"]["app_role"]
          provider_fit_score: number
          provider_id: string
          request_id: string | null
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          client_fit_score?: number
          client_id: string
          contact_revealed?: boolean
          created_at?: string
          id?: string
          initiated_by: Database["public"]["Enums"]["app_role"]
          provider_fit_score?: number
          provider_id: string
          request_id?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          client_fit_score?: number
          client_id?: string
          contact_revealed?: boolean
          created_at?: string
          id?: string
          initiated_by?: Database["public"]["Enums"]["app_role"]
          provider_fit_score?: number
          provider_id?: string
          request_id?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          is_read: boolean
          match_id: string
          sender_id: string
          sent_at: string
        }
        Insert: {
          content: string
          id?: string
          is_read?: boolean
          match_id: string
          sender_id: string
          sent_at?: string
        }
        Update: {
          content?: string
          id?: string
          is_read?: boolean
          match_id?: string
          sender_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_role: Database["public"]["Enums"]["app_role"]
          availability: Database["public"]["Enums"]["availability"]
          bio: string | null
          created_at: string
          email: string
          experience: number | null
          facebook: string | null
          id: string
          language: Database["public"]["Enums"]["app_lang"]
          location: string
          name: string
          objective: Database["public"]["Enums"]["objective"]
          phone: string | null
          photo_url: string | null
          preferences: string[]
          price: number | null
          profile_completion: number
          rating: number
          review_count: number
          skills: string[]
          title: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          active_role?: Database["public"]["Enums"]["app_role"]
          availability?: Database["public"]["Enums"]["availability"]
          bio?: string | null
          created_at?: string
          email: string
          experience?: number | null
          facebook?: string | null
          id: string
          language?: Database["public"]["Enums"]["app_lang"]
          location?: string
          name?: string
          objective?: Database["public"]["Enums"]["objective"]
          phone?: string | null
          photo_url?: string | null
          preferences?: string[]
          price?: number | null
          profile_completion?: number
          rating?: number
          review_count?: number
          skills?: string[]
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          active_role?: Database["public"]["Enums"]["app_role"]
          availability?: Database["public"]["Enums"]["availability"]
          bio?: string | null
          created_at?: string
          email?: string
          experience?: number | null
          facebook?: string | null
          id?: string
          language?: Database["public"]["Enums"]["app_lang"]
          location?: string
          name?: string
          objective?: Database["public"]["Enums"]["objective"]
          phone?: string | null
          photo_url?: string | null
          preferences?: string[]
          price?: number | null
          profile_completion?: number
          rating?: number
          review_count?: number
          skills?: string[]
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          from_user_id: string
          id: string
          match_id: string
          rating: number
          to_user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          match_id: string
          rating: number
          to_user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          match_id?: string
          rating?: number
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          budget: number
          category: string
          client_id: string
          created_at: string
          description: string
          id: string
          location: string
          skills: string[]
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency"]
        }
        Insert: {
          budget?: number
          category: string
          client_id: string
          created_at?: string
          description: string
          id?: string
          location: string
          skills?: string[]
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency"]
        }
        Update: {
          budget?: number
          category?: string
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          location?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency"]
        }
        Relationships: []
      }
      swipes: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["swipe_dir"]
          fit_score: number
          id: string
          swiper_role: Database["public"]["Enums"]["app_role"]
          target_id: string
          target_type: Database["public"]["Enums"]["swipe_target"]
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["swipe_dir"]
          fit_score?: number
          id?: string
          swiper_role: Database["public"]["Enums"]["app_role"]
          target_id: string
          target_type: Database["public"]["Enums"]["swipe_target"]
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["swipe_dir"]
          fit_score?: number
          id?: string
          swiper_role?: Database["public"]["Enums"]["app_role"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["swipe_target"]
          user_id?: string
        }
        Relationships: []
      }
      weights: {
        Row: {
          availability: number
          experience: number
          location: number
          preferences: number
          price: number
          profile_completeness: number
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: number
          experience?: number
          location?: number
          preferences?: number
          price?: number
          profile_completeness?: number
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: number
          experience?: number
          location?: number
          preferences?: number
          price?: number
          profile_completeness?: number
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_lang: "en" | "fr"
      app_role: "client" | "provider"
      availability: "immediate" | "this_week" | "flexible" | "busy"
      match_status:
        | "provider_interested"
        | "client_interested"
        | "mutual"
        | "contacted"
        | "completed"
      objective:
        | "find_service"
        | "offer_service"
        | "find_job"
        | "recruit_talent"
        | "grow_brand"
        | "network"
      request_status: "open" | "in_progress" | "completed"
      swipe_dir: "left" | "right"
      swipe_target: "user" | "request"
      urgency: "urgent" | "this_week" | "flexible"
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
      app_lang: ["en", "fr"],
      app_role: ["client", "provider"],
      availability: ["immediate", "this_week", "flexible", "busy"],
      match_status: [
        "provider_interested",
        "client_interested",
        "mutual",
        "contacted",
        "completed",
      ],
      objective: [
        "find_service",
        "offer_service",
        "find_job",
        "recruit_talent",
        "grow_brand",
        "network",
      ],
      request_status: ["open", "in_progress", "completed"],
      swipe_dir: ["left", "right"],
      swipe_target: ["user", "request"],
      urgency: ["urgent", "this_week", "flexible"],
    },
  },
} as const

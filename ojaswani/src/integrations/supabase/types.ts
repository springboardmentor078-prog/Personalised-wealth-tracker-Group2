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
      goals: {
        Row: {
          created_at: string
          current_amount: number
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          monthly_contribution: number
          status: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          monthly_contribution?: number
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          monthly_contribution?: number
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          avg_buy_price: number
          cost_basis: number
          created_at: string
          current_value: number
          id: string
          last_price: number
          last_price_at: string | null
          name: string | null
          symbol: string
          units: number
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          avg_buy_price?: number
          cost_basis?: number
          created_at?: string
          current_value?: number
          id?: string
          last_price?: number
          last_price_at?: string | null
          name?: string | null
          symbol: string
          units?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          avg_buy_price?: number
          cost_basis?: number
          created_at?: string
          current_value?: number
          id?: string
          last_price?: number
          last_price_at?: string | null
          name?: string | null
          symbol?: string
          units?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          name: string | null
          risk_profile: Database["public"]["Enums"]["risk_profile"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          name?: string | null
          risk_profile?: Database["public"]["Enums"]["risk_profile"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          name?: string | null
          risk_profile?: Database["public"]["Enums"]["risk_profile"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string
          id: string
          recommendation_text: string | null
          suggested_allocation: Json
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommendation_text?: string | null
          suggested_allocation?: Json
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recommendation_text?: string | null
          suggested_allocation?: Json
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      simulations: {
        Row: {
          assumptions: Json
          created_at: string
          goal_id: string | null
          id: string
          results: Json
          scenario_name: string
          user_id: string
        }
        Insert: {
          assumptions?: Json
          created_at?: string
          goal_id?: string | null
          id?: string
          results?: Json
          scenario_name: string
          user_id: string
        }
        Update: {
          assumptions?: Json
          created_at?: string
          goal_id?: string | null
          id?: string
          results?: Json
          scenario_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          executed_at: string
          fees: number
          id: string
          investment_id: string | null
          price: number
          quantity: number
          symbol: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          executed_at?: string
          fees?: number
          id?: string
          investment_id?: string | null
          price?: number
          quantity?: number
          symbol: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          executed_at?: string
          fees?: number
          id?: string
          investment_id?: string | null
          price?: number
          quantity?: number
          symbol?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_type: "stock" | "etf" | "mutual_fund" | "bond" | "cash"
      goal_status: "active" | "paused" | "completed"
      goal_type: "retirement" | "home" | "education" | "custom"
      kyc_status: "unverified" | "verified"
      risk_profile: "conservative" | "moderate" | "aggressive"
      transaction_type:
        | "buy"
        | "sell"
        | "dividend"
        | "contribution"
        | "withdrawal"
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
      asset_type: ["stock", "etf", "mutual_fund", "bond", "cash"],
      goal_status: ["active", "paused", "completed"],
      goal_type: ["retirement", "home", "education", "custom"],
      kyc_status: ["unverified", "verified"],
      risk_profile: ["conservative", "moderate", "aggressive"],
      transaction_type: [
        "buy",
        "sell",
        "dividend",
        "contribution",
        "withdrawal",
      ],
    },
  },
} as const

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, ShieldCheck, ShieldAlert, User, Mail, Save } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const riskProfiles = [
  {
    value: "conservative" as const,
    label: "Conservative",
    icon: <Shield className="w-6 h-6" />,
    description: "Low risk tolerance. Prefer stable, fixed-income investments with minimal volatility.",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    allocation: { Bonds: 60, Stocks: 20, Cash: 15, Alternatives: 5 },
  },
  {
    value: "moderate" as const,
    label: "Moderate",
    icon: <ShieldCheck className="w-6 h-6" />,
    description: "Balanced approach. Mix of growth and income with moderate volatility tolerance.",
    color: "bg-wealth-gold/10 text-wealth-warning border-wealth-gold/30",
    allocation: { Bonds: 35, Stocks: 45, Cash: 10, Alternatives: 10 },
  },
  {
    value: "aggressive" as const,
    label: "Aggressive",
    icon: <ShieldAlert className="w-6 h-6" />,
    description: "High risk tolerance. Focus on growth assets with higher volatility accepted.",
    color: "bg-wealth-danger/10 text-wealth-danger border-wealth-danger/30",
    allocation: { Bonds: 10, Stocks: 70, Cash: 5, Alternatives: 15 },
  },
];

const RiskProfile = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSelectedRisk(profile.risk_profile as "conservative" | "moderate" | "aggressive");
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      { name, risk_profile: selectedRisk },
      {
        onSuccess: () => {
          toast({ title: "Profile updated successfully!" });
        },
        onError: (error) => {
          toast({ variant: "destructive", title: "Failed to update profile", description: error.message });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
      </div>
    );
  }

  const currentProfile = riskProfiles.find((r) => r.value === selectedRisk) || riskProfiles[1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              <span className="text-gradient">Risk Profile</span>
            </h1>
            <p className="text-muted-foreground">Manage your profile and investment risk preferences</p>
          </div>

          {/* Personal Info */}
          <Card className="p-6 shadow-card border-border/50 mb-6 animate-slide-up">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Name
                </Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email
                </Label>
                <Input value={user?.email || ""} disabled className="bg-muted/50" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Badge variant={profile?.kyc_status === "verified" ? "default" : "secondary"}>
                KYC: {profile?.kyc_status === "verified" ? "Verified ✓" : "Unverified"}
              </Badge>
            </div>
          </Card>

          {/* Risk Profile Selection */}
          <Card className="p-6 shadow-card border-border/50 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Risk Tolerance</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Select the investment approach that matches your comfort level with market volatility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riskProfiles.map((rp) => (
                <button
                  key={rp.value}
                  onClick={() => setSelectedRisk(rp.value)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    selectedRisk === rp.value
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${rp.color} flex items-center justify-center mb-3`}>
                    {rp.icon}
                  </div>
                  <p className="font-display font-semibold text-foreground mb-1">{rp.label}</p>
                  <p className="text-xs text-muted-foreground">{rp.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Suggested Allocation */}
          <Card className="p-6 shadow-card border-border/50 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Suggested Allocation — {currentProfile.label}
            </h3>
            <div className="space-y-3">
              {Object.entries(currentProfile.allocation).map(([asset, pct]) => (
                <div key={asset}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{asset}</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Save Button */}
          <Button variant="accent" size="lg" className="w-full" onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RiskProfile;

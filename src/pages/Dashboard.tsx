import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.name || user?.email?.split("@")[0] || "Investor";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient">{displayName}</span>
            </h1>
            <p className="text-muted-foreground">
              Here's your wealth overview for today
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 animate-slide-up">
            <QuickStats />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <PortfolioOverview />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <MarketOverview />
            </div>
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <GoalProgress />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

import { Target, PieChart, Calculator, BarChart3, Lightbulb, Shield } from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal-Based Planning",
    description: "Set retirement, home, or education goals with smart what-if simulations to plan your path.",
  },
  {
    icon: <PieChart className="w-6 h-6" />,
    title: "Portfolio Builder",
    description: "Build diversified portfolios with stocks, ETFs, and mutual funds tailored to your risk profile.",
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Financial Calculators",
    description: "SIP, retirement, and loan payoff calculators to make informed investment decisions.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Live Dashboards",
    description: "Real-time market sync with beautiful visualizations to track your wealth growth.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Smart Recommendations",
    description: "Personalized asset allocation suggestions based on your goals and market conditions.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    description: "Bank-level encryption to keep your financial data safe and private.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Grow Wealth</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive tools and insights to take control of your financial journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  index 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  index: number;
}) => (
  <div 
    className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-card hover:border-accent/20 transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
      {icon}
    </div>
    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed">
      {description}
    </p>
    
    {/* Hover Glow */}
    <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
  </div>
);

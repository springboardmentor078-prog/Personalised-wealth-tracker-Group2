import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Wealth<span className="text-accent">Wise</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/goals" className="hover:text-foreground transition-colors">Goals</Link>
            <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
            <Link to="/calculators" className="hover:text-foreground transition-colors">Calculators</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 WealthWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

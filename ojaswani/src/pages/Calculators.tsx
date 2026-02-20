import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SIPCalculator } from "@/components/calculators/SIPCalculator";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, PiggyBank, Home, Clock, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const calculators = [
  { id: "sip", name: "SIP Calculator", icon: <PiggyBank className="w-5 h-5" />, description: "Plan your monthly investments" },
  { id: "retirement", name: "Retirement", icon: <Clock className="w-5 h-5" />, description: "Plan for retirement" },
  { id: "loan", name: "Loan Payoff", icon: <Home className="w-5 h-5" />, description: "Calculate loan payments" },
  { id: "returns", name: "Returns", icon: <TrendingUp className="w-5 h-5" />, description: "Calculate expected returns" },
];

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState("sip");
  
  // Retirement Calculator State
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflation, setInflation] = useState(6);

  // Retirement calculations
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = 25; // Assuming 25 years in retirement
  const realReturn = ((1 + expectedReturn / 100) / (1 + inflation / 100) - 1) * 100;
  const inflatedExpenses = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetirement);
  const corpusNeeded = inflatedExpenses * 12 * ((1 - Math.pow(1 + realReturn / 100, -yearsInRetirement)) / (realReturn / 100));
  const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
  const additionalNeeded = Math.max(0, corpusNeeded - futureValueOfSavings);
  const monthlyInvestmentNeeded = additionalNeeded > 0 
    ? (additionalNeeded * (expectedReturn / 100 / 12)) / (Math.pow(1 + expectedReturn / 100 / 12, yearsToRetirement * 12) - 1)
    : 0;

  const retirementChartData = [
    { name: "Current Savings", value: futureValueOfSavings, color: "hsl(222, 47%, 20%)" },
    { name: "Need to Save", value: additionalNeeded, color: "hsl(160, 84%, 39%)" },
  ];

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Loan calculations
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTenure * 12;
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const loanChartData = [
    { name: "Principal", value: loanAmount, color: "hsl(222, 47%, 20%)" },
    { name: "Interest", value: totalInterest, color: "hsl(160, 84%, 39%)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Financial <span className="text-gradient">Calculators</span>
            </h1>
            <p className="text-muted-foreground">
              Plan your investments with powerful calculators
            </p>
          </div>

          {/* Calculator Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeCalculator === calc.id
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-card border-border/50 hover:border-accent/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  activeCalculator === calc.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {calc.icon}
                </div>
                <h3 className="font-medium text-foreground">{calc.name}</h3>
                <p className="text-sm text-muted-foreground">{calc.description}</p>
              </button>
            ))}
          </div>

          {/* Active Calculator */}
          <div className="animate-fade-in">
            {activeCalculator === "sip" && <SIPCalculator />}
            
            {activeCalculator === "retirement" && (
              <Card className="p-6 shadow-card border-border/50">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Retirement Calculator</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Current Age</label>
                        <span className="font-display font-bold text-accent">{currentAge} years</span>
                      </div>
                      <Slider value={[currentAge]} onValueChange={([v]) => setCurrentAge(v)} min={20} max={55} step={1} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Retirement Age</label>
                        <span className="font-display font-bold text-accent">{retirementAge} years</span>
                      </div>
                      <Slider value={[retirementAge]} onValueChange={([v]) => setRetirementAge(v)} min={45} max={70} step={1} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Monthly Expenses (Today)</label>
                        <span className="font-display font-bold text-accent">₹{monthlyExpenses.toLocaleString()}</span>
                      </div>
                      <Slider value={[monthlyExpenses]} onValueChange={([v]) => setMonthlyExpenses(v)} min={10000} max={500000} step={5000} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Current Savings</label>
                        <span className="font-display font-bold text-accent">₹{currentSavings.toLocaleString()}</span>
                      </div>
                      <Slider value={[currentSavings]} onValueChange={([v]) => setCurrentSavings(v)} min={0} max={10000000} step={50000} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Expected Return</label>
                        <span className="font-display font-bold text-accent">{expectedReturn}%</span>
                      </div>
                      <Slider value={[expectedReturn]} onValueChange={([v]) => setExpectedReturn(v)} min={5} max={15} step={0.5} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Expected Inflation</label>
                        <span className="font-display font-bold text-accent">{inflation}%</span>
                      </div>
                      <Slider value={[inflation]} onValueChange={([v]) => setInflation(v)} min={3} max={10} step={0.5} />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={retirementChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                            {retirementChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Corpus Needed</span>
                        <span className="font-display font-semibold text-foreground">₹{corpusNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Years to Retirement</span>
                        <span className="font-display font-semibold text-foreground">{yearsToRetirement} years</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <span className="text-sm font-medium text-foreground">Monthly Investment Needed</span>
                        <span className="font-display text-xl font-bold text-accent">₹{monthlyInvestmentNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeCalculator === "loan" && (
              <Card className="p-6 shadow-card border-border/50">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Loan EMI Calculator</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Loan Amount</label>
                        <span className="font-display font-bold text-accent">₹{loanAmount.toLocaleString()}</span>
                      </div>
                      <Slider value={[loanAmount]} onValueChange={([v]) => setLoanAmount(v)} min={100000} max={10000000} step={50000} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Interest Rate</label>
                        <span className="font-display font-bold text-accent">{interestRate}%</span>
                      </div>
                      <Slider value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} min={5} max={20} step={0.1} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">Loan Tenure</label>
                        <span className="font-display font-bold text-accent">{loanTenure} years</span>
                      </div>
                      <Slider value={[loanTenure]} onValueChange={([v]) => setLoanTenure(v)} min={1} max={30} step={1} />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={loanChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                            {loanChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <span className="font-display font-semibold text-wealth-danger">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Total Payment</span>
                        <span className="font-display font-semibold text-foreground">₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <span className="text-sm font-medium text-foreground">Monthly EMI</span>
                        <span className="font-display text-xl font-bold text-accent">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeCalculator === "returns" && (
              <Card className="p-6 shadow-card border-border/50">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Returns Calculator</h3>
                <p className="text-muted-foreground">Coming soon! Calculate expected returns on your investments.</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calculators;

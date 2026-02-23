import { Layout } from '@/components/layout/Layout';
import { RiskProfileProvider, useRiskProfile } from '@/context/RiskProfileContext';
import { RiskQuestionnaire } from '@/components/risk-profile/RiskQuestionnaire';
import { RiskProfileResult } from '@/components/risk-profile/RiskProfileResult';
import { Shield } from 'lucide-react';

function RiskProfileContent() {
  const { isComplete } = useRiskProfile();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold">Risk Profile Assessment</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isComplete 
            ? "Here's your personalized investment risk profile based on your answers."
            : "Answer a few questions to determine your investment risk tolerance and get personalized portfolio recommendations."
          }
        </p>
      </div>

      {isComplete ? <RiskProfileResult /> : <RiskQuestionnaire />}
    </div>
  );
}

export default function RiskProfilePage() {
  return (
    <Layout>
      <RiskProfileProvider>
        <RiskProfileContent />
      </RiskProfileProvider>
    </Layout>
  );
}

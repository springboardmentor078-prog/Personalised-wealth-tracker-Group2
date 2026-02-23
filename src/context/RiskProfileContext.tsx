import React, { createContext, useContext, useState, useCallback } from 'react';
import { RiskProfileResult } from '@/types/portfolio';
import { riskQuestions, calculateRiskProfile } from '@/data/riskQuestions';

interface RiskProfileContextType {
  answers: Record<number, number>;
  currentQuestion: number;
  result: RiskProfileResult | null;
  isComplete: boolean;
  setAnswer: (questionId: number, score: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitProfile: () => void;
  resetProfile: () => void;
  totalQuestions: number;
}

const RiskProfileContext = createContext<RiskProfileContextType | null>(null);

export function RiskProfileProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<RiskProfileResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const setAnswer = useCallback((questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const submitProfile = useCallback(() => {
    const profileResult = calculateRiskProfile(answers);
    setResult(profileResult);
    setIsComplete(true);
  }, [answers]);

  const resetProfile = useCallback(() => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setIsComplete(false);
  }, []);

  return (
    <RiskProfileContext.Provider
      value={{
        answers,
        currentQuestion,
        result,
        isComplete,
        setAnswer,
        nextQuestion,
        previousQuestion,
        submitProfile,
        resetProfile,
        totalQuestions: riskQuestions.length
      }}
    >
      {children}
    </RiskProfileContext.Provider>
  );
}

export function useRiskProfile() {
  const context = useContext(RiskProfileContext);
  if (!context) {
    throw new Error('useRiskProfile must be used within RiskProfileProvider');
  }
  return context;
}

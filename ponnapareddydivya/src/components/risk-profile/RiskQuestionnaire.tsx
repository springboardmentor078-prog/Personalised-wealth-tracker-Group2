import { useRiskProfile } from '@/context/RiskProfileContext';
import { riskQuestions } from '@/data/riskQuestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RiskQuestionnaire() {
  const {
    answers,
    currentQuestion,
    setAnswer,
    nextQuestion,
    previousQuestion,
    submitProfile,
    totalQuestions
  } = useRiskProfile();

  const question = riskQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasAnswer = answers[question.id] !== undefined;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <CardTitle className="text-2xl font-display">{question.question}</CardTitle>
          <CardDescription>
            Select the option that best describes your situation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === option.score;
              return (
                <button
                  key={index}
                  onClick={() => setAnswer(question.id, option.score)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={submitProfile}
                disabled={!allAnswered}
                className="gap-2 gradient-primary border-0"
              >
                Submit Profile
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!hasAnswer}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

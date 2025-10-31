'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string; // Optional action button text
  onAction?: () => void;
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip: () => void;
  isOpen: boolean;
}

export function OnboardingTour({ steps, onComplete, onSkip, isOpen }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      setHighlightedElement(element);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }

    return () => {
      setHighlightedElement(null);
    };
  }, [currentStep, isOpen, steps]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />

      {/* Highlight box */}
      {highlightedElement && (
        <div
          className="fixed z-[101] pointer-events-none transition-all duration-300"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
            border: '3px solid hsl(var(--primary))',
            borderRadius: '12px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Tour Card */}
      <Card className={cn(
        "fixed z-[102] w-96 shadow-2xl animate-in fade-in zoom-in duration-300",
        !currentStepData.target && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      )}
      style={currentStepData.target && highlightedElement ? getCardPosition(highlightedElement, currentStepData.position) : {}}
      >
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle className="text-lg">Welcome to Trendix!</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={onSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{currentStepData.title}</span>
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStepData.description}
          </p>

          {currentStepData.action && (
            <Button
              className="w-full"
              onClick={() => {
                currentStepData.onAction?.();
                handleNext();
              }}
            >
              {currentStepData.action}
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentStep ? "w-6 bg-primary" : "w-2 bg-muted"
                )}
              />
            ))}
          </div>

          {!currentStepData.action && (
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? (
                <>
                  Complete
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

function getCardPosition(element: HTMLElement, position?: string) {
  const rect = element.getBoundingClientRect();
  const cardWidth = 384; // w-96
  const cardHeight = 300; // approximate
  const gap = 20;

  switch (position) {
    case 'top':
      return {
        top: rect.top - cardHeight - gap,
        left: rect.left + rect.width / 2 - cardWidth / 2,
      };
    case 'bottom':
      return {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2 - cardWidth / 2,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - cardHeight / 2,
        left: rect.left - cardWidth - gap,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - cardHeight / 2,
        left: rect.right + gap,
      };
    default:
      return {
        top: rect.bottom + gap,
        left: rect.left,
      };
  }
}

// Predefined onboarding tours
export const DASHBOARD_TOUR: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard',
    description: 'This is your command center for all social media management. Let\'s take a quick tour to get you started!',
    position: 'center',
  },
  {
    id: 'social-stats',
    title: 'Social Media Stats',
    description: 'Track your followers and growth across all platforms in real-time. Connect your accounts in Settings to see live data.',
    target: '[data-tour="social-stats"]',
    position: 'bottom',
  },
  {
    id: 'engagement',
    title: 'Engagement Overview',
    description: 'Monitor likes, comments, shares, and reach. See how your content performs across all platforms.',
    target: '[data-tour="engagement"]',
    position: 'top',
  },
  {
    id: 'trends',
    title: 'Trending Topics',
    description: 'Discover hot topics, hashtags, and sounds in your niche. Click "Use Trend" to create content instantly!',
    target: '[data-tour="trends"]',
    position: 'left',
  },
  {
    id: 'create-button',
    title: 'Create Content',
    description: 'Ready to create? Click here to start making posts, videos, or schedule content across all your platforms.',
    target: '[data-tour="create-button"]',
    position: 'bottom',
  },
];

export const VIDEO_EDITOR_TOUR: OnboardingStep[] = [
  {
    id: 'welcome-video',
    title: 'Welcome to the Video Editor',
    description: 'Create professional videos with AI-powered tools. Let\'s explore the key features!',
    position: 'center',
  },
  {
    id: 'ai-tools',
    title: 'AI Generation Tools',
    description: 'Generate videos from text, animate images, or create lip-sync videos with AI. Choose a tool to get started.',
    target: '[data-tour="ai-tools"]',
    position: 'right',
  },
  {
    id: 'effects',
    title: 'Effects & Filters',
    description: 'Add professional effects, transitions, and color grading to make your videos stand out.',
    target: '[data-tour="effects"]',
    position: 'left',
  },
  {
    id: 'export',
    title: 'Export & Share',
    description: 'When you\'re done, export in the perfect format for any platform - TikTok, Instagram, YouTube, and more!',
    target: '[data-tour="export"]',
    position: 'bottom',
  },
];

export const COMPOSER_TOUR: OnboardingStep[] = [
  {
    id: 'welcome-composer',
    title: 'Content Composer',
    description: 'Create and schedule posts across all your social media platforms from one place!',
    position: 'center',
  },
  {
    id: 'ai-generate',
    title: 'AI Content Generation',
    description: 'Let AI write engaging captions, suggest hashtags, and create content ideas for you.',
    target: '[data-tour="ai-generate"]',
    position: 'bottom',
  },
  {
    id: 'platforms',
    title: 'Multi-Platform Publishing',
    description: 'Select which platforms to post to. Each post can be customized for different audiences.',
    target: '[data-tour="platforms"]',
    position: 'top',
  },
  {
    id: 'schedule',
    title: 'Schedule Posts',
    description: 'Post now or schedule for later. Our AI can even suggest the best times to post for maximum engagement!',
    target: '[data-tour="schedule"]',
    position: 'left',
  },
];


import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NewsletterPreview } from './NewsletterPreview';
import { TokenEstimator } from '@/components/ai/TokenEstimator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsletterFormData, NewsletterType, NewsletterTone, NewsletterLength, AIModel } from '../types/newsletter';
import { newsletterSchema } from '../utils/validation';
import { Lightbulb, Sparkles, Megaphone, Newspaper, BookOpen, Award, GraduationCap, Briefcase, Globe, DollarSign, PenTool, MessageSquare, FileText, Zap, InfoIcon, Clock, Palette, Users, Heart, Flame } from 'lucide-react';
import { AI_MODELS, getPricingString } from '@/utils/ai/modelInfo';
import { ModelPreferences } from '@/components/ai/ModelPreferences';
import { AnimatePresence, motion } from 'framer-motion';

interface NewsletterFormProps {
  onSubmit: (data: NewsletterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const NEWSLETTER_TYPES: { value: NewsletterType; label: string; icon: React.ReactNode }[] = [
  { value: 'tech-trends', label: 'Technology Trends', icon: <Lightbulb className="h-4 w-4" /> },
  { value: 'industry-insights', label: 'Industry Insights', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'product-updates', label: 'Product Updates', icon: <Megaphone className="h-4 w-4" /> },
  { value: 'company-news', label: 'Company News', icon: <Newspaper className="h-4 w-4" /> },
  { value: 'educational', label: 'Educational Content', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'case-studies', label: 'Case Studies', icon: <Award className="h-4 w-4" /> },
  { value: 'tutorials', label: 'Tutorials & How-tos', icon: <GraduationCap className="h-4 w-4" /> },
  { value: 'market-analysis', label: 'Market Analysis', icon: <Briefcase className="h-4 w-4" /> },
  { value: 'global-trends', label: 'Global Trends', icon: <Globe className="h-4 w-4" /> },
  { value: 'financial-updates', label: 'Financial Updates', icon: <DollarSign className="h-4 w-4" /> },
];

const TONES: { value: NewsletterTone; label: string; icon: React.ReactNode }[] = [
  { value: 'professional', label: 'Professional', icon: <PenTool className="h-4 w-4" /> },
  { value: 'casual', label: 'Casual & Friendly', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'inspirational', label: 'Inspirational & Motivational', icon: <Zap className="h-4 w-4" /> },
  { value: 'technical', label: 'Technical & Analytical', icon: <FileText className="h-4 w-4" /> },
  { value: 'engaging', label: 'Engaging & Conversational', icon: <Users className="h-4 w-4" /> },
  { value: 'authoritative', label: 'Authoritative & Thought Leadership', icon: <Award className="h-4 w-4" /> },
  { value: 'storytelling', label: 'Storytelling & Narrative-Driven', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'humorous', label: 'Humorous & Witty', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'persuasive', label: 'Persuasive & Sales-Oriented', icon: <Megaphone className="h-4 w-4" /> },
  { value: 'insightful', label: 'Insightful & Data-Driven', icon: <Lightbulb className="h-4 w-4" /> },
  { value: 'visionary', label: 'Visionary & Future-Focused', icon: <Globe className="h-4 w-4" /> },
  { value: 'educational', label: 'Educational & Informative', icon: <GraduationCap className="h-4 w-4" /> },
  { value: 'empathetic', label: 'Empathetic & Supportive', icon: <Heart className="h-4 w-4" /> },
  { value: 'controversial', label: 'Controversial & Debate-Stirring', icon: <Flame className="h-4 w-4" /> },
];

const LENGTHS: { value: NewsletterLength; label: string; icon: React.ReactNode }[] = [
  { value: 'short', label: 'Short (800-1200 words)', icon: <Clock className="h-4 w-4" /> },
  { value: 'medium', label: 'Medium (1200-2000 words)', icon: <Clock className="h-4 w-4" /> },
  { value: 'long', label: 'Long (2000-3000 words)', icon: <Clock className="h-4 w-4" /> },
];

const TARGET_AUDIENCES = [
  { value: 'tech-entrepreneurs', label: 'Tech Entrepreneurs' },
  { value: 'business-executives', label: 'Business Executives & Founders' },
  { value: 'product-managers', label: 'Product & Project Managers' },
  { value: 'marketing-teams', label: 'Marketing & Growth Teams' },
  { value: 'developers', label: 'Software Developers & Engineers' },
  { value: 'designers', label: 'UX/UI & Product Designers' },
  { value: 'ai-researchers', label: 'AI & ML Researchers' },
  { value: 'investors', label: 'Investors & Venture Capitalists' },
  { value: 'startup-enthusiasts', label: 'Startup Founders & Enthusiasts' },
  { value: 'innovation-leaders', label: 'Innovation & Digital Transformation Leaders' },
  { value: 'custom', label: 'Custom (Specify)' },
];

const DEFAULT_AUDIENCE = 'tech-entrepreneurs';

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  // --- State & Hooks ---
  const [activeStep, setActiveStep] = useState(0); // 0: Basics, 1: Style, 2: Content
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [customAudience, setCustomAudience] = useState(false);
  const [formError, setFormErrorState] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    watch,
    setValue,
    trigger
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onBlur',
    defaultValues: {
      type: 'tech-trends',
      tone: 'professional',
      length: 'medium',
      writingStyle: 'Informative',
      targetAudience: TARGET_AUDIENCES.find(a => a.value === DEFAULT_AUDIENCE)?.label || '',
      keyPoints: [],
      model: 'gpt-4.1-nano',
    }
  });
  const currentModel = watch('model');

  // --- Step Navigation ---
  const steps = [
    { label: 'Basics', icon: <Lightbulb className="h-5 w-5" /> },
    { label: 'Style', icon: <Palette className="h-5 w-5" /> },
    { label: 'Content', icon: <FileText className="h-5 w-5" /> },
  ];
  const goToStep = (idx: number) => setActiveStep(idx);
  const nextStep = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

  // --- Key Points Logic ---
  const addKeyPoint = () => setKeyPoints([...keyPoints, '']);
  const removeKeyPoint = (index: number) => {
    const updated = keyPoints.filter((_, i) => i !== index);
    setKeyPoints(updated);
    setValue('keyPoints', updated.filter(point => point.trim() !== ''));
  };
  const updateKeyPoint = (index: number, value: string) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
    setValue('keyPoints', updated.filter(point => point.trim() !== ''));
  };

  // --- Submission Logic ---
  const onFormSubmit = (data: NewsletterFormData) => {
    const requiredFields = ['topic', 'type', 'tone', 'length'] as const;
    const missingFields = requiredFields.filter(field => !data[field as keyof NewsletterFormData]);
    if (missingFields.length > 0) {
      setFormErrorState(`Please fill in all required fields: ${missingFields.join(', ')}`);
      missingFields.forEach(field => {
        setFormError(field, { type: 'required', message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
      });
      return;
    }
    setFormErrorState(null);
    data.keyPoints = keyPoints.filter(point => point.trim() !== '');
    onSubmit(data);
  };

  // --- Model Selection ---
  const handleModelChange = (model: AIModel) => setValue('model', model);

  // --- Responsive Layout ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-screen-xl mx-auto px-2 md:px-6 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Form Steps */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="bg-gradient-to-br from-white/80 to-muted/60 backdrop-blur-md shadow-2xl border-0">
            {/* Stepper */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              {steps.map((step, idx) => (
                <div key={step.label} className="flex-1 flex flex-col items-center group">
                  <button
                    type="button"
                    className={`rounded-full border-2 w-10 h-10 flex items-center justify-center mb-1 transition-all duration-200
                      ${activeStep === idx ? 'border-primary bg-primary text-white scale-110 shadow-lg' : 'border-border bg-background text-foreground/60'}
                      ${idx < activeStep ? 'bg-accent border-primary' : ''}`}
                    aria-current={activeStep === idx}
                    onClick={() => goToStep(idx)}
                  >
                    {step.icon}
                  </button>
                  <span className={`text-xs font-semibold ${activeStep === idx ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary`}>{step.label}</span>
                  {idx < steps.length - 1 && (
                    <div className="w-full h-1 bg-gradient-to-r from-primary/40 to-accent/40 my-2" />
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} className="px-8 pb-8 flex flex-col gap-8">
              {/* Error Banner */}
              {(formError || error) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg text-sm">
                  {formError || error}
                </motion.div>
              )}
              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8"
                >
                  {/* Step 0: Basics */}
                  {activeStep === 0 && (
                    <div className="flex flex-col gap-8">
                      <div>
                        <Label htmlFor="topic" className="text-base font-bold mb-1">Newsletter Topic</Label>
                        <Input {...register('topic')} placeholder="Enter your newsletter topic" className="w-full text-lg" />
                        {errors.topic && <p className="text-destructive text-sm mt-1">{errors.topic.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-base font-bold mb-2">Newsletter Type</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                          {NEWSLETTER_TYPES.map((type, idx) => (
                            <button
                              key={type.value}
                              type="button"
                              tabIndex={0}
                              aria-pressed={watch('type') === type.value}
                              className={`rounded-xl border-2 px-4 py-2 flex flex-col items-center gap-1 font-semibold shadow-sm transition-all
                                ${watch('type') === type.value ? 'border-primary bg-primary/10 text-primary scale-105 shadow-lg' : 'border-border bg-background text-foreground/80'}`}
                              onClick={() => setValue('type', type.value)}
                              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setValue('type', type.value); }}
                            >
                              <span className="mb-1 text-2xl">{type.icon}</span>
                              <span className="text-xs text-center leading-tight">{type.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.type && <p className="text-destructive text-sm mt-1">{errors.type.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="targetAudience" className="text-base font-bold mb-2">Target Audience</Label>
                        <div className="flex gap-2 items-center">
                          <Select value={watch('targetAudience')} onValueChange={val => {
                            setValue('targetAudience', val);
                            setCustomAudience(val === 'custom');
                          }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Audience" />
                            </SelectTrigger>
                            <SelectContent>
                              {TARGET_AUDIENCES.map(aud => (
                                <SelectItem key={aud.value} value={aud.value}>{aud.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {customAudience && (
                            <Input {...register('targetAudience')} placeholder="Custom audience..." className="w-48" />
                          )}
                        </div>
                        {errors.targetAudience && <p className="text-destructive text-sm mt-1">{errors.targetAudience.message}</p>}
                      </div>
                    </div>
                  )}
                  {/* Step 1: Style */}
                  {activeStep === 1 && (
                    <div className="flex flex-col gap-8">
                      <div>
                        <Label htmlFor="tone" className="text-base font-bold mb-2">Tone</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {TONES.map((tone, idx) => (
                            <button
                              key={tone.value}
                              type="button"
                              className={`rounded-lg border px-3 py-2 flex items-center gap-2 font-medium transition-all
                                ${watch('tone') === tone.value ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-border bg-background text-foreground/80'}`}
                              onClick={() => setValue('tone', tone.value)}
                            >
                              <span>{tone.icon}</span>
                              <span className="text-xs">{tone.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.tone && <p className="text-destructive text-sm mt-1">{errors.tone.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="length" className="text-base font-bold mb-2">Length</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {LENGTHS.map(length => (
                            <button
                              key={length.value}
                              type="button"
                              className={`rounded-lg border px-3 py-2 flex items-center gap-2 font-medium transition-all
                                ${watch('length') === length.value ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-border bg-background text-foreground/80'}`}
                              onClick={() => setValue('length', length.value)}
                            >
                              <span>{length.icon}</span>
                              <span className="text-xs">{length.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.length && <p className="text-destructive text-sm mt-1">{errors.length.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="model" className="text-base font-bold mb-2">AI Model</Label>
                        <ModelPreferences currentModel={currentModel} onModelChange={handleModelChange} />
                        <Select value={currentModel} onValueChange={val => setValue('model', val as AIModel)}>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select AI Model" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(AI_MODELS).map(([modelId, modelInfo]) => (
                              <SelectItem key={modelId} value={modelId}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{modelInfo.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{getPricingString(modelId as AIModel)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.model && <p className="text-destructive text-sm mt-1">{errors.model.message}</p>}
                      </div>
                    </div>
                  )}
                  {/* Step 2: Content */}
                  {activeStep === 2 && (
                    <div className="flex flex-col gap-8">
                      <div>
                        <Label className="text-base font-bold mb-2 flex items-center justify-between">
                          <span>Key Points</span>
                          <Button type="button" variant="outline" size="sm" onClick={addKeyPoint} className="h-8 px-2 text-xs">+ Add Point</Button>
                        </Label>
                        <div className="space-y-2 mt-1">
                          {keyPoints.map((point, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input value={point} onChange={e => updateKeyPoint(idx, e.target.value)} placeholder={`Key point ${idx + 1}`} className="flex-1" />
                              {keyPoints.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeKeyPoint(idx)} className="h-10 w-10">×</Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="additionalGuidelines" className="text-base font-bold mb-2">Additional Guidelines (Optional)</Label>
                        <Textarea id="additionalGuidelines" {...register('additionalGuidelines')} placeholder="Any specific requirements or preferences?" className="h-24 mt-1" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Step Navigation Buttons */}
              <div className="flex w-full gap-2 mt-4">
                {activeStep > 0 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                )}
                {activeStep < steps.length - 1 && (
                  <Button type="button" onClick={nextStep} className="flex-1">Next</Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        </motion.div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Newsletter</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
        {/* RIGHT: Sticky Sidebar */}
        <div className="hidden lg:flex flex-col gap-6 sticky top-8 h-fit">
          <NewsletterPreview /* Pass appropriate props here for live preview */ />
          <TokenEstimator model={currentModel} inputText={watch('topic') + ' ' + keyPoints.join(' ')} estimatedOutputLength={0} />
          {/* You can add a loader/overlay here if needed */}
        </div>
      </div>
    </motion.div>
  );
};
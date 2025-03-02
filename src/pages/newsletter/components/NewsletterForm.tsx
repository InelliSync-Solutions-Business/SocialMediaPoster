import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const [activeTab, setActiveTab] = useState('basics');
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [customAudience, setCustomAudience] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      model: 'gpt-4o-mini',
    }
  });

  // Local error state for form-level errors
  const [formError, setFormErrorState] = useState<string | null>(null);

  // Log any validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error('Form Validation Errors:', errors);
    }
  }, [errors]);

  // Initialize customAudience state based on whether the current value matches any predefined options
  useEffect(() => {
    const currentAudience = watch('targetAudience');
    if (!currentAudience) {
      setValue('targetAudience', TARGET_AUDIENCES.find(a => a.value === DEFAULT_AUDIENCE)?.label || '');
      setCustomAudience(false);
    } else {
      const isPredefined = TARGET_AUDIENCES.some(a => a.label === currentAudience || a.value === currentAudience);
      setCustomAudience(!isPredefined);
    }
  }, []);

  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const removeKeyPoint = (index: number) => {
    const updatedPoints = keyPoints.filter((_, i) => i !== index);
    setKeyPoints(updatedPoints);
    setValue('keyPoints', updatedPoints.filter(point => point.trim() !== ''));
  };

  const updateKeyPoint = (index: number, value: string) => {
    const updatedPoints = [...keyPoints];
    updatedPoints[index] = value;
    setKeyPoints(updatedPoints);
    setValue('keyPoints', updatedPoints.filter(point => point.trim() !== ''));
  };

  const onFormSubmit = (data: NewsletterFormData) => {
    console.log('Form Submit Data:', data);
    
    // Use a type-safe approach for required fields
    const requiredFields = ['topic', 'type', 'tone', 'length'] as const;
    const missingFields = requiredFields.filter(field => {
      // Type-safe way to check if the field exists and is empty/undefined
      return !data[field as keyof NewsletterFormData];
    });
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      
      // Set form-level error
      setFormErrorState(`Please fill in all required fields: ${missingFields.join(', ')}`);
      
      // Optionally, set individual field errors
      missingFields.forEach(field => {
        setFormError(field, { 
          type: 'required', 
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` 
        });
      });
      
      return;
    }

    // Clear any previous form-level errors
    setFormErrorState(null);

    // Include key points in the form data
    data.keyPoints = keyPoints.filter(point => point.trim() !== '');
    
    console.log('Submitting form with data:', data);
    onSubmit(data);
  };

  const currentModel = watch('model');

  // Handler for model preference changes
  const handleModelChange = (model: AIModel) => {
    setValue('model', model);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="z-40 shadow-lg border-0 bg-gradient-to-br from-card to-muted/50">
        <form 
          onSubmit={handleSubmit(onFormSubmit)} 
          className="flex flex-col h-full"
        >
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            {(formError || error) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-lg mb-4 text-sm"
              >
                {formError || error}
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>
              </motion.div>
              
              <div className="flex-1 overflow-auto" style={{ minHeight: "450px", maxHeight: "60vh" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent 
                      value={activeTab}
                      className="space-y-4 h-auto pb-8"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {activeTab === 'basics' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="topic">Newsletter Topic</Label>
                                <Input
                                  {...register('topic')}
                                  placeholder="Enter your newsletter topic"
                                  className="w-full"
                                />
                                {errors.topic && (
                                  <p className="text-destructive text-sm">{errors.topic.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="type">Newsletter Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  {NEWSLETTER_TYPES.map((type, index) => (
                                    <motion.div
                                      key={type.value}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <div
                                        key={type.value}
                                        className={`p-3 rounded-md border cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 ${
                                          watch('type') === type.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border'
                                        }`}
                                        onClick={() => setValue('type', type.value)}
                                      >
                                        <div className="flex-shrink-0">{type.icon}</div>
                                        <div className="text-sm truncate">{type.label}</div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                {errors.type && (
                                  <p className="text-destructive text-sm mt-1">{errors.type.message}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {activeTab === 'style' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="space-y-4 mt-6">
                              <div className="space-y-2">
                                <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  {TONES.map((tone, index) => (
                                    <motion.div
                                      key={tone.value}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <div
                                        key={tone.value}
                                        className={`p-3 rounded-md border cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 ${
                                          watch('tone') === tone.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border'
                                        }`}
                                        onClick={() => setValue('tone', tone.value)}
                                      >
                                        <div className="flex-shrink-0">{tone.icon}</div>
                                        <div className="text-sm truncate">{tone.label}</div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                {errors.tone && (
                                  <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="length" className="text-sm font-medium">Length</Label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                  {LENGTHS.map((length) => (
                                    <motion.div
                                      key={length.value}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.05 }}
                                    >
                                      <div
                                        key={length.value}
                                        className={`p-3 rounded-md border cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 ${
                                          watch('length') === length.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border'
                                        }`}
                                        onClick={() => setValue('length', length.value)}
                                      >
                                        <div className="flex-shrink-0">{length.icon}</div>
                                        <div className="text-sm truncate">{length.label}</div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                {errors.length && (
                                  <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Label htmlFor="model" className="text-sm font-medium flex items-center gap-1.5">
                                    AI Model
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help">
                                            <InfoIcon className="h-3.5 w-3.5 inline-block text-muted-foreground" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          <p className="max-w-60 text-xs">
                                            Select the AI model to use for generating your newsletter. More powerful models may produce better results but cost more.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Label>
                                  
                                  <ModelPreferences 
                                    currentModel={currentModel} 
                                    onModelChange={handleModelChange}
                                  />
                                </div>
                                
                                <div className="space-y-4">
                                  <Select
                                    value={currentModel}
                                    onValueChange={(value) => setValue('model', value as AIModel)}
                                  >
                                    <SelectTrigger className="w-full">
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
                                  {errors.model && (
                                    <p className="text-sm text-red-500">{errors.model.message}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {activeTab === 'content' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Label className="text-sm font-medium flex items-center justify-between">
                              <span>Key Points</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={addKeyPoint}
                                className="h-8 px-2 text-xs"
                              >
                                + Add Point
                              </Button>
                            </Label>
                            <div className="space-y-2 mt-1">
                              {keyPoints.map((point, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <div className="flex gap-2">
                                    <Input
                                      value={point}
                                      onChange={(e) => updateKeyPoint(index, e.target.value)}
                                      placeholder={`Key point ${index + 1}`}
                                      className="flex-1"
                                    />
                                    {keyPoints.length > 1 && (
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeKeyPoint(index)}
                                        className="h-10 w-10"
                                      >
                                        ×
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            <Label htmlFor="additionalGuidelines" className="text-sm font-medium">Additional Guidelines (Optional)</Label>
                            <Textarea
                              id="additionalGuidelines"
                              {...register('additionalGuidelines')}
                              placeholder="Any specific requirements or preferences?"
                              className="h-24 mt-1"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <div className="flex w-full space-x-2">
              {activeTab !== 'basics' && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ['content', 'style', 'basics'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="w-full"
                  >
                    Back
                  </Button>
                </motion.div>
              )}
              
              {activeTab !== 'content' && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ['basics', 'style', 'content'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="w-full"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
              
              {activeTab === 'content' && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1, 
                            ease: "linear" 
                          }}
                        >
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
                </motion.div>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

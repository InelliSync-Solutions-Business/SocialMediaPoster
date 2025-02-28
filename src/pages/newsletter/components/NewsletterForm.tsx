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
import { Lightbulb, Sparkles, Megaphone, Newspaper, BookOpen, Award, GraduationCap, Briefcase, Globe, DollarSign, PenTool, MessageSquare, FileText, Zap, InfoIcon, Clock, Palette, Users } from 'lucide-react';
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
  { value: 'casual', label: 'Casual', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'inspirational', label: 'Inspirational', icon: <Zap className="h-4 w-4" /> },
  { value: 'technical', label: 'Technical', icon: <FileText className="h-4 w-4" /> },
];

const LENGTHS: { value: NewsletterLength; label: string; icon: React.ReactNode }[] = [
  { value: 'short', label: 'Short (800-1200 words)', icon: <Clock className="h-4 w-4" /> },
  { value: 'medium', label: 'Medium (1200-2000 words)', icon: <Clock className="h-4 w-4" /> },
  { value: 'long', label: 'Long (2000-3000 words)', icon: <Clock className="h-4 w-4" /> },
];

const TARGET_AUDIENCES = [
  { value: 'business-executives', label: 'Business Executives' },
  { value: 'custom', label: 'Custom (Specify)' },
  { value: 'customers', label: 'Customers' },
  { value: 'designers', label: 'Designers' },
  { value: 'developers', label: 'Developers' },
  { value: 'general-audience', label: 'General Audience' },
  { value: 'investors', label: 'Investors' },
  { value: 'marketing-teams', label: 'Marketing Teams' },
  { value: 'partners', label: 'Partners' },
  { value: 'product-managers', label: 'Product Managers' },
  { value: 'tech-professionals', label: 'Tech Professionals' },
];

const DEFAULT_AUDIENCE = 'tech-professionals';

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
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      type: 'tech-trends',
      tone: 'professional',
      length: 'medium',
      writingStyle: 'Informative',
      targetAudience: DEFAULT_AUDIENCE,
      keyPoints: [],
      model: 'gpt-4o-mini',
    },
  });

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
    // Include key points in the form data
    data.keyPoints = keyPoints.filter(point => point.trim() !== '');
    onSubmit(data);
  };

  const currentModel = watch('model');

  // Handler for model preference changes
  const handleModelChange = (model: AIModel) => {
    setValue('model', model);
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold">Create Your Newsletter</CardTitle>
        <CardDescription>
          Configure your newsletter settings to generate tailored content
        </CardDescription>
      </CardHeader>

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto" style={{ minHeight: "450px", maxHeight: "60vh" }}>
              <TabsContent value="basics" className="space-y-4 h-auto pb-8">
                <div>
                  <Label className="text-sm font-medium">Newsletter Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {NEWSLETTER_TYPES.map((type) => (
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
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="topic" className="text-sm font-medium">Topic</Label>
                  <Input
                    id="topic"
                    {...register('topic')}
                    placeholder="Enter the main topic of your newsletter"
                    className="mt-1"
                  />
                  {errors.topic && (
                    <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="targetAudience" className="text-sm font-medium">Target Audience</Label>
                  <div className="mt-1">
                    <Select
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setCustomAudience(true);
                          // Clear the field for custom input
                          setValue('targetAudience', '');
                        } else {
                          setCustomAudience(false);
                          // For predefined audiences, use the label as the value
                          const selectedAudience = TARGET_AUDIENCES.find(a => a.value === value);
                          setValue('targetAudience', selectedAudience?.label || value);
                        }
                      }}
                      value={customAudience ? 'custom' : (
                        TARGET_AUDIENCES.find(a => a.label === watch('targetAudience'))?.value || 
                        TARGET_AUDIENCES.find(a => a.value === watch('targetAudience'))?.value || 
                        DEFAULT_AUDIENCE
                      )}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_AUDIENCES.map((audience) => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {customAudience && (
                      <div className="flex items-center mt-2 relative">
                        <Users className="h-4 w-4 absolute left-3 text-muted-foreground" />
                        <Input
                          id="customTargetAudience"
                          value={watch('targetAudience')}
                          onChange={(e) => setValue('targetAudience', e.target.value)}
                          placeholder="Specify your target audience"
                          className="pl-10"
                        />
                      </div>
                    )}
                  </div>
                  {errors.targetAudience && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 h-auto pb-8">
                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {TONES.map((tone) => (
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
              </TabsContent>

              <TabsContent value="content" className="space-y-4 h-auto pb-8">
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
                    <div key={index} className="flex gap-2">
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
                  ))}
                </div>

                <Label htmlFor="additionalGuidelines" className="text-sm font-medium">Additional Guidelines (Optional)</Label>
                <Textarea
                  id="additionalGuidelines"
                  {...register('additionalGuidelines')}
                  placeholder="Any specific requirements or preferences?"
                  className="h-24 mt-1"
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-4 bg-background">
          <div className="flex justify-between w-full">
            {activeTab !== 'basics' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === 'style') setActiveTab('basics');
                  if (activeTab === 'content') setActiveTab('style');
                }}
              >
                Back
              </Button>
            )}
            {activeTab === 'basics' && <div />}
            
            {activeTab !== 'content' ? (
              <Button
                type="button"
                onClick={() => {
                  if (activeTab === 'basics') setActiveTab('style');
                  if (activeTab === 'style') setActiveTab('content');
                }}
                className={activeTab === 'basics' ? 'ml-auto' : ''}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit(onFormSubmit)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
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
        </CardFooter>
      </form>
    </Card>
  );
};

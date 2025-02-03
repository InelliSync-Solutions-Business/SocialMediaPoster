import React from 'react';
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
import { NewsletterFormData, NewsletterType, NewsletterTone, NewsletterLength } from '../types/newsletter';
import { newsletterSchema } from '../utils/validation';

interface NewsletterFormProps {
  onSubmit: (data: NewsletterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const NEWSLETTER_TYPES: { value: NewsletterType; label: string }[] = [
  { value: 'tech-trends', label: 'Technology Trends' },
  { value: 'industry-insights', label: 'Industry Insights' },
  { value: 'product-updates', label: 'Product Updates' },
  { value: 'company-news', label: 'Company News' },
];

const TONES: { value: NewsletterTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'technical', label: 'Technical' },
];

const LENGTHS: { value: NewsletterLength; label: string }[] = [
  { value: 'short', label: 'Short (800-1200 words)' },
  { value: 'medium', label: 'Medium (1200-2000 words)' },
  { value: 'long', label: 'Long (2000-3000 words)' },
];

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      type: 'tech-trends',
      tone: 'professional',
      length: 'medium',
      writingStyle: 'Informative',
      targetAudience: 'Tech Professionals',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label>Newsletter Type</Label>
          <Select
            onValueChange={(value: NewsletterType) => setValue('type', value)}
            defaultValue={watch('type')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select newsletter type" />
            </SelectTrigger>
            <SelectContent>
              {NEWSLETTER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            {...register('topic')}
            placeholder="Enter the main topic of your newsletter"
          />
          {errors.topic && (
            <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>
          )}
        </div>

        <div>
          <Label>Tone</Label>
          <Select
            onValueChange={(value: NewsletterTone) => setValue('tone', value)}
            defaultValue={watch('tone')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tone && (
            <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
          )}
        </div>

        <div>
          <Label>Length</Label>
          <Select
            onValueChange={(value: NewsletterLength) => setValue('length', value)}
            defaultValue={watch('length')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              {LENGTHS.map((length) => (
                <SelectItem key={length.value} value={length.value}>
                  {length.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.length && (
            <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            {...register('targetAudience')}
            placeholder="Who is this newsletter for?"
          />
          {errors.targetAudience && (
            <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="writingStyle">Writing Style</Label>
          <Input
            id="writingStyle"
            {...register('writingStyle')}
            placeholder="e.g., Informative, Analytical, Conversational"
          />
          {errors.writingStyle && (
            <p className="text-red-500 text-sm mt-1">{errors.writingStyle.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="additionalGuidelines">Additional Guidelines (Optional)</Label>
          <Textarea
            id="additionalGuidelines"
            {...register('additionalGuidelines')}
            placeholder="Any specific requirements or preferences?"
            className="h-24"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Newsletter'}
      </Button>
    </form>
  );
};

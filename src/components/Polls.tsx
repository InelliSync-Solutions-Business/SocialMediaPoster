import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';
import AILoader from './AILoader';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface PollOption {
  id: string;
  text: string;
}

const Polls: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [pollType, setPollType] = useState<'multiple' | 'yes-no'>('multiple');
  const [optionCount, setOptionCount] = useState<string>('3');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPoll, setGeneratedPoll] = useState<{
    question: string;
    options: string[];
  } | null>(null);

  const audienceOptions = [
    'Tech Professionals',
    'Entrepreneurs',
    'Students',
    'Marketing Experts',
    'General Public',
    'Startup Founders',
    'Freelancers'
  ];

  const styleOptions = [
    'Professional',
    'Casual',
    'Engaging',
    'Thought-Provoking',
    'Humorous',
    'Serious',
    'Inspirational'
  ];

  const optionCountOptions = [
    { value: '2', label: '2 Options' },
    { value: '3', label: '3 Options' },
    { value: '4', label: '4 Options' }
  ];

  const generatePoll = async () => {
    if (!topic.trim()) {
      alert('Please provide a topic for the poll');
      return;
    }

    setIsLoading(true);
    setGeneratedPoll(null);

    try {
      const response = await fetch('/api/generate-poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          audience,
          style,
          guidelines,
          pollType,
          optionCount: pollType === 'multiple' ? parseInt(optionCount) : 2
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate poll');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate poll');
      }

      // Use the pre-parsed data from the server
      setGeneratedPoll({ 
        question: data.question, 
        options: data.options 
      });
    } catch (error) {
      console.error('Error generating poll:', error);
      alert('Failed to generate poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPollToClipboard = () => {
    if (!generatedPoll) return;

    const pollText = `📊 ${generatedPoll.question}\n\n${generatedPoll.options
      .map((opt, index) => `${String.fromCharCode(65 + index)}. ${opt}`)
      .join('\n')}`;

    navigator.clipboard.writeText(pollText);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 space-y-4"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Poll Topic
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
            placeholder="What's the main topic or idea for your poll?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />
        </div>

        <div className="poll-type-selection">
          <label>
            <input 
              type="radio" 
              value="multiple" 
              checked={pollType === 'multiple'}
              onChange={() => setPollType('multiple')}
            />
            Multiple Choice
          </label>
          <label>
            <input 
              type="radio" 
              value="yes-no" 
              checked={pollType === 'yes-no'}
              onChange={() => setPollType('yes-no')}
            />
            Yes/No
          </label>
        </div>

        {pollType === 'multiple' && (
          <div className="option-count-selection">
            <label>Number of Options:</label>
            <select 
              value={optionCount} 
              onChange={(e) => setOptionCount(e.target.value)}
            >
              {optionCountOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Target Audience
          </label>
          <Select 
            value={audience} 
            onValueChange={(value) => setAudience(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              {audienceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Poll Style
          </label>
          <Select 
            value={style} 
            onValueChange={(value) => setStyle(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select poll style" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Additional Guidelines
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
            placeholder="Any specific requirements for the poll? (e.g., tone, specific constraints)"
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            rows={3}
          />
        </div>

        <button
          onClick={generatePoll}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="mr-2">Generating...</span>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            </div>
          ) : (
            'Generate Poll'
          )}
        </button>

        {/* Render the AILoader component separately */}
        {isLoading && <AILoader isLoading={true} loadingOnly={true} />}

        {generatedPoll && (
          <div className="mt-8 p-4 bg-white dark:bg-secondary/20 rounded-lg border border-border/50 shadow-lifted dark:shadow-dark-lifted">
            <h3 className="text-lg font-semibold mb-4">{generatedPoll.question}</h3>
            <div className="space-y-2">
              {generatedPoll.options.map((option, index) => (
                <div
                  key={index}
                  className="p-3 bg-background dark:bg-secondary/40 rounded-md border border-border/50"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </div>
              ))}
            </div>
            <button
              onClick={copyPollToClipboard}
              className="mt-4 w-full py-2 px-4 bg-secondary/20 text-foreground rounded-md hover:bg-secondary/30"
            >
              Copy Poll
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Polls;

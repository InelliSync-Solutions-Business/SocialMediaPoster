import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';
import AILoader from './AILoader';

interface PollOption {
  id: string;
  text: string;
}

const Polls: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPoll, setGeneratedPoll] = useState<{
    question: string;
    options: string[];
  } | null>(null);

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
          guidelines
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

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Target Audience
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
            placeholder="Who is your target audience? Be specific about their interests, demographics, and pain points."
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Poll Style
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
            placeholder="How should the poll be written? (e.g., professional, casual, engaging)"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80 dark:text-foreground/70">
            Additional Guidelines
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-white dark:bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none shadow-lifted dark:shadow-dark-lifted placeholder-foreground/50"
            placeholder="Any specific requirements for the poll? (e.g., tone, number of options)"
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
          {isLoading ? <AILoader isLoading={true} /> : 'Generate Poll'}
        </button>

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

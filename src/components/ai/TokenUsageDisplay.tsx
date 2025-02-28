import React from 'react';
import { TokenUsage } from '@/pages/newsletter/types/newsletter';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TokenUsageDisplayProps {
  usage: TokenUsage;
}

export const TokenUsageDisplay: React.FC<TokenUsageDisplayProps> = ({ usage }) => {
  if (!usage) return null;

  return (
    <Card className="bg-muted/40 border-muted">
      <CardContent className="pt-4 px-4 pb-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Token Usage</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info className="h-3.5 w-3.5 inline-block text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Actual token usage from the API request
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>Input</span>
                <span className="font-mono">{usage.inputTokens.toLocaleString()} tokens</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Output</span>
                <span className="font-mono">{usage.outputTokens.toLocaleString()} tokens</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-muted-foreground">Actual Cost</span>
            <span className="font-mono text-sm font-medium">
              ${usage.estimatedCost.toFixed(6)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

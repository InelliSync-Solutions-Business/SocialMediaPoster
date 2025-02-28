import React, { useEffect, useState } from 'react';
import { AIModel } from '@/pages/newsletter/types/newsletter';
import { calculateCost, estimateTokenCount, getPricingString, AI_MODELS } from '@/utils/ai/modelInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TokenEstimatorProps {
  model: AIModel;
  inputText: string;
  estimatedOutputLength?: number; // Optional estimated output length
}

export const TokenEstimator: React.FC<TokenEstimatorProps> = ({
  model,
  inputText,
  estimatedOutputLength = 0, // Default to 0 if not provided
}) => {
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [contextUtilization, setContextUtilization] = useState(0);
  
  useEffect(() => {
    // Calculate input tokens
    const inputCount = estimateTokenCount(inputText);
    setInputTokens(inputCount);
    
    // Calculate output tokens based on newsletter length setting
    // This is a more accurate estimate based on the selected length
    const outputCount = estimatedOutputLength > 0 
      ? Math.ceil(estimatedOutputLength / 4) // Convert characters to tokens
      : Math.max(500, Math.ceil(inputCount * 2)); // Fallback heuristic
    setOutputTokens(outputCount);
    
    // Calculate cost
    const cost = calculateCost(model, inputCount, outputCount);
    setEstimatedCost(cost);
    
    // Calculate context utilization
    const modelInfo = AI_MODELS[model];
    if (modelInfo) {
      const totalTokens = inputCount + outputCount;
      const utilization = (totalTokens / modelInfo.contextLength) * 100;
      setContextUtilization(Math.min(100, utilization)); // Cap at 100%
    }
  }, [model, inputText, estimatedOutputLength]);

  const modelInfo = AI_MODELS[model];
  
  // Calculate progress bar values for better visualization
  const inputPercentage = modelInfo ? Math.min(100, (inputTokens / (modelInfo.contextLength * 0.3)) * 100) : 0;
  const outputPercentage = modelInfo ? Math.min(100, (outputTokens / (modelInfo.contextLength * 0.7)) * 100) : 0;
  
  // Determine color indicators based on utilization
  const getUtilizationColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-amber-500";
    if (percentage > 50) return "bg-yellow-500";
    return "";
  };
  
  return (
    <Card className="bg-muted/40 border-muted shadow-none">
      <CardContent className="pt-3 px-3 pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">Token Estimation</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info className="h-3 w-3 inline-block text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-60 text-xs">
                      Estimated tokens used for input text and expected output. Actual usage may vary.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-muted-foreground">{getPricingString(model)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>Input</span>
                <span className="font-mono">{inputTokens.toLocaleString()} tokens</span>
              </div>
              <Progress 
                value={inputPercentage} 
                max={100} 
                className="h-1.5" 
                indicatorClassName={getUtilizationColor(inputPercentage)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Output (est.)</span>
                <span className="font-mono">{outputTokens.toLocaleString()} tokens</span>
              </div>
              <Progress 
                value={outputPercentage} 
                max={100} 
                className="h-1.5" 
                indicatorClassName={getUtilizationColor(outputPercentage)}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Context Utilization</span>
              <span className="font-mono">{contextUtilization.toFixed(1)}% of {modelInfo?.contextLength.toLocaleString()}</span>
            </div>
            <Progress 
              value={contextUtilization} 
              max={100}
              className="h-1.5" 
              indicatorClassName={getUtilizationColor(contextUtilization)}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs">Estimated Cost</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-medium">
                ${estimatedCost.toFixed(6)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info className="h-3 w-3 inline-block text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-60">
                    <p className="text-xs">
                      Based on {inputTokens.toLocaleString()} input tokens at ${(modelInfo?.pricing.input || 0).toFixed(2)}/1M and {outputTokens.toLocaleString()} output tokens at ${(modelInfo?.pricing.output || 0).toFixed(2)}/1M
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Newsletter, GeneratedNewsletter } from '../types/newsletter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Send, 
  RefreshCw, 
  Trash2,
  MailIcon,
  Share2,
  Info,
  Edit,
  Check,
  X,
  Download,
  Printer,
  Eye,
  Code,
  BarChart2
} from 'lucide-react';
import { Tooltip } from '@mui/material';
import { countTokens } from '@/utils/tokenUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenUsageDisplay } from '@/components/ai/TokenUsageDisplay';

interface NewsletterPreviewProps {
  newsletter?: Newsletter;
  generatedContent?: GeneratedNewsletter;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
  onUpdateContent?: (content: string) => void;
  streamingState?: {
    content: string;
    isDone: boolean;
  };
}

export const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({
  newsletter,
  generatedContent,
  isLoading,
  onRegenerate,
  onClear,
  onUpdateContent,
  streamingState
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'email' | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when streaming content
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (streamingState && !streamingState.isDone && previewContainerRef.current) {
      previewContainerRef.current.scrollTop = previewContainerRef.current.scrollHeight;
    }
  }, [streamingState]);

  const handleCopy = () => {
    const contentToCopy = streamingState?.content || generatedContent?.content;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const contentToShare = streamingState?.content || generatedContent?.content;
    if (contentToShare) {
      setSelectedPlatform('email');
      const mailtoLink = `mailto:?subject=Newsletter Content&body=${encodeURIComponent(contentToShare)}`;
      window.open(mailtoLink, '_blank');
      setTimeout(() => setSelectedPlatform(null), 2000);
    }
  };

  const handleContentEdit = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    if (onUpdateContent) {
      onUpdateContent(newContent);
    }
  };

  const toggleEditing = () => {
    if (isEditing && onUpdateContent && contentEditableRef.current) {
      // Save the content when exiting edit mode
      onUpdateContent(contentEditableRef.current.textContent || '');
    }
    
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Focus the contentEditable div when entering edit mode
      setTimeout(() => contentEditableRef.current?.focus(), 0);
    }
  };

  const handlePrint = () => {
    const contentToPrint = streamingState?.content || generatedContent?.content;
    if (contentToPrint) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Newsletter Print</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                h1, h2, h3 { color: #333; }
                .container { max-width: 800px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="container">
                ${contentToPrint.replace(/\n/g, '<br>')}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    const contentToDownload = streamingState?.content || generatedContent?.content;
    if (contentToDownload) {
      const blob = new Blob([contentToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Utility component to wrap disabled buttons
  const TooltipWrapper: React.FC<{ 
    children: React.ReactElement; 
    title: string; 
    disabled?: boolean; 
  }> = ({ children, title, disabled }) => {
    return disabled ? (
      <Tooltip title={title}>
        <span style={{ cursor: 'not-allowed', display: 'inline-block' }}>
          {React.cloneElement(children, { 
            style: { 
              ...children.props.style, 
              pointerEvents: 'none', 
              opacity: 0.5 
            } 
          })}
        </span>
      </Tooltip>
    ) : (
      <Tooltip title={title}>
        {children}
      </Tooltip>
    );
  };

  if (!newsletter && !generatedContent && !isLoading) {
    return (
      <Card className="w-full z-50">
        <CardHeader>
          <CardTitle>Newsletter Preview</CardTitle>
          <CardDescription>A live preview of your generated newsletter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
            <MailIcon className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Fill out the form to generate your newsletter content
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full z-50">
        <CardHeader>
          <CardTitle>Newsletter Preview</CardTitle>
          <CardDescription>A live preview of your generated newsletter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!generatedContent) {
    return (
      <Card className="w-full z-50">
        <CardHeader>
          <CardTitle>Newsletter Preview</CardTitle>
          <CardDescription>A live preview of your generated newsletter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
            <MailIcon className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Generated newsletter content will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const characterCount = (streamingState?.content || generatedContent.content).length;
  const tokenCount = countTokens(streamingState?.content || generatedContent.content);
  const content = streamingState?.content || generatedContent?.content;

  return (
    <Card className="w-full z-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Newsletter Preview</CardTitle>
            <CardDescription>A live preview of your generated newsletter</CardDescription>
          </div>
          {generatedContent?.metadata?.tone && (
            <Badge variant="secondary" className="capitalize">
              {generatedContent.metadata.tone} Tone
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'preview' | 'raw')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw Content</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div className="relative z-50">
              <AnimatePresence>
                {activeTab === 'preview' ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : (
                      <div
                        ref={contentEditableRef}
                        contentEditable={isEditing}
                        onInput={handleContentEdit}
                        className={`prose dark:prose-invert max-w-none ${
                          isEditing ? 'border-2 border-primary p-2 rounded-md' : ''
                        }`}
                      >
                        <ReactMarkdown>
                          {streamingState?.content || generatedContent?.content || ''}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-muted p-4 rounded-md overflow-x-auto text-sm"
                  >
                    {streamingState?.content || generatedContent?.content || ''}
                  </motion.pre>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          <TabsContent value="raw">
            <div className="mt-4 p-4 bg-muted rounded-md">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {streamingState?.content || generatedContent?.content || ''}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t bg-muted/10 p-2">
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={toggleEditing}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                onClick={toggleEditing}
                className="h-8 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleEditing}
              disabled={isLoading}
              className="h-8 px-2 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[-30px] right-[50px] bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>

          <TooltipWrapper title="Copy to Clipboard" disabled={isLoading}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCopy}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <Copy size={16} />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper title="Share via Email" disabled={isLoading}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleShare}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <Send size={16} />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper title="Download as Text" disabled={isLoading}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleDownload}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <Download size={16} />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper title="Print" disabled={isLoading}>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handlePrint}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <Printer size={16} />
            </Button>
          </TooltipWrapper>

          {onRegenerate && (
            <TooltipWrapper title="Regenerate" disabled={isLoading}>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onRegenerate}
                disabled={isLoading}
                className="h-8 w-8"
              >
                <RefreshCw size={16} />
              </Button>
            </TooltipWrapper>
          )}

          {onClear && (
            <TooltipWrapper title="Clear" disabled={isLoading}>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onClear}
                disabled={isLoading}
                className="h-8 w-8"
              >
                <Trash2 size={16} />
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </CardFooter>

      {/* Token Usage Display */}
      {generatedContent?.usage && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Usage Statistics</span>
          </div>
          <TokenUsageDisplay usage={generatedContent.usage} />
        </div>
      )}
    </Card>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Newsletter, GeneratedNewsletter } from '../types/newsletter';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50 h-full flex flex-col justify-center items-center p-12">
        <div className="text-center text-gray-500 space-y-4">
          <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
            <MailIcon className="h-12 w-12 text-muted-foreground/70" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No Preview Available</h3>
          <p className="max-w-md">Fill out the form to generate your newsletter content</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50 p-6 space-y-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <div className="h-4" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (!generatedContent) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50 h-full flex flex-col justify-center items-center p-12">
        <div className="text-center text-gray-500 space-y-4">
          <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
            <MailIcon className="h-12 w-12 text-muted-foreground/70" />
          </div>
          <h3 className="text-xl font-medium text-foreground">Waiting for Content</h3>
          <p className="max-w-md">Generated newsletter content will appear here</p>
        </div>
      </Card>
    );
  }

  const characterCount = (streamingState?.content || generatedContent.content).length;
  const tokenCount = countTokens(streamingState?.content || generatedContent.content);
  const content = streamingState?.content || generatedContent?.content;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50 relative flex flex-col h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <MailIcon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-xl">Newsletter Preview</CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-muted/30 text-xs">
            {characterCount} chars
          </Badge>
          <Badge variant="outline" className="bg-muted/30 text-xs">
            {tokenCount} tokens
          </Badge>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'raw')} className="w-[180px]">
            <TabsList className="h-8">
              <TabsTrigger value="preview" className="text-xs px-2 py-1 h-6">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="text-xs px-2 py-1 h-6">
                <Code className="h-3 w-3 mr-1" />
                Raw
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden relative p-0">
        <div 
          ref={previewContainerRef}
          className="h-full overflow-y-auto px-6 py-2"
          style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}
        >
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="preview" className="m-0 h-full">
              {isEditing ? (
                <div
                  ref={contentEditableRef}
                  contentEditable={true}
                  onInput={handleContentEdit}
                  suppressContentEditableWarning
                  className="prose max-w-none whitespace-pre-wrap text-sm border border-blue-500 rounded p-2 focus:outline-none min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="raw" className="m-0 h-full">
              <pre className="text-xs font-mono bg-muted/30 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                {content}
              </pre>
            </TabsContent>
          </Tabs>
        </div>

        {/* Streaming indicator */}
        {streamingState && !streamingState.isDone && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent flex justify-center">
            <Badge variant="outline" className="bg-primary/10 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                <span>Generating content...</span>
              </div>
            </Badge>
          </div>
        )}
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

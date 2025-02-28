import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Video, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample FAQ data
  const faqs = [
    {
      id: '1',
      question: 'How do I create my first social media post?',
      answer: 'To create your first post, navigate to the Content Generator page, select your target platform, choose a content type, and enter your topic or keywords. Our AI will generate content suggestions that you can edit and customize before publishing.'
    },
    {
      id: '2',
      question: 'Can I schedule posts for multiple platforms at once?',
      answer: 'Yes! You can create content for multiple platforms simultaneously. After generating your content, you can customize it for each platform and schedule them all at once using our bulk scheduling feature.'
    },
    {
      id: '3',
      question: 'How do I connect my social media accounts?',
      answer: "Go to the Settings page and select the \"Platforms\" tab. Click on the platform you want to connect and follow the authentication steps. Once connected, you'll be able to publish and schedule content directly from our app."
    },
    {
      id: '4',
      question: 'What types of content can I create?',
      answer: 'Our platform supports various content types including short-form posts, long-form articles, threads, polls, and more. Each platform has specific content formats optimized for maximum engagement.'
    },
    {
      id: '5',
      question: 'How do I customize my AI content preferences?',
      answer: "In the Settings page, navigate to the \"Content\" tab where you can set your default writing style, target audience, brand voice, and content guidelines. These preferences will be used by our AI to generate more personalized content."
    },
    {
      id: '6',
      question: 'Can I import my existing content?',
      answer: `Yes, you can import existing content from your connected social media accounts or upload content in CSV format. Go to the History page and click on the "Import" button to get started.`
    },
    {
      id: '7',
      question: 'How do I view analytics for my posts?',
      answer: 'Visit the Analytics page to view comprehensive metrics for your content across all platforms. You can filter by date range, platform, and content type to get detailed insights into your social media performance.'
    }
  ];
  
  // Sample tutorials data
  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with IntelliSync',
      description: 'Learn the basics of using our platform to generate and manage social media content.',
      type: 'video',
      duration: '5:32'
    },
    {
      id: '2',
      title: 'Advanced Content Generation Techniques',
      description: 'Master the art of creating highly engaging content using our AI tools and templates.',
      type: 'article',
      duration: '8 min read'
    },
    {
      id: '3',
      title: 'Platform-Specific Optimization Guide',
      description: 'Optimize your content for each social media platform to maximize engagement and reach.',
      type: 'video',
      duration: '12:45'
    },
    {
      id: '4',
      title: 'Analytics and Performance Tracking',
      description: 'Learn how to interpret analytics data and improve your content strategy.',
      type: 'article',
      duration: '10 min read'
    },
    {
      id: '5',
      title: 'Content Calendar Management',
      description: 'Efficiently plan and schedule your content across multiple platforms.',
      type: 'video',
      duration: '8:17'
    }
  ];
  
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help Center</h1>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for help topics..."
          className="pl-10 py-6 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse our comprehensive documentation to learn all features.
            </p>
            <Button variant="outline" className="w-full">
              View Documentation
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team for immediate assistance.
            </p>
            <Button variant="outline" className="w-full">
              Start Chat
              <MessageSquare className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button variant="outline" className="w-full">
              Contact Us
              <Mail className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="faq">
        <TabsList className="mb-4">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials & Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader>
                        <CardTitle>{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No FAQ matches found for "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tutorials">
          <Card>
            <CardHeader>
              <CardTitle>Tutorials & Guides</CardTitle>
              <CardDescription>
                Learn how to use our platform with step-by-step tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTutorials.length > 0 ? (
                <div className="space-y-4">
                  {filteredTutorials.map((tutorial) => (
                    <Card key={tutorial.id}>
                      <CardHeader>
                        <CardTitle>{tutorial.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{tutorial.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                            {tutorial.type === 'video' ? 'Video' : 'Article'}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {tutorial.duration}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No tutorials found for "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for personalized assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email address" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What's your question about?" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue in detail..." 
                    rows={6}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  MessageSquare, 
  FileText, 
  Copy, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { PlatformKey } from '@/types/platforms';

interface HistoryItem {
  id: string;
  content: string;
  platform: PlatformKey;
  contentType: string;
  createdAt: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string;
}

const History: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample history data
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      content: 'Exciting news! We just launched our new product line that helps businesses streamline their workflow...',
      platform: 'twitter',
      contentType: 'short-form',
      createdAt: '2023-02-15T14:30:00Z',
      status: 'published'
    },
    {
      id: '2',
      content: "We're thrilled to announce our latest partnership with InnovateTech. This collaboration will enable us to...",
      platform: 'linkedin',
      contentType: 'long-form',
      createdAt: '2023-02-14T10:15:00Z',
      status: 'published'
    },
    {
      id: '3',
      content: 'Check out our behind-the-scenes look at our team retreat! #TeamBuilding #CompanyCulture',
      platform: 'instagram',
      contentType: 'short-form',
      createdAt: '2023-02-12T16:45:00Z',
      status: 'published'
    },
    {
      id: '4',
      content: 'Join us for our upcoming webinar on digital marketing trends in 2023. Register now to secure your spot!',
      platform: 'facebook',
      contentType: 'short-form',
      createdAt: '2023-02-10T09:00:00Z',
      status: 'scheduled',
      scheduledFor: '2023-03-01T18:00:00Z'
    },
    {
      id: '5',
      content: "Thread: 1/5 In this thread, we'll be discussing the future of remote work and how companies can adapt...",
      platform: 'twitter',
      contentType: 'thread',
      createdAt: '2023-02-08T11:30:00Z',
      status: 'draft'
    },
    {
      id: '6',
      content: "What's your preferred way to stay productive while working remotely? Vote now!",
      platform: 'twitter',
      contentType: 'poll',
      createdAt: '2023-02-05T13:20:00Z',
      status: 'published'
    },
    {
      id: '7',
      content: 'Our CEO will be speaking at the upcoming Tech Conference 2023. Don\'t miss this opportunity to learn about...',
      platform: 'linkedin',
      contentType: 'long-form',
      createdAt: '2023-02-03T15:10:00Z',
      status: 'published'
    },
    {
      id: '8',
      content: "We're hiring! Check out our open positions and join our growing team of passionate professionals...",
      platform: 'facebook',
      contentType: 'short-form',
      createdAt: '2023-02-01T10:00:00Z',
      status: 'draft'
    }
  ];
  
  const getPlatformIcon = (platform: PlatformKey) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-[#0A66C2]" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-[#E1306C]" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-[#1877F2]" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'thread':
        return <MessageSquare className="h-4 w-4" />;
      case 'poll':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredItems = historyItems
    .filter(item => {
      if (filter === 'all') return true;
      return item.status === filter;
    })
    .filter(item => {
      if (!searchQuery) return true;
      return item.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content History</h1>
        <Button>
          Export History
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Content Items ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(item.platform)}
                          <span className="text-sm font-medium capitalize">{item.platform}</span>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1">
                            {getContentTypeIcon(item.contentType)}
                            <span className="text-sm capitalize">{item.contentType}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          {item.status === 'scheduled' && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(item.scheduledFor || '')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm line-clamp-2">{item.content}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Created: {formatDate(item.createdAt)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only sm:text-xs">Duplicate</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only sm:text-xs">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only sm:text-xs">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No content items found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;

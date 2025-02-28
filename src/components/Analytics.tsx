import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [platform, setPlatform] = useState<string>('all');
  
  // Sample data for charts
  const engagementData = [
    { date: '2023-01-01', twitter: 120, linkedin: 80, instagram: 90, facebook: 60 },
    { date: '2023-01-08', twitter: 132, linkedin: 89, instagram: 101, facebook: 62 },
    { date: '2023-01-15', twitter: 141, linkedin: 97, instagram: 110, facebook: 71 },
    { date: '2023-01-22', twitter: 154, linkedin: 105, instagram: 120, facebook: 80 },
    { date: '2023-01-29', twitter: 162, linkedin: 112, instagram: 132, facebook: 85 },
    { date: '2023-02-05', twitter: 180, linkedin: 120, instagram: 140, facebook: 90 },
  ];
  
  const contentTypeData = [
    { type: 'Short-form', count: 45, engagement: 2100 },
    { type: 'Long-form', count: 30, engagement: 1800 },
    { type: 'Threads', count: 15, engagement: 1200 },
    { type: 'Polls', count: 10, engagement: 900 },
  ];
  
  const audienceData = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 15 },
    { name: '55+', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const platformColors: Record<string, string> = {
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    instagram: '#E1306C',
    facebook: '#1877F2'
  };
  
  const topPosts = [
    { id: 1, platform: 'twitter', content: 'Exciting news! We just launched our new product...', engagement: 524, date: '2023-02-01' },
    { id: 2, platform: 'linkedin', content: "We're thrilled to announce our latest partnership with...", engagement: 387, date: '2023-01-25' },
    { id: 3, platform: 'instagram', content: 'Check out our behind-the-scenes look at our team retreat!', engagement: 903, date: '2023-01-18' },
    { id: 4, platform: 'facebook', content: 'Join us for our upcoming webinar on digital marketing trends...', engagement: 245, date: '2023-02-03' },
    { id: 5, platform: 'twitter', content: "We're hiring! Check out our open positions...", engagement: 412, date: '2023-01-22' },
  ];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filterDataByPlatform = (data: { id: number, platform: string, content: string, engagement: number, date: string }[]) => {
    if (platform === 'all') return data;
    return data.filter(item => item.platform === platform);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,024</div>
            <p className="text-xs text-muted-foreground">+18% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+8% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">+0.6% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Instagram</div>
            <p className="text-xs text-muted-foreground">42% of total engagement</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Engagement Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
          <CardDescription>
            Track engagement metrics across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value: string) => formatDate(value)}
                  formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend />
                {(platform === 'all' ? ['twitter', 'linkedin', 'instagram', 'facebook'] : [platform]).map((p: string) => (
                  <Line 
                    key={p}
                    type="monotone" 
                    dataKey={p} 
                    stroke={platformColors[p]} 
                    activeDot={{ r: 8 }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Performance & Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>
              Analyze performance by content type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="count">
              <TabsList className="mb-4">
                <TabsTrigger value="count">Post Count</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>
              
              <TabsContent value="count">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="engagement" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>
              Age distribution of your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {audienceData.map((entry: { name: string, value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>
            Your best performing content by engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterDataByPlatform(topPosts).map((post: { id: number, platform: string, content: string, engagement: number, date: string }, index: number) => (
              <div key={post.id} className="flex items-start p-3 rounded-lg border border-border/40">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${platformColors[post.platform]}20`, color: platformColors[post.platform] }}>
                      {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{post.content}</p>
                  <p className="mt-1 text-xs font-medium">
                    {post.engagement.toLocaleString()} engagements
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

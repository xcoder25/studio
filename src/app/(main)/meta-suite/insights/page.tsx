
'use client';

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  MessageSquare,
  Facebook,
  Instagram,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const engagementData = [
  { name: 'Jan', Likes: 4000, Comments: 2400, Shares: 1200 },
  { name: 'Feb', Likes: 3000, Comments: 1398, Shares: 900 },
  { name: 'Mar', Likes: 2000, Comments: 9800, Shares: 2290 },
  { name: 'Apr', Likes: 2780, Comments: 3908, Shares: 2000 },
  { name: 'May', Likes: 1890, Comments: 4800, Shares: 2181 },
  { name: 'Jun', Likes: 2390, Comments: 3800, Shares: 2500 },
  { name: 'Jul', Likes: 3490, Comments: 4300, Shares: 2100 },
];

const reachData = [
    { name: 'Week 1', Reach: 24000 },
    { name: 'Week 2', Reach: 13980 },
    { name: 'Week 3', Reach: 98000 },
    { name: 'Week 4', Reach: 39080 },
];

const ageData = [
  { name: '18-24', value: 400 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 300 },
  { name: '45-54', value: 200 },
  { name: '55+', value: 150 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const topLocations = [
    { name: 'United States', value: 75 },
    { name: 'United Kingdom', value: 45 },
    { name: 'India', value: 30 },
    { name: 'Germany', value: 25 },
    { name: 'Canada', value: 20 },
]

export default function InsightsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Insights & Analytics</h1>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Last 30 days
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                        <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                        <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                        <DropdownMenuItem>Custom range</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button>Export</Button>
            </div>
        </div>

        <Tabs defaultValue="engagement">
            <TabsList>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="reach">Reach</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="engagement" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Reach</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">67,234</div><p className="text-xs text-muted-foreground">+12.5% from last period</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">8,542</div><p className="text-xs text-muted-foreground">+8.3% from last period</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Followers</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">12,845</div><p className="text-xs text-muted-foreground">+245 this period</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">6.8%</div><p className="text-xs text-muted-foreground">-0.2% from last period</p></CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Engagement Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer>
                            <LineChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Likes" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Comments" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="Shares" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="reach" className="space-y-4 mt-4">
                 <Card>
                    <CardHeader><CardTitle>Reach Growth</CardTitle></CardHeader>
                     <CardContent className="h-96">
                        <ResponsiveContainer>
                             <LineChart data={reachData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="Reach" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
            </TabsContent>
            <TabsContent value="demographics" className="space-y-4 mt-4">
                 <div className="grid gap-4 md:grid-cols-2">
                     <Card>
                        <CardHeader><CardTitle>Age Distribution</CardTitle></CardHeader>
                         <CardContent className="h-80">
                             <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                             </ResponsiveContainer>
                        </CardContent>
                     </Card>
                      <Card>
                        <CardHeader><CardTitle>Top Locations</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                             {topLocations.map(location => (
                                <div key={location.name} className="space-y-1">
                                    <p className="text-sm font-medium">{location.name}</p>
                                    <Progress value={location.value} />
                                </div>
                             ))}
                        </CardContent>
                     </Card>
                 </div>
            </TabsContent>
             <TabsContent value="top-posts" className="space-y-4 mt-4">
                <Card>
                    <CardHeader><CardTitle>Top Performing Posts</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Post</TableHead>
                                    <TableHead>Reach</TableHead>
                                    <TableHead>Likes</TableHead>
                                    <TableHead>Comments</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>New AI Feature Launch!...</TableCell>
                                        <TableCell>25.4K</TableCell>
                                        <TableCell>1.2K</TableCell>
                                        <TableCell>345</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </main>
  );
}

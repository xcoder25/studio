
'use client';

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  Twitter,
  Facebook,
  Instagram,
  Clapperboard,
  Image as ImageIcon,
  Bot,
  Hash,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zM12 21.8c5.448 0 9.882-4.435 9.882-9.882S17.448 2.036 12 2.036c-5.447 0-9.882 4.434-9.882 9.882 0 2.06.613 4.025 1.71 5.631L2.525 21.48l6.32-1.659c1.55 .883 3.287 1.348 5.155 1.348z" />
        <path d="M15.343 14.939c-.195-.098-1.155-.57-1.334-.635-.18-.066-.312-.098-.444.098-.132.196-.504.636-.618.768-.114.133-.228.148-.423.05s-1.65-.61-3.144-1.944c-1.162-1.03-1.95-2.296-2.285-2.678-.335-.382-.033-.585.065-.682.09-.09.195-.244.293-.364.1-.118.132-.196.198-.329.066-.132.033-.26-.016-.358-.05-.098-.444-10.66-.61-1.46-.164-.39-.33-.335-.462-.34s-.26-.016-.392-.016a.723.723 0 00-.527.245c-.18.196-.693.682-.693 1.664s.71 1.933.81 2.064c.1.132 1.397 2.136 3.38 2.992.47.203.84.324 1.125.415.478.147.904.128 1.22.078.368-.056 1.155-.47 1.32-.914. १६৪-.444.164-.82.114-.914s-.082-.148-.178-.244z" />
    </svg>
);


export default function PlannerPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 h-full">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Content Planner
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              View Calendar
            </Button>
            <Button size="sm">Schedule Post</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Create Post</CardTitle>
                <CardDescription>
                  Draft your content and select which platforms to publish to.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label>Platforms</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox id="facebook" defaultChecked />
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <Label htmlFor="facebook">Facebook</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="instagram" defaultChecked />
                        <Instagram className="h-5 w-5 text-fuchsia-500" />
                        <Label htmlFor="instagram">Instagram</Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <div className="relative">
                      <Textarea
                        id="content"
                        defaultValue="Excited to announce our new AI-powered video editor! Create stunning videos from text prompts in seconds. #AI #VideoEditor #Innovation"
                        className="min-h-32"
                      />
                      <Button variant="ghost" size="icon" className="absolute bottom-2 right-10 h-8 w-8">
                        <Bot className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label>Media</Label>
                     <div className="flex gap-2">
                        <Button variant="outline"><ImageIcon className="mr-2"/> Photos/Videos</Button>
                        <Button variant="outline"><Clapperboard className="mr-2"/> Create Reel</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Hashtags & Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>First Comment (Instagram)</Label>
                        <Textarea placeholder="Add a first comment to boost engagement..."/>
                    </div>
                     <div className="grid gap-3">
                        <Label>Product Tags</Label>
                        <Input placeholder="Tag products from your catalog..."/>
                    </div>
                    <div className="grid gap-3">
                        <Label>Hashtags</Label>
                        <div className="flex flex-wrap gap-2">
                            {['#AI', '#VideoEditor', '#Tech', '#SaaS', '#ContentCreation'].map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                            <Button variant="ghost" size="sm"><Hash className="mr-1"/> Add Hashtag</Button>
                        </div>
                    </div>
                </CardContent>
             </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Audience</Label>
                  <p className="text-sm text-muted-foreground">Public</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="publish-time">Publish Time</Label>
                  <Input id="publish-time" type="datetime-local" />
                   <p className="text-xs text-muted-foreground">AI suggestion: Tomorrow at 10:00 AM</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full">Schedule</Button>
                <Button variant="outline" className="w-full">Save as Draft</Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Platform Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="facebook" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="facebook">Facebook</TabsTrigger>
                        <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    </TabsList>
                    <TabsContent value="facebook" className="p-4">
                        <div className="rounded-lg border bg-background p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar><AvatarImage src="https://picsum.photos/seed/trendix/40/40" data-ai-hint="logo company"/><AvatarFallback>T</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">Trendix</p>
                                    <p className="text-xs text-muted-foreground">Just now</p>
                                </div>
                            </div>
                            <p className="text-sm">Excited to announce our new AI-powered video editor! Create stunning videos from text prompts in seconds. #AI #VideoEditor #Innovation</p>
                            <div className="mt-3 aspect-video rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="text-muted-foreground" />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="instagram" className="p-4">
                         <div className="rounded-lg border bg-background p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar><AvatarImage src="https://picsum.photos/seed/trendix/40/40" data-ai-hint="logo company"/><AvatarFallback>T</AvatarFallback></Avatar>
                                <p className="font-semibold">Trendix</p>
                            </div>
                            <div className="mt-3 aspect-square rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="text-muted-foreground" />
                            </div>
                            <div className="mt-3">
                                <p className="text-sm"><span className="font-semibold">Trendix</span> Excited to announce our new AI-powered video editor! Create stunning videos from text prompts in seconds. #AI #VideoEditor #Innovation</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

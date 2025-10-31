
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
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-green-500"
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zM12 21.8c5.448 0 9.882-4.435 9.882-9.882S17.448 2.036 12 2.036c-5.447 0-9.882 4.434-9.882 9.882 0 2.06.613 4.025 1.71 5.631L2.525 21.48l6.32-1.659c1.55 .883 3.287 1.348 5.155 1.348z" />
        <path d="M15.343 14.939c-.195-.098-1.155-.57-1.334-.635-.18-.066-.312-.098-.444.098-.132.196-.504.636-.618.768-.114.133-.228.148-.423.05s-1.65-.61-3.144-1.944c-1.162-1.03-1.95-2.296-2.285-2.678-.335-.382-.033-.585.065-.682.09-.09.195-.244.293-.364.1-.118.132-.196.198-.329.066-.132.033-.26-.016-.358-.05-.098-.444-1.066-.61-1.46-.164-.39-.33-.335-.462-.34s-.26-.016-.392-.016a.723.723 0 00-.527.245c-.18.196-.693.682-.693 1.664s.71 1.933.81 2.064c.1.132 1.397 2.136 3.38 2.992.47.203.84.324 1.125.415.478.147.904.128 1.22.078.368-.056 1.155-.47 1.32-.914.164-.444.164-.82.114-.914s-.082-.148-.178-.244z" />
    </svg>
);


export default function MetaSuiteDashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.8K</div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+42.3K</div>
            <p className="text-xs text-muted-foreground">+8.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">12 unanswered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,482</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent messages, comments, and leads from your connected accounts.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/meta-suite/inbox">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell>
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </TableCell>
                  <TableCell>
                    How can I get started with the new feature?
                  </TableCell>
                  <TableCell className="text-right">2 min ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                   <TableCell>
                    <Instagram className="h-5 w-5 text-fuchsia-500" />
                  </TableCell>
                  <TableCell>
                    Commented: "This looks amazing! 🔥"
                  </TableCell>
                  <TableCell className="text-right">1 hour ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      noah@example.com
                    </div>
                  </TableCell>
                   <TableCell>
                    <WhatsAppIcon />
                  </TableCell>
                   <TableCell>
                    Is this available in my country yet?
                  </TableCell>
                  <TableCell className="text-right">3 hours ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Create content, schedule posts, and manage your presence.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/meta-suite/planner" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold">Create Post</h4>
                <p className="text-sm text-muted-foreground">Draft and publish content for Facebook and Instagram.</p>
            </Link>
            <Link href="/meta-suite/planner" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold">Create Story or Reel</h4>
                <p className="text-sm text-muted-foreground">Share vertical content to engage your audience.</p>
            </Link>
            <Link href="/meta-suite/ads" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold">Create Ad</h4>
                <p className="text-sm text-muted-foreground">Reach a wider audience with a targeted ad campaign.</p>
            </Link>
            <Link href="/meta-suite/inbox" className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold">Go to Inbox</h4>
                <p className="text-sm text-muted-foreground">Respond to all your messages and comments in one place.</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

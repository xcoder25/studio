
'use client';

import {
  File,
  PlusCircle,
  Search,
  Smile,
  Paperclip,
  Mic,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Facebook,
  Instagram,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        <path d="M15.343 14.939c-.195-.098-1.155-.57-1.334-.635-.18-.066-.312-.098-.444.098-.132.196-.504.636-.618.768-.114.133-.228.148-.423.05s-1.65-.61-3.144-1.944c-1.162-1.03-1.95-2.296-2.285-2.678-.335-.382-.033-.585.065-.682.09-.09.195-.244.293-.364.1-.118.132-.196.198-.329.066-.132.033-.26-.016-.358-.05-.098-.444-1.066-.61-1.46-.164-.39-.33-.335-.462-.34s-.26-.016-.392-.016a.723.723 0 00-.527.245c-.18.196-.693.682-.693 1.664s.71 1.933.81 2.064c.1.132 1.397 2.136 3.38 2.992.47.203.84.324 1.125.415.478.147.904.128 1.22.078.368-.056 1.155-.47 1.32-.914. ১৬৪-.444.164-.82.114-.914s-.082-.148-.178-.244z" />
    </svg>
);

const conversations = [
  { id: 1, name: 'Olivia Martin', lastMessage: 'Sure, I can help with that. What is your order number?', platform: 'Facebook', unread: 2, avatar: 'https://picsum.photos/seed/1/40/40', aiHint: 'avatar' },
  { id: 2, name: 'Jackson Lee', lastMessage: 'Commented: "Love this! 🔥"', platform: 'Instagram', unread: 0, avatar: 'https://picsum.photos/seed/2/40/40', aiHint: 'avatar' },
  { id: 3, name: 'Isabella Nguyen', lastMessage: 'Can you tell me more about your new collection?', platform: 'WhatsApp', unread: 0, avatar: 'https://picsum.photos/seed/3/40/40', aiHint: 'avatar' },
];

const platformIcons = {
    Facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    Instagram: <Instagram className="h-5 w-5 text-fuchsia-500" />,
    WhatsApp: <WhatsAppIcon />,
};

const quickReplies = ["Yes, we ship worldwide!", "Let me check that for you...", "Thank you for your interest!"]

export default function UnifiedInboxPage() {
    const [selectedConvo, setSelectedConvo] = useState(conversations[0]);
    
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 h-full">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="p-4">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="w-full rounded-lg bg-background pl-8"
                />
              </div>
            </form>
          </CardHeader>
          <div className="p-4 pt-0 border-b">
            <div className="flex justify-around">
                <Button variant="ghost" className="flex-1 text-primary bg-muted">All</Button>
                <Button variant="ghost" className="flex-1">Unread</Button>
                <Button variant="ghost" className="flex-1">Starred</Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-4 pt-0">
            {conversations.map((convo) => (
                <button key={convo.id} onClick={() => setSelectedConvo(convo)} className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    selectedConvo.id === convo.id && 'bg-muted'
                )}>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={convo.avatar} alt={convo.name} data-ai-hint={convo.aiHint}/>
                                <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-semibold">{convo.name}</div>
                        </div>
                        {platformIcons[convo.platform as keyof typeof platformIcons]}
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                        {convo.lastMessage}
                    </div>
                    {convo.unread > 0 && <Badge>{convo.unread} unread</Badge>}
                </button>
            ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <div className="lg:col-span-2 h-full">
        <Card className="h-full flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={selectedConvo.avatar} alt={selectedConvo.name} data-ai-hint={selectedConvo.aiHint}/>
                        <AvatarFallback>{selectedConvo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{selectedConvo.name}</p>
                        <p className="text-xs text-muted-foreground">On {selectedConvo.platform}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Star</Button>
                    <Button variant="outline" size="sm">Archive</Button>
                    <Button variant="outline" size="sm">Tag</Button>
                </div>
            </CardHeader>
           <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={selectedConvo.avatar} alt="User" data-ai-hint={selectedConvo.aiHint}/><AvatarFallback>OM</AvatarFallback></Avatar>
                    <div className="space-y-1">
                        <p className="rounded-lg bg-muted p-3 text-sm">What is your order number?</p>
                        <p className="text-xs text-muted-foreground">2:14 PM</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 justify-end">
                    <div className="space-y-1 text-right">
                        <p className="rounded-lg bg-primary text-primary-foreground p-3 text-sm">It's #123456</p>
                        <p className="text-xs text-muted-foreground">2:15 PM</p>
                    </div>
                    <Avatar className="h-8 w-8"><AvatarImage src="https://picsum.photos/seed/trendix/40/40" alt="Agent" data-ai-hint="logo company" /><AvatarFallback>T</AvatarFallback></Avatar>
                </div>
            </div>
           </ScrollArea>
           <div className="p-4 border-t bg-muted/50">
               <div className="space-y-2">
                    <div className="flex gap-2">
                        {quickReplies.map(reply => (
                            <Button key={reply} variant="outline" size="sm">{reply}</Button>
                        ))}
                    </div>
                   <Textarea
                       placeholder="Type your message..."
                       className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                   />
                   <div className="flex items-center">
                   <TooltipProvider>
                       <Tooltip>
                           <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon">
                               <Paperclip className="size-4" />
                           </Button>
                           </TooltipTrigger>
                           <TooltipContent>Attach file</TooltipContent>
                       </Tooltip>
                       <Tooltip>
                           <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon">
                               <Mic className="size-4" />
                           </Button>
                           </TooltipTrigger>
                           <TooltipContent>Use voice</TooltipContent>
                       </Tooltip>
                       <Tooltip>
                           <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon">
                               <Smile className="size-4" />
                           </Button>
                           </TooltipTrigger>
                           <TooltipContent>Add emoji</TooltipContent>
                       </Tooltip>
                   </TooltipProvider>
                       <Button type="submit" size="sm" className="ml-auto">
                           Send
                       </Button>
                   </div>
               </div>
           </div>
        </Card>
      </div>
    </main>
  );
}


'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { generateReply } from '@/ai/flows/generate-reply';
import { Loader2, Send, Twitter, MessageSquare, Instagram, Bot, Sparkles, Wand2, Search, ChevronsUpDown, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const accounts = {
    trendix: {
        name: 'Trendix',
        conversations: [
            { id: 1, name: 'Alice Johnson', handle: '@alicej', platform: 'Twitter', message: 'Just wanted to say I love your new feature! It\'s a game-changer. 🚀', avatar: 'https://picsum.photos/100/100?random=5', type: 'Mention', unread: 2 },
            { id: 2, name: 'Bob Williams', handle: 'bobw', platform: 'Instagram', message: 'Can you tell me more about your pricing plans?', avatar: 'https://picsum.photos/100/100?random=6', type: 'DM' },
        ],
        messageThread: {
            1: [
                { from: 'user', text: 'Just wanted to say I love your new feature! It\'s a game-changer. 🚀' },
                { from: 'agent', text: 'That\'s amazing to hear, Alice! We\'re so glad you\'re enjoying it. Anything specific you like the most?' },
                { from: 'user', text: 'The AI-powered suggestions are incredibly accurate. Saves me so much time!' },
            ],
            2: [ { from: 'user', text: 'Can you tell me more about your pricing plans?' } ],
        }
    },
    client_a: {
        name: 'Client A',
        conversations: [
            { id: 3, name: 'Charlie Brown', handle: '@charlieb', platform: 'Twitter', message: 'I\'m having some trouble with the setup process. Can you help?', avatar: 'https://picsum.photos/100/100?random=7', type: 'Comment' },
            { id: 4, name: 'Diana Miller', handle: 'dianam', platform: 'Facebook', message: 'Your last post was so insightful! Looking forward to more content like that.', avatar: 'https://picsum.photos/100/100?random=8', type: 'Comment' },
        ],
        messageThread: {
            3: [ { from: 'user', text: 'I\'m having some trouble with the setup process. Can you help?' } ],
            4: [ { from: 'user', text: 'Your last post was so insightful! Looking forward to more content like that.' } ]
        }
    }
}

const allPlatforms = ['Twitter', 'Instagram', 'Facebook'];

const platformConfig = {
    Twitter: { icon: Twitter, color: 'text-sky-500' },
    Instagram: { icon: Instagram, color: 'text-fuchsia-500' },
    Facebook: { icon: Facebook, color: 'text-blue-600' },
}

export default function UnifiedInboxPage() {
    const { toast } = useToast();
    const [selectedAccount, setSelectedAccount] = useState('trendix');
    const [platformFilters, setPlatformFilters] = useState<string[]>(allPlatforms);

    const currentAccountData = accounts[selectedAccount as keyof typeof accounts];
    
    const filteredConversations = useMemo(() => {
        return currentAccountData.conversations.filter(convo => 
            platformFilters.includes(convo.platform)
        );
    }, [currentAccountData.conversations, platformFilters]);

    const [selectedConversation, setSelectedConversation] = useState(filteredConversations[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [tone, setTone] = useState('Friendly');

    const handleAccountChange = (accountId: string) => {
        setSelectedAccount(accountId);
        const newAccountData = accounts[accountId as keyof typeof accounts];
        const newFilteredConvos = newAccountData.conversations.filter(convo => 
            platformFilters.includes(convo.platform)
        );
        setSelectedConversation(newFilteredConvos[0] || null);
    }
    
    const handleFilterToggle = (platform: string) => {
        setPlatformFilters(prev => 
            prev.includes(platform) 
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    }

    React.useEffect(() => {
        if (filteredConversations.length > 0 && !filteredConversations.find(c => c.id === selectedConversation?.id)) {
            setSelectedConversation(filteredConversations[0]);
        } else if (filteredConversations.length === 0) {
            setSelectedConversation(null!);
        }
    }, [filteredConversations, selectedConversation]);
    
    const handleGenerateReply = async () => {
        if (!selectedConversation) return;
        setIsLoading(true);
        try {
            const lastMessage = currentAccountData.messageThread[selectedConversation.id as keyof typeof currentAccountData.messageThread].slice(-1)[0].text;
            const result = await generateReply({
                conversationContext: lastMessage,
                tone: tone,
                brandVoice: "We are Trendix, a helpful and innovative AI-powered social media tool. Our tone is generally upbeat and professional."
            });
            setReplyText(result.suggestedReply);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Reply Generation Failed' });
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
    <div className="grid grid-cols-10 gap-4 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <Card className="col-span-3 lg:col-span-2 flex flex-col">
            <CardHeader className='p-3 space-y-3'>
                <Select value={selectedAccount} onValueChange={handleAccountChange}>
                    <SelectTrigger className="h-10">
                        <div className="flex items-center gap-2">
                             <Avatar className="size-6">
                                <AvatarImage src={`https://picsum.photos/100/100?random=${selectedAccount === 'trendix' ? 1 : 99}`} data-ai-hint="logo company"/>
                                <AvatarFallback>{currentAccountData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(accounts).map(key => {
                            const account = accounts[key as keyof typeof accounts];
                            return (
                                <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-6">
                                            <AvatarImage src={`https://picsum.photos/100/100?random=${key === 'trendix' ? 1 : 99}`} data-ai-hint="logo company"/>
                                            <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{account.name}</span>
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
                 <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search inbox..." className="pl-8 h-9" />
                </div>
                 <div className="flex gap-1">
                    {allPlatforms.map(platform => {
                        const config = platformConfig[platform as keyof typeof platformConfig];
                        const Icon = config.icon;
                        return (
                            <Button 
                                key={platform} 
                                variant={platformFilters.includes(platform) ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8 flex-1"
                                onClick={() => handleFilterToggle(platform)}
                            >
                                <Icon className={cn("size-4", config.color)} />
                            </Button>
                        )
                    })}
                </div>
            </CardHeader>
            <ScrollArea>
                 <div className="space-y-1 p-2">
                    {filteredConversations.map(convo => (
                        <button key={convo.id} onClick={() => setSelectedConversation(convo)} className={cn(
                            "w-full text-left p-2 rounded-lg hover:bg-muted transition-colors",
                            selectedConversation?.id === convo.id && 'bg-muted'
                        )}>
                           <div className="flex items-start gap-3">
                                <Avatar className="size-8">
                                    <AvatarImage src={convo.avatar} data-ai-hint="avatar"/>
                                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className='flex-1 overflow-hidden'>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold">{convo.name}</h4>
                                        {React.createElement(platformConfig[convo.platform as keyof typeof platformConfig].icon, { className: "size-4 " + platformConfig[convo.platform as keyof typeof platformConfig].color })}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{convo.message}</p>
                                </div>
                                {convo.unread && <Badge className="h-5">{convo.unread}</Badge>}
                           </div>
                        </button>
                    ))}
                 </div>
            </ScrollArea>
        </Card>

        {/* Message Thread */}
        <div className="col-span-7 lg:col-span-5 flex flex-col gap-4">
            <Card className="flex-grow flex flex-col">
                {selectedConversation ? (
                    <>
                        <CardHeader className="border-b p-4">
                            <h3 className="font-semibold">{selectedConversation.name}</h3>
                            <p className="text-sm text-muted-foreground">on {selectedConversation.platform}</p>
                        </CardHeader>
                        <CardContent className="flex-grow p-4 space-y-4">
                            {currentAccountData.messageThread[selectedConversation.id as keyof typeof currentAccountData.messageThread].map((msg, index) => (
                                <div key={index} className={cn(
                                    "flex items-end gap-2",
                                    msg.from === 'agent' ? 'justify-end' : 'justify-start'
                                )}>
                                {msg.from === 'user' && <Avatar className="size-6"><AvatarImage src={selectedConversation.avatar} data-ai-hint="avatar"/></Avatar>}
                                    <p className={cn(
                                        "max-w-xs rounded-xl p-3 text-sm",
                                        msg.from === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    )}>{msg.text}</p>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                            <div className="relative w-full">
                                <Textarea placeholder="Type your reply..." className="pr-20"/>
                                <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
                                    Send <Send className="ml-2"/>
                                </Button>
                            </div>
                        </CardFooter>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="size-16" />
                        <p className="mt-4">Select a conversation to start</p>
                    </div>
                )}
            </Card>
        </div>

        {/* AI Assistant Panel */}
        <Card className="col-span-4 lg:col-span-3 flex flex-col">
            <CardHeader className="text-center">
                <Bot className="mx-auto size-8 text-primary" />
                <CardTitle>Serai AI</CardTitle>
                <CardDescription>Your intelligent reply assistant</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="tone"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Witty">Witty</SelectItem>
                            <SelectItem value="Empathetic">Empathetic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reply-text">Suggested Reply</Label>
                    <Textarea 
                        id="reply-text" 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)} 
                        className="min-h-[200px]"
                        placeholder="Click 'Generate' to create a reply..."
                    />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                 <Button onClick={handleGenerateReply} disabled={isLoading || !selectedConversation} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {replyText ? 'Regenerate' : 'Generate'}
                </Button>
                 <Button variant="outline" disabled={!replyText} className="w-full">
                    <Wand2 />
                    Refine
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}

    
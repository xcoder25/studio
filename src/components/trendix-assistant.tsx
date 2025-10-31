'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle,
  Lightbulb,
  Book,
  Video,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface TrendixAssistantProps {
  context?: string; // Current page context (e.g., "dashboard", "video-editor")
}

const QUICK_HELP = {
  dashboard: [
    "How do I connect social media accounts?",
    "What do the engagement metrics mean?",
    "How can I schedule posts?",
    "Show me trending topics"
  ],
  'video-editor': [
    "How do I add text to my video?",
    "How to generate AI voice?",
    "What are the best effects for reels?",
    "How do I export for TikTok?"
  ],
  composer: [
    "How do I create a post?",
    "Can AI write captions for me?",
    "How to schedule across platforms?",
    "What hashtags should I use?"
  ],
  general: [
    "What is Trendix?",
    "How do I get started?",
    "What features are available?",
    "How to upgrade to Pro?"
  ]
};

const KNOWLEDGE_BASE = {
  "connect social media": "Go to Settings → Social Accounts. Click 'Connect' next to any platform (Twitter, Instagram, Facebook, TikTok, LinkedIn, YouTube). You'll be redirected to authorize Trendix. Your accounts will sync automatically!",
  "schedule posts": "Use the Composer to create your post, then click 'Schedule' instead of 'Publish Now'. Pick your date & time, and Trendix will post automatically. You can see all scheduled posts in the Calendar.",
  "ai voice": "In the Video Editor, click 'Add Audio' → 'Text-to-Speech'. Type your script, choose a voice style, and generate! You can adjust speed, pitch, and add emotions.",
  "export video": "Click 'Export' in the top right. Choose your platform preset (TikTok, Instagram, YouTube) or customize resolution & format. Your video will be ready in seconds!",
  "engagement metrics": "- **Likes**: Total reactions to your content\n- **Comments**: Conversations started\n- **Shares**: How often people share your posts\n- **Reach**: Total unique viewers",
  "trendix features": "Trendix offers:\n• AI-powered content creation\n• Social media scheduling\n• Video editing with AI\n• Analytics & insights\n• Trend discovery\n• Multi-platform management",
  "get started": "1. Connect your social accounts in Settings\n2. Explore the Dashboard for insights\n3. Try creating a post in Composer\n4. Generate a video in Video Editor\n5. Check out trending topics!",
  "add text video": "In Video Editor:\n1. Click 'Text' in the toolbar\n2. Choose a text style\n3. Type your text\n4. Drag it to position\n5. Animate it from the Effects panel",
  "trending topics": "Check your Dashboard sidebar for Trend Finder! We show you the hottest hashtags, sounds, and challenges in your niche. Click 'Use Trend' to instantly create content around it.",
  "upgrade pro": "Pro unlocks:\n• Unlimited AI generations\n• Advanced video effects\n• Priority support\n• Team collaboration\n• White-label exports\n\nClick 'Upgrade' in the sidebar!"
};

export default function TrendixAssistant({ context = 'general' }: TrendixAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your Trendix AI Assistant. How can I help you today?",
      timestamp: new Date(),
      suggestions: QUICK_HELP[context as keyof typeof QUICK_HELP] || QUICK_HELP.general
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const findBestAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Search through knowledge base
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery.split(' ').find(word => word.length > 3) || '')) {
        return value;
      }
    }

    // Contextual responses
    if (lowerQuery.includes('how') || lowerQuery.includes('what')) {
      return "I'd be happy to help! Could you be more specific? You can ask me about:\n• Connecting social accounts\n• Creating & scheduling posts\n• Using the video editor\n• Understanding analytics\n• Finding trends\n\nOr try one of the suggestions below!";
    }

    // Default response
    return "I'm here to help! Try asking about:\n• **Social media management** - connecting accounts, scheduling posts\n• **Content creation** - using AI to create posts & videos\n• **Analytics** - understanding your engagement metrics\n• **Video editing** - adding effects, text, and exporting\n\nWhat would you like to know more about?";
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const answer = findBestAnswer(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: answer,
        timestamp: new Date(),
        suggestions: QUICK_HELP[context as keyof typeof QUICK_HELP] || QUICK_HELP.general
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-96 shadow-2xl z-50 border-2 border-primary/20 transition-all",
      isMinimized ? "h-16" : "h-[600px]"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <CardTitle className="text-lg font-bold">Trendix AI Assistant</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn(
                  "flex",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] rounded-lg p-3 space-y-2",
                    message.type === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.suggestions && message.type === 'assistant' && (
                      <div className="space-y-1 pt-2">
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Quick questions:
                        </p>
                        {message.suggestions.slice(0, 3).map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs h-auto py-2 justify-start"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            <HelpCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="text-left">{suggestion}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSendMessage("Show me tutorials")}
                className="flex-1"
              >
                <Book className="h-4 w-4 mr-1" />
                Tutorials
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSendMessage("What are trending topics?")}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-1" />
                Trends
              </Button>
            </div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  );
}


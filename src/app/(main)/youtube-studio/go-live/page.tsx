
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Radio, Video, CameraOff, Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const sampleChat = [
    { user: 'Alex', message: 'Excited for the stream! 🔥' },
    { user: 'Maria', message: 'What are we talking about today?' },
    { user: 'Sam', message: 'Let\'s gooo! 🚀' },
]

export default function GoLivePage() {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    
    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [toast]);

    const handleStreamToggle = () => {
        setIsStreaming(!isStreaming);
        toast({
            title: isStreaming ? 'Stream Stopped' : 'You are now live!',
            description: isStreaming ? 'Your live stream has ended.' : 'Your audience can now see you.',
        })
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
                <Card className="overflow-hidden">
                     <div className="aspect-video bg-black flex items-center justify-center relative">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        {!hasCameraPermission && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
                                <CameraOff className="size-16" />
                                <p className="mt-4 text-lg">Camera access is required</p>
                            </div>
                        )}
                        {isStreaming && (
                             <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                                <Radio className="size-4 animate-pulse" />
                                <span className="text-sm font-semibold">LIVE</span>
                            </div>
                        )}
                     </div>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Stream Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., My Awesome Live Stream" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Tell your audience what this stream is about..." />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-4">
                <Card className="flex flex-col h-[calc(100vh-8.5rem)]">
                    <CardHeader>
                        <CardTitle>Live Chat</CardTitle>
                        <CardDescription>Engage with your audience in real-time.</CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex-grow px-6">
                        <div className="space-y-4">
                           {sampleChat.map((chat, i) => (
                               <div key={i} className="flex items-start gap-2">
                                    <Avatar className="size-8">
                                        <AvatarImage src={`https://picsum.photos/100/100?random=${i+20}`} data-ai-hint="avatar"/>
                                        <AvatarFallback>{chat.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold">{chat.user}</p>
                                        <p className="text-sm text-muted-foreground">{chat.message}</p>
                                    </div>
                               </div>
                           ))}
                        </div>
                    </ScrollArea>
                    <CardContent className="pt-4 border-t">
                        <div className="relative">
                            <Input placeholder="Send a message..." />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                <Send className="size-4" />
                            </Button>
                        </div>
                        <Button className="w-full mt-4" onClick={handleStreamToggle} disabled={!hasCameraPermission}>
                            {isStreaming ? "Stop Streaming" : "Start Streaming"}
                        </Button>
                         {hasCameraPermission === false && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access in your browser to start streaming.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

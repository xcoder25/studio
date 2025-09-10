
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
import { Radio, Video, CameraOff, Send, ScreenShare, Upload, Bot, Sparkles, Shield, LayoutGrid, MicOff, Disc } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';


const sampleChat = [
    { user: 'Alex', message: 'Excited for the stream! 🔥' },
    { user: 'Maria', message: 'What are we talking about today?' },
    { user: 'Sam', message: 'Let\'s gooo! 🚀' },
]

type StreamSource = 'camera' | 'screen' | 'video';

export default function GoLivePage() {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [source, setSource] = useState<StreamSource>('camera');
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const cleanupStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            if (videoRef.current.src && videoRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(videoRef.current.src);
            }
        }
    };
    
    const setupStream = async (type: StreamSource) => {
        cleanupStream();
        setPermissionError(null);
        try {
            let mediaStream: MediaStream | null = null;
            if (type === 'camera') {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } else if (type === 'screen') {
                mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            }
            
            if (mediaStream) {
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }
        } catch (error) {
            console.error(`Error accessing ${type}:`, error);
            const message = `Please enable ${type} permissions in your browser settings.`;
            setPermissionError(message);
            toast({
              variant: 'destructive',
              title: `${type.charAt(0).toUpperCase() + type.slice(1)} Access Denied`,
              description: message,
            });
        }
    };
    
    useEffect(() => {
        if (source !== 'video') {
          setupStream(source);
        } else {
            cleanupStream();
        }
        return cleanupStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);

    const handleSourceChange = (newSource: StreamSource) => {
        if (isStreaming) {
            toast({ variant: 'destructive', title: 'Cannot change source while streaming.' });
            return;
        }
        setSource(newSource);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            cleanupStream();
            if (videoRef.current) {
                const url = URL.createObjectURL(file);
                videoRef.current.src = url;
                videoRef.current.loop = true;
            }
        }
    }

    const handleStreamToggle = () => {
        const canStream = source === 'video' ? videoRef.current?.src : stream;
        if (!canStream) {
            toast({ variant: 'destructive', title: 'No stream source selected', description: 'Please select a camera, screen, or video file to start streaming.'});
            return;
        }
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
                        <video ref={videoRef} className={cn("w-full h-full object-cover", source === 'video' && 'object-contain')} autoPlay muted playsInline />
                        {permissionError && source !== 'video' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
                                <CameraOff className="size-16" />
                                <p className="mt-4 text-lg">Stream Source Error</p>
                                <p className="text-sm text-muted-foreground">{permissionError}</p>
                            </div>
                        )}
                         {source === 'video' && !videoRef.current?.src && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
                                <Upload className="size-16" />
                                <p className="mt-4 text-lg">No video file selected</p>
                                <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>Upload Video</Button>
                            </div>
                         )}
                        {isStreaming && (
                             <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                <Radio className="size-4" />
                                LIVE
                            </div>
                        )}
                     </div>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Studio Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Scenes</Label>
                            <div className="flex gap-2 mt-1">
                                <Button variant="outline" size="sm" className="flex items-center gap-2"><LayoutGrid className="size-4" /> Camera Only</Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-2"><LayoutGrid className="size-4" /> Screen + Cam</Button>
                            </div>
                        </div>
                         <div>
                            <Label className="text-xs text-muted-foreground">Audio</Label>
                            <div className="flex gap-2 mt-1">
                                <Button variant={isMuted ? 'destructive' : 'outline'} size="sm" className="flex items-center gap-2" onClick={() => setIsMuted(!isMuted)}>
                                    <MicOff className="size-4" /> {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                                </Button>
                            </div>
                        </div>
                         <div>
                            <Label className="text-xs text-muted-foreground">Recording</Label>
                            <div className="flex gap-2 mt-1">
                                <Button variant="outline" size="sm" className={cn("flex items-center gap-2", isRecording && "text-red-500")} onClick={() => setIsRecording(!isRecording)}>
                                    <Disc className={cn("size-4", isRecording && "animate-pulse")} /> {isRecording ? 'Stop Recording' : 'Start Recording'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stream Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={source} onValueChange={(v) => handleSourceChange(v as StreamSource)} disabled={isStreaming}>
                                <Label htmlFor="cam-src" className="flex items-center gap-4 p-3 rounded-lg border has-[:checked]:bg-muted has-[:disabled]:opacity-50">
                                    <Video className="size-5" />
                                    <span className="font-medium">Camera</span>
                                    <RadioGroupItem value="camera" id="cam-src" className="ml-auto"/>
                                </Label>
                                <Label htmlFor="screen-src" className="flex items-center gap-4 p-3 rounded-lg border has-[:checked]:bg-muted has-[:disabled]:opacity-50">
                                    <ScreenShare className="size-5" />
                                    <span className="font-medium">Screen Share</span>
                                    <RadioGroupItem value="screen" id="screen-src" className="ml-auto"/>
                                </Label>
                                <Label htmlFor="video-src" className="flex items-center gap-4 p-3 rounded-lg border has-[:checked]:bg-muted has-[:disabled]:opacity-50">
                                    <Upload className="size-5" />
                                    <span className="font-medium">Video File</span>
                                    <RadioGroupItem value="video" id="video-src" className="ml-auto" onClick={() => fileInputRef.current?.click()}/>
                                </Label>
                                <Input ref={fileInputRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFileChange} />
                            </RadioGroup>
                        </CardContent>
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
            </div>
            <div className="col-span-4 flex flex-col gap-6">
                <Card className="flex-grow flex flex-col h-[calc(50vh-5rem)]">
                    <CardHeader>
                        <CardTitle>Live Chat</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow px-6">
                        <div className="space-y-4">
                           {sampleChat.map((chat, i) => (
                               <div key={i} className="flex items-start gap-2">
                                    <Avatar className="size-8"><AvatarImage src={`https://picsum.photos/100/100?random=${i+20}`} data-ai-hint="avatar"/><AvatarFallback>{chat.user.charAt(0)}</AvatarFallback></Avatar>
                                    <div><p className="text-sm font-semibold">{chat.user}</p><p className="text-sm text-muted-foreground">{chat.message}</p></div>
                               </div>
                           ))}
                        </div>
                    </ScrollArea>
                    <CardContent className="pt-4 border-t">
                        <div className="relative"><Input placeholder="Send a message..." /><Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"><Send className="size-4" /></Button></div>
                    </CardContent>
                </Card>
                <Card className="flex-grow flex flex-col h-[calc(50vh-5rem)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> AI Streaming Assistant</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="space-y-2">
                            <Label>AI Chat</Label>
                            <Textarea placeholder="Instruct your AI... e.g., 'Pin the comment from @Alex'" rows={2}/>
                        </div>
                         <div className="space-y-2">
                            <Label>Suggested Replies</Label>
                            <div className="space-y-1 text-sm text-muted-foreground border rounded-lg p-2">
                                <p className="truncate hover:bg-muted p-1 rounded-sm cursor-pointer">"Thanks for the question! We're covering X, Y, and Z today."</p>
                                <p className="truncate hover:bg-muted p-1 rounded-sm cursor-pointer">"Glad you could make it!"</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <Label htmlFor="automod" className="flex items-center gap-2"><Shield /> Auto-moderation</Label>
                            <Input type="checkbox" id="automod" className="size-4"/>
                        </div>
                    </CardContent>
                     <CardContent className="border-t pt-4">
                        <Button className="w-full" onClick={handleStreamToggle}>
                            {isStreaming ? "Stop Streaming" : "Start Streaming"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

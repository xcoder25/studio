
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Video, Search } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface OutputPanelProps {
    isLoading: boolean;
    videoUrl: string;
}

export default function OutputPanel({ isLoading, videoUrl }: OutputPanelProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
        <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
                <h4 className="font-semibold text-primary">Create Your Story Video</h4>
                <p className="text-sm text-primary/90 mt-1">Turn ideas into animated stories—add characters, music, and more.</p>
                <div className="mt-3">
                    <Button size="sm" variant="secondary">Try Now</Button>
                    <Button size="sm" variant="ghost" className="text-primary/90 hover:text-primary hover:bg-transparent">Dismiss</Button>
                </div>
            </CardContent>
        </Card>
        <Card className="flex-grow flex flex-col">
            <CardHeader>
                <CardTitle>Generation History</CardTitle>
                <div className="flex gap-2 pt-2">
                    <Select defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="All Albums"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Albums</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center bg-muted/20 m-4 mt-0 rounded-lg">
                {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground text-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h3 className="font-semibold text-lg">Generating your masterpiece...</h3>
                    <p className="text-sm">This may take a minute or two. Please don't close this window.</p>
                </div>
                ) : videoUrl ? (
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain rounded-md"
                >
                    Your browser does not support the video tag.
                </video>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        <Video className="mx-auto h-16 w-16" />
                        <h3 className="font-semibold text-lg mt-4">Video Output</h3>
                        <p className="mt-2 text-sm">Your generated video will appear here once it's ready.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

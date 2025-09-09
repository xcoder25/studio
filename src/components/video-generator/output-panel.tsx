
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Video, Search } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface OutputPanelProps {
    isLoading: boolean;
    videoUrl: string;
}

export default function OutputPanel({ isLoading, videoUrl }: OutputPanelProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
        <Card>
            <CardContent className="p-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Create Your Story Video</h4>
                    <p className="text-sm text-primary/80">Turn ideas into animated stories—add characters, music, and more.</p>
                    <div className="mt-2">
                        <Button size="sm" variant="secondary">Try Now</Button>
                        <Button size="sm" variant="ghost">Dismiss</Button>
                    </div>
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
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p>Generating video... <br/>This may take a minute or two.</p>
                </div>
                ) : videoUrl ? (
                <video
                    src={videoUrl}
                    controls
                    className="w-full aspect-video rounded-md bg-muted"
                >
                    Your browser does not support the video tag.
                </video>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <Video className="mx-auto h-16 w-16" />
                        <p className="mt-4">Your generated video will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

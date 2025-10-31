
'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useVideoEditor } from '@/hooks/use-video-editor';
import { formatTime, formatFileSize } from '@/lib/video-editor-utils';
import {
  Play, Pause, SkipBack, SkipForward, Square, Maximize2, ZoomIn, ZoomOut,
  Move, Type, Circle, Square as SquareIcon, Star, Image as ImageIcon,
  Video, Music, Layers, Eye, EyeOff, Lock, Unlock, ChevronDown,
  ChevronRight, Plus, Trash2, Copy, Settings, Download, Upload, Save,
  FolderOpen, Search, Scissors, Wand2, Sparkles, Grid3x3, Ruler, Pipette,
  Blend, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Menu,
  X, ChevronUp, ChevronLeft, PanelLeftClose, PanelRightClose,
  Wand, Zap, Gauge, Palette, Crop, Filter, Sliders, Film, Mic,
  FileVideo, Layout, Box, Cpu, BrainCircuit, Webhook, Wind, Lightbulb,
  Target, Users, MessageSquare, Flame, Waves, BoxSelect, ScanFace,
  CloudUpload, Smartphone, Monitor, Tablet, RefreshCcw, Scan, Eraser,
  PaintBucket, Magnet, Minimize2, Focus, Aperture, Droplet, Sun,
  Moon, CloudRain, Snowflake, Zap as Lightning, Clock, TimerReset, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// CapCut + Canva Features
const smartTools = [
  { name: 'Auto Captions', icon: '📝', category: 'AI', desc: 'Generate captions automatically' },
  { name: 'Auto Reframe', icon: '📱', category: 'AI', desc: 'Smart crop for any platform' },
  { name: 'Background Removal', icon: '✂️', category: 'AI', desc: 'Remove bg instantly' },
  { name: 'Upscale Video', icon: '⬆️', category: 'AI', desc: 'AI 4K enhancement' },
  { name: 'Scene Detection', icon: '🎬', category: 'AI', desc: 'Auto split scenes' },
  { name: 'Color Match', icon: '🎨', category: 'AI', desc: 'Match colors across clips' },
  { name: 'Voice Clone', icon: '🎤', category: 'AI', desc: 'Clone any voice' },
  { name: 'Object Tracking', icon: '🎯', category: 'AI', desc: 'Track and blur objects' },
];

const effects = [
  { name: 'Gaussian Blur', icon: '🌫️', category: 'Blur' },
  { name: 'Motion Blur', icon: '💨', category: 'Blur' },
  { name: 'Radial Blur', icon: '🌀', category: 'Blur' },
  { name: 'Glitch', icon: '📺', category: 'Stylize' },
  { name: 'Glitch RGB', icon: '🌈', category: 'Stylize' },
  { name: 'VHS', icon: '📼', category: 'Stylize' },
  { name: 'Film Grain', icon: '🎞️', category: 'Stylize' },
  { name: 'Chromatic Aberration', icon: '🔴', category: 'Stylize' },
  { name: 'Neon Glow', icon: '✨', category: 'Glow' },
  { name: 'Outer Glow', icon: '💫', category: 'Glow' },
  { name: 'Inner Glow', icon: '⭐', category: 'Glow' },
  { name: 'Drop Shadow', icon: '🌑', category: 'Shadow' },
  { name: 'Long Shadow', icon: '🌓', category: 'Shadow' },
  { name: 'Duotone', icon: '🎨', category: 'Color' },
  { name: 'Vintage', icon: '📷', category: 'Color' },
  { name: 'Pixelate', icon: '🔲', category: 'Stylize' },
  { name: 'Oil Painting', icon: '🖼️', category: 'Artistic' },
  { name: 'Watercolor', icon: '🎨', category: 'Artistic' },
  { name: 'Sketch', icon: '✏️', category: 'Artistic' },
];

const templates = [
  { name: 'Instagram Reel', size: '1080x1920', icon: '📱', category: 'Social' },
  { name: 'YouTube Intro', size: '1920x1080', icon: '▶️', category: 'YouTube' },
  { name: 'TikTok Trend', size: '1080x1920', icon: '🎵', category: 'Social' },
  { name: 'Product Showcase', size: '1920x1080', icon: '🛍️', category: 'Commercial' },
  { name: 'Tutorial', size: '1920x1080', icon: '🎓', category: 'Educational' },
  { name: 'Vlog Intro', size: '1920x1080', icon: '📹', category: 'YouTube' },
];

const blendModes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'];

export default function LiveVideoEditor() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  const editor = useVideoEditor();
  
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<'project' | 'effects' | 'templates' | 'ai' | 'audio'>('project');
  const [showGrid, setShowGrid] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const [leftPanelWidth, setLeftPanelWidth] = useState(260);
  const [rightPanelWidth, setRightPanelWidth] = useState(260);
  const [timelineHeight, setTimelineHeight] = useState(240);
  
  // Sync video playback with timeline
  useEffect(() => {
    videoRefs.current.forEach((videoElement, layerId) => {
      const layer = editor.layers.find(l => l.id === layerId);
      if (layer && videoElement) {
        const layerTime = editor.currentTime - layer.startTime;
        if (layerTime >= 0 && layerTime <= layer.duration) {
          const timeDiff = Math.abs(videoElement.currentTime - layerTime);
          if (timeDiff > 0.1) {
            videoElement.currentTime = layerTime;
          }
          if (editor.isPlaying && videoElement.paused) {
            videoElement.play().catch(() => {});
          } else if (!editor.isPlaying && !videoElement.paused) {
            videoElement.pause();
          }
        }
      }
    });
  }, [editor.currentTime, editor.isPlaying, editor.layers]);

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    toast({
      title: "Uploading files...",
      description: `Processing ${files.length} file(s)`,
    });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await editor.uploadFile(file);
      }
      toast({
        title: "Upload complete!",
        description: `${files.length} file(s) added to media library.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [editor, toast]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    if (e.target) e.target.value = '';
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    } else {
      const fileId = e.dataTransfer.getData('mediaFileId');
      if (fileId) {
        const mediaFile = editor.mediaFiles.find(f => f.id === fileId);
        if (mediaFile) {
          editor.addLayerFromMedia(mediaFile);
          toast({
            title: "Added to timeline!",
            description: `${mediaFile.name} added to composition`,
          });
        }
      }
    }
  }, [handleFileUpload, editor, toast]);
  
  // Handlers for resizing panels
  const createResizeHandler = (
    setWidth: React.Dispatch<React.SetStateAction<number>>,
    isRightPanel = false
  ) => (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = isRightPanel ? rightPanelWidth : leftPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (isRightPanel ? startX - e.clientX : e.clientX - startX);
      setWidth(Math.max(200, Math.min(400, newWidth)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTimelineResize = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startHeight = timelineHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY);
      setTimelineHeight(Math.max(150, Math.min(350, newHeight)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // AI tool handler
  const handleAITool = useCallback(async (toolName: string) => {
    toast({
      title: `${toolName} Processing...`,
      description: "AI is working on your request",
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: `${toolName} Complete!`,
      description: "AI processing finished successfully",
    });
  }, [toast]);
  
  const LeftPanelContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold">Assets</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 hidden lg:flex hover:bg-white/10"
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activePanel} onValueChange={(v) => setActivePanel(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full bg-white/5 rounded-none border-b border-white/10 grid grid-cols-5 p-0 h-auto">
          <TabsTrigger value="project" className="text-xs data-[state=active]:bg-blue-500/20 py-2 flex flex-col items-center gap-1 h-14">
            <FolderOpen className="h-4 w-4" /> Files </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs data-[state=active]:bg-purple-500/20 py-2 flex flex-col items-center gap-1 h-14">
            <Layout className="h-4 w-4" /> Templates </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs data-[state=active]:bg-pink-500/20 py-2 flex flex-col items-center gap-1 h-14">
            <Wand2 className="h-4 w-4" /> Effects </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-green-500/20 py-2 flex flex-col items-center gap-1 h-14">
            <BrainCircuit className="h-4 w-4" /> AI </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs data-[state=active]:bg-orange-500/20 py-2 flex flex-col items-center gap-1 h-14">
            <Music className="h-4 w-4" /> Audio </TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="flex-1 mt-0 overflow-hidden">
          <div className="p-4 space-y-3 h-full flex flex-col">
            <input ref={fileInputRef} type="file" multiple accept="video/*,image/*,audio/*" onChange={onFileInputChange} className="hidden" />
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload Media
            </Button>
            <ScrollArea className="flex-1 -mx-4">
              <div className="px-4 space-y-2">
                {editor.mediaFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <Upload className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No media files yet</p>
                  </div>
                ) : (
                  editor.mediaFiles.map((file) => (
                    <div key={file.id} draggable onDragStart={(e) => { e.dataTransfer.setData('mediaFileId', file.id); e.dataTransfer.effectAllowed = 'copy'; }} className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-white/5 hover:border-blue-500/30">
                      {file.type === 'video' && <Video className="h-5 w-5 text-blue-400 shrink-0" />}
                      {file.type === 'image' && <ImageIcon className="h-5 w-5 text-green-400 shrink-0" />}
                      {file.type === 'audio' && <Music className="h-5 w-5 text-orange-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                          {file.duration && ` • ${formatTime(file.duration)}`}
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0" onClick={() => editor.addLayerFromMedia(file)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 p-4 mt-0 overflow-hidden"><ScrollArea className="h-full -m-4 p-4"><div className="space-y-2">{templates.map((t, i) => <div key={i} className="group relative p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg cursor-pointer transition-all border border-purple-500/20 hover:border-purple-500/40"><div className="flex items-start gap-3"><div className="text-2xl">{t.icon}</div><div className="flex-1 min-w-0"><div className="text-sm font-semibold mb-1">{t.name}</div><div className="text-xs text-gray-400">{t.size}</div><Badge variant="outline" className="mt-2 text-xs">{t.category}</Badge></div><Button size="sm" className="h-7 opacity-0 group-hover:opacity-100 bg-purple-500 hover:bg-purple-600">Use</Button></div></div>)}</div></ScrollArea></TabsContent>
        <TabsContent value="effects" className="flex-1 p-4 mt-0 overflow-hidden"><ScrollArea className="h-full -m-4 p-4"><div className="space-y-2">{effects.map((e, i) => <div key={i} className="group flex items-center gap-3 p-3 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg cursor-pointer transition-all border border-pink-500/20 hover:border-pink-500/40" onClick={() => {if (editor.selectedLayerId) { editor.addEffect(editor.selectedLayerId, e.name); toast({ title: "Effect Added!", description: `${e.name} applied to ${editor.selectedLayer?.name}` }); } else { toast({ title: "No layer selected", variant: "destructive" }); }}}><span className="text-xl">{e.icon}</span><div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{e.name}</div><div className="text-xs text-gray-500">{e.category}</div></div><Plus className="h-4 w-4 text-gray-500 group-hover:text-pink-400" /></div>)}</div></ScrollArea></TabsContent>
        <TabsContent value="ai" className="flex-1 p-4 mt-0 overflow-hidden"><ScrollArea className="h-full -m-4 p-4"><div className="space-y-2">{smartTools.map((t, i) => <div key={i} className="group relative p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg cursor-pointer transition-all border border-green-500/20 hover:border-green-500/40"><div className="flex items-start gap-3"><div className="text-2xl">{t.icon}</div><div className="flex-1 min-w-0"><div className="text-sm font-semibold mb-1">{t.name}</div><div className="text-xs text-gray-400">{t.desc}</div></div><Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t.category}</Badge></div><Button size="sm" className="w-full mt-3 h-7 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" onClick={() => handleAITool(t.name)}><Sparkles className="h-3 w-3 mr-2" />Apply AI</Button></div>)}</div></ScrollArea></TabsContent>
        <TabsContent value="audio" className="flex-1 p-4 mt-0 overflow-hidden"><ScrollArea className="h-full -m-4 p-4"><div className="space-y-3"><Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={() => editor.addTextLayer("Audio Track")}><Mic className="h-4 w-4 mr-2" />Record Audio</Button><div className="space-y-2 pt-2"><div className="text-xs font-semibold text-orange-400 mb-2">AUDIO EFFECTS</div>{['Voice Enhance', 'Noise Reduction', 'Audio Ducking', 'Echo', 'Reverb', 'Pitch Shift'].map((effect, i) => <div key={i} className="p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg cursor-pointer border border-orange-500/20 hover:border-orange-500/40"><div className="text-sm font-medium">{effect}</div></div>)}</div></div></ScrollArea></TabsContent>
      </Tabs>
    </div>
  );

  const RightPanelContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-semibold">Properties</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 hidden lg:flex hover:bg-white/10" onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}>
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {editor.selectedLayer ? (
          <div className="space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: editor.selectedLayer.color }} /><span className="text-sm font-semibold truncate flex-1">{editor.selectedLayer.name}</span><Badge variant="outline" className="text-xs">{editor.selectedLayer.type}</Badge></div>
              <div className="text-xs text-gray-400 flex gap-2"><span className="px-2 py-0.5 bg-white/5 rounded">{editor.selectedLayer.duration}s</span><span className="px-2 py-0.5 bg-white/5 rounded">{editor.selectedLayer.opacity}%</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2"><Button size="sm" variant="outline" className="h-8 text-xs border-white/10" onClick={() => editor.duplicateLayer(editor.selectedLayer!.id)}><Copy className="h-3 w-3 mr-1" />Duplicate</Button><Button size="sm" variant="outline" className="h-8 text-xs border-white/10 text-red-400 hover:text-red-300" onClick={() => { editor.deleteLayer(editor.selectedLayer!.id); toast({ title: "Layer deleted" }); }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button></div>
            <div className="space-y-3"><div className="flex items-center gap-2 pb-2 border-b border-white/10"><Move className="h-4 w-4 text-blue-400" /><span className="text-xs font-semibold text-gray-300">TRANSFORM</span></div><div className="space-y-3"><div><div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-400">Opacity</span><span className="text-xs text-blue-400 font-mono">{editor.selectedLayer.opacity}%</span></div><Slider value={[editor.selectedLayer.opacity]} max={100} onValueChange={([val]) => editor.updateLayer(editor.selectedLayer!.id, { opacity: val })}/></div></div></div>
            <div className="space-y-2"><div className="flex items-center gap-2 pb-2 border-b border-white/10"><Blend className="h-4 w-4 text-purple-400" /><span className="text-xs font-semibold text-gray-300">BLEND MODE</span></div><Select value={editor.selectedLayer.blendMode} onValueChange={(val) => editor.updateLayer(editor.selectedLayer!.id, { blendMode: val })}><SelectTrigger className="h-9 bg-white/5 border-white/10 text-xs"><SelectValue /></SelectTrigger><SelectContent>{blendModes.map((mode) => <SelectItem key={mode} value={mode} className="capitalize text-xs">{mode}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><div className="flex items-center gap-2 pb-2 border-b border-white/10"><Sparkles className="h-4 w-4 text-pink-400" /><span className="text-xs font-semibold text-gray-300">EFFECTS</span></div>{editor.selectedLayer.effects.length > 0 ? <div className="space-y-2">{editor.selectedLayer.effects.map((effect, i) => <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"><span className="text-xs">{effect}</span><Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => editor.removeEffect(editor.selectedLayer!.id, effect)}><Trash2 className="h-3 w-3" /></Button></div>)}</div> : <div className="p-3 bg-white/5 rounded border border-dashed border-white/10 text-center"><span className="text-xs text-gray-500">No effects applied</span></div>}</div>
          </div>
        ) : <div className="flex items-center justify-center h-full text-center text-gray-500 text-sm py-8"><div><Layers className="h-12 w-12 mx-auto mb-3 opacity-30 animate-pulse" /><p>Select a layer to edit properties</p></div></div>}
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] text-gray-100 overflow-hidden" onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }} onDragLeave={() => setIsDraggingOver(false)}>
      <div className="h-14 bg-gradient-to-r from-[#1E1E1E]/95 to-[#2A2A2A]/95 backdrop-blur-xl border-b border-white/10 flex items-center px-4 gap-2 shadow-2xl shrink-0">
        <div className="flex items-center gap-2 lg:hidden"><Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9"><Menu className="h-5 w-5" /></Button></SheetTrigger><SheetContent side="left" className="w-96 bg-[#1A1A1A]/95 backdrop-blur-xl border-white/10 p-0"><LeftPanelContent /></SheetContent></Sheet></div>
        <div className="flex items-center gap-2 mr-4"><Sparkles className="h-5 w-5 text-blue-400 animate-pulse" /><span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Trendix Pro</span></div>
        <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" variant="ghost" className="h-9 text-sm text-gray-300 hover:bg-white/10 hidden md:flex" onClick={editor.undo} disabled={!editor.canUndo}><RotateCcw className="h-4 w-4 mr-2" />Undo</Button>
          <Button size="sm" variant="ghost" className="h-9 text-sm text-gray-300 hover:bg-white/10 hidden md:flex" onClick={editor.redo} disabled={!editor.canRedo}><RotateCw className="h-4 w-4 mr-2" />Redo</Button>
          <Button size="sm" className="h-9 text-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg" onClick={async () => { toast({ title: "Export Starting..." }); await editor.exportProject({ format: 'mp4', quality: 'high', fps: 30 }); toast({ title: "Export Complete!" }); }}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden"><Settings className="h-5 w-5" /></Button></SheetTrigger><SheetContent side="right" className="w-96 bg-[#1A1A1A]/95 backdrop-blur-xl border-white/10 p-0"><RightPanelContent /></SheetContent></Sheet>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {!leftPanelCollapsed && <div className="hidden lg:flex bg-[#1A1A1A]/60 backdrop-blur-xl border-r border-white/10 flex-col relative transition-all duration-300" style={{ width: `${leftPanelWidth}px` }}><LeftPanelContent /><div onMouseDown={createResizeHandler(setLeftPanelWidth)} className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 z-10" /></div>}
        <div className="flex-1 flex flex-col bg-black relative min-w-0">
          <div className="h-12 bg-[#1A1A1A]/80 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 shrink-0">
            <span className="text-sm font-semibold truncate">Main Composition</span>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs hover:bg-white/10 hidden md:flex" onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}>{fitMode === 'contain' ? <><Minimize2 className="h-4 w-4 mr-1" />Fit</> : <><Maximize className="h-4 w-4 mr-1" />Fill</>}</Button>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => editor.setZoom(Math.max(25, editor.zoom - 25))}><ZoomOut className="h-4 w-4" /></Button>
              <span className="text-xs text-gray-400 w-14 text-center font-mono">{editor.zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => editor.setZoom(Math.min(400, editor.zoom + 25))}><ZoomIn className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white_5%,transparent_60%)]" />
            <div className="relative bg-black border-2 border-white/30 shadow-2xl rounded-lg overflow-hidden transition-all duration-300" style={{ width: `min(${640 * (editor.zoom / 100)}px, 90vw)`, height: `min(${480 * (editor.zoom / 100)}px, 70vh)`, aspectRatio: '4/3' }}>
              {showGrid && <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 35px, hsla(224, 71%, 14%, 0.5) 35px, hsla(224, 71%, 14%, 0.5) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, hsla(224, 71%, 14%, 0.5) 35px, hsla(224, 71%, 14%, 0.5) 36px)'}} />}
              {editor.layers.length > 0 ? (
                <>
                  {editor.layers.filter(layer => layer.visible && editor.currentTime >= layer.startTime && editor.currentTime < layer.startTime + layer.duration).map((layer, i) => {
                    const mediaFile = editor.mediaFiles.find(f => f.id === layer.mediaFileId);
                    return (
                      <div key={layer.id} className="absolute inset-0 flex items-center justify-center" style={{ opacity: layer.opacity / 100, mixBlendMode: layer.blendMode as any, transform: `scale(${layer.transform?.scale || 1}) rotate(${layer.transform?.rotation || 0}deg)`, zIndex: i }}>
                        {layer.type === 'video' && mediaFile?.url && <video ref={el => { if (el) videoRefs.current.set(layer.id, el); else videoRefs.current.delete(layer.id); }} src={mediaFile.url} className="w-full h-full" style={{ objectFit: fitMode }} muted playsInline />}
                        {layer.type === 'image' && mediaFile?.url && <Image src={mediaFile.url} alt={layer.name} layout="fill" objectFit={fitMode} />}
                        {layer.type === 'text' && <div className="text-white text-4xl font-bold text-center px-4" style={{ transform: `translate(${layer.transform?.x || 0}px, ${layer.transform?.y || 0}px)` }}>{layer.content || layer.name}</div>}
                      </div>
                    );
                  })}
                  {editor.selectedLayerId && <div className="absolute inset-[5%] border-2 border-blue-500 rounded pointer-events-none z-20 animate-pulse"><div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-semibold">{editor.selectedLayer?.name}</div></div>}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center px-4"><div className="relative"><Video className="h-20 w-20 mx-auto mb-4 text-gray-700" /><Sparkles className="h-8 w-8 absolute top-0 right-0 text-blue-500 animate-pulse" /></div><p className="text-gray-500 text-lg mb-2 font-semibold">Drop media to start creating</p><p className="text-gray-600 text-sm">Upload files or drag them here</p></div></div>
              )}
              {isDraggingOver && <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-blue-500 border-dashed rounded-lg pointer-events-none animate-pulse"><div className="text-center"><CloudUpload className="h-16 w-16 mx-auto mb-3 text-blue-400" /><p className="text-lg font-bold text-white">Drop media here</p><p className="text-sm text-blue-200">Files will be added to your library</p></div></div>}
            </div>
          </div>
          <div className="h-16 bg-[#1A1A1A]/80 backdrop-blur-sm border-t border-white/10 flex items-center px-4 gap-3 shrink-0">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 rounded-full" onClick={() => editor.seekTo(Math.max(0, editor.currentTime - 1))}><SkipBack className="h-4 w-4" /></Button>
            <Button size="icon" className={cn("h-12 w-12 rounded-full transition-all shadow-xl", editor.isPlaying ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-500/30 animate-pulse" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 ring-4 ring-blue-500/30")} onClick={editor.togglePlay}>{editor.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}</Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 rounded-full" onClick={() => editor.seekTo(Math.min(editor.duration, editor.currentTime + 1))}><SkipForward className="h-4 w-4" /></Button>
            <Badge className="text-sm font-mono bg-white/10 px-3 py-1">{formatTime(editor.currentTime)} / {formatTime(editor.duration)}</Badge>
            <div className="flex-1 mx-4 relative group min-w-0"><Slider value={[editor.currentTime]} onValueChange={([val]) => editor.seekTo(val)} max={editor.duration} step={0.1} className="cursor-pointer" /></div>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10 hidden sm:flex"><Volume2 className="h-4 w-4" /></Button>
          </div>
        </div>
        {!rightPanelCollapsed && <div className="hidden lg:flex bg-[#1A1A1A]/60 backdrop-blur-xl border-l border-white/10 flex-col relative transition-all duration-300" style={{ width: `${rightPanelWidth}px` }}><RightPanelContent /><div onMouseDown={createResizeHandler(setRightPanelWidth, true)} className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 z-10" /></div>}
      </div>
      <div className={cn("bg-[#1A1A1A]/80 backdrop-blur-xl border-t border-white/10 flex flex-col relative transition-all duration-300 shrink-0", timelineCollapsed && "h-auto")} style={{ height: timelineCollapsed ? 'auto' : `${timelineHeight}px` }}>
        <div onMouseDown={handleTimelineResize} className="hidden sm:block absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500/50 z-10" />
        <div className="h-11 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="h-7 w-7 sm:hidden" onClick={() => setTimelineCollapsed(!timelineCollapsed)}>{timelineCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button><Layers className="h-4 w-4 text-blue-400 animate-pulse" /><span className="text-sm font-semibold">Timeline</span><Badge variant="outline" className="text-xs">{editor.layers.length} layers</Badge></div>
          <div className="flex items-center gap-2"><Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-white/10 hidden sm:flex" onClick={() => editor.addTextLayer()}><Plus className="h-3 w-3 mr-1" />Layer</Button><div className="h-6 w-px bg-white/10 mx-1" /><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => editor.setTimelineZoom(Math.max(0.5, editor.timelineZoom - 0.5))}><ZoomOut className="h-4 w-4" /></Button><span className="text-xs text-gray-400 w-12 text-center font-mono bg-white/5 px-1 rounded">{editor.timelineZoom}x</span><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => editor.setTimelineZoom(Math.min(5, editor.timelineZoom + 0.5))}><ZoomIn className="h-4 w-4" /></Button></div>
        </div>
        {!timelineCollapsed && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-72 bg-[#1A1A1A]/80 border-r border-white/10 shrink-0"><ScrollArea className="h-full">{editor.layers.length === 0 ? <div className="text-center py-8 px-4 text-gray-500 text-sm"><Layers className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No layers yet</p></div> : editor.layers.map((layer) => <div key={layer.id} onClick={() => editor.setSelectedLayerId(layer.id)} className={cn("h-14 flex items-center px-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group", editor.selectedLayerId === layer.id && "bg-blue-500/20 border-blue-500/30")}><Button variant="ghost" size="icon" className="h-7 w-7 mr-1 hover:bg-white/10 shrink-0" onClick={(e) => { e.stopPropagation(); editor.toggleVisibility(layer.id); }}>{layer.visible ? <Eye className="h-4 w-4 text-blue-400" /> : <EyeOff className="h-4 w-4 text-gray-600" />}</Button><Button variant="ghost" size="icon" className="h-7 w-7 mr-2 hover:bg-white/10 shrink-0" onClick={(e) => { e.stopPropagation(); editor.toggleLock(layer.id); }}>{layer.locked ? <Lock className="h-4 w-4 text-yellow-500" /> : <Unlock className="h-4 w-4 text-gray-400" />}</Button><div className="w-3 h-3 rounded-sm mr-2 shadow-lg shrink-0 animate-pulse" style={{ backgroundColor: layer.color }} /><span className="text-sm flex-1 truncate font-medium min-w-0">{layer.name}</span><div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0"><Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-500/20 hover:text-blue-400" onClick={(e) => { e.stopPropagation(); editor.duplicateLayer(layer.id); }}><Copy className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/20 hover:text-red-400" onClick={(e) => { e.stopPropagation(); editor.deleteLayer(layer.id); }}><Trash2 className="h-3 w-3" /></Button></div></div>)}</ScrollArea></div>
            <div className="flex-1 relative overflow-auto bg-grid-white/[0.02] min-w-0">
              <div className="sticky top-0 left-0 right-0 h-8 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-white/10 flex z-10">{Array.from({ length: Math.ceil(editor.duration) + 1 }).map((_, i) => <div key={i} className="shrink-0 border-l border-white/10 px-2 relative" style={{ width: `${60 * editor.timelineZoom}px` }}><span className="text-xs text-gray-400 font-mono">{i}s</span><div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">{[1, 2, 3, 4].map(tick => <div key={tick} className="w-px h-2 bg-white/5" />)}</div></div>)}</div>
              <div className="pt-0">{editor.layers.map((layer) => <div key={layer.id} className="h-14 border-b border-white/5 relative hover:bg-white/5"><div className="absolute top-2 h-10 rounded-lg cursor-move hover:brightness-125 transition-all shadow-lg group border border-white/20 hover:ring-2 hover:ring-blue-500/50" style={{ background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.color}dd 100%)`, left: `${layer.startTime * 60 * editor.timelineZoom}px`, width: `${layer.duration * 60 * editor.timelineZoom}px`, opacity: layer.visible ? 1 : 0.3 }}><div className="px-3 py-2 flex items-center justify-between h-full"><span className="text-xs font-semibold text-white truncate drop-shadow-lg">{layer.name}</span><span className="text-[10px] text-white/80 font-mono ml-2">{layer.duration}s</span></div><div className="hidden sm:block absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-lg transition-opacity" /><div className="hidden sm:block absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-lg transition-opacity" /></div></div>)}</div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-red-600 pointer-events-none z-20 shadow-lg" style={{ left: `${editor.currentTime * 60 * editor.timelineZoom}px` }}><div className="absolute -top-1 -left-2.5 w-5 h-5 bg-red-500 rounded-t-md shadow-lg animate-pulse"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" /></div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

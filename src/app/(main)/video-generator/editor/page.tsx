'use client';

import { useRef, useCallback } from 'react';
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
import { useState, useEffect } from 'react';

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

const transitions = [
  { name: 'Fade', icon: '⚫', speed: 'fast' },
  { name: 'Cross Dissolve', icon: '⚪', speed: 'medium' },
  { name: 'Wipe', icon: '➡️', speed: 'fast' },
  { name: 'Slide', icon: '⬅️', speed: 'medium' },
  { name: 'Zoom', icon: '🔍', speed: 'medium' },
  { name: 'Rotate', icon: '🔄', speed: 'slow' },
  { name: 'Cube', icon: '🎲', speed: 'medium' },
  { name: 'Page Curl', icon: '📄', speed: 'slow' },
  { name: 'Ripple', icon: '🌊', speed: 'medium' },
  { name: 'Morph', icon: '🦋', speed: 'slow' },
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

const speedPresets = [
  { name: '0.25x', value: 0.25, label: 'Very Slow' },
  { name: '0.5x', value: 0.5, label: 'Slow' },
  { name: '1x', value: 1, label: 'Normal' },
  { name: '2x', value: 2, label: 'Fast' },
  { name: '4x', value: 4, label: 'Very Fast' },
  { name: 'Curve', value: 'curve', label: 'Speed Curve' },
];

export default function LiveVideoEditor() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  // Use the real-time video editor hook
  const editor = useVideoEditor();
  
  // UI states
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState('select');
  const [activePanel, setActivePanel] = useState<'project' | 'effects' | 'templates' | 'ai' | 'audio'>('project');
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Resizing
  const [leftPanelWidth, setLeftPanelWidth] = useState(260);
  const [rightPanelWidth, setRightPanelWidth] = useState(260);
  const [timelineHeight, setTimelineHeight] = useState(240);
  
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  const timelineResizeRef = useRef<HTMLDivElement>(null);

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
        const mediaFile = await editor.uploadFile(file);
        
        toast({
          title: "File uploaded!",
          description: `${mediaFile.name} (${formatFileSize(mediaFile.size)})`,
        });
      }
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

  // Handle file input change
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    if (e.target) e.target.value = '';
  };

  // Handle drag & drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  // Resize handlers
  const handleLeftResize = (e: React.MouseEvent) => {
    if (leftPanelCollapsed) return;
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      setLeftPanelWidth(Math.max(200, Math.min(400, newWidth)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightResize = (e: React.MouseEvent) => {
    if (rightPanelCollapsed) return;
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth - (e.clientX - startX);
      setRightPanelWidth(Math.max(200, Math.min(400, newWidth)));
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
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: `${toolName} Complete!`,
      description: "AI processing finished successfully",
    });
  }, [toast]);

  // Left Panel Content
  const LeftPanelContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-10 sm:h-12 bg-white/5 border-b border-white/10 flex items-center px-3 sm:px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          <span className="text-xs sm:text-sm font-semibold">Assets</span>
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
        <TabsList className="w-full bg-white/5 rounded-none border-b border-white/10 grid grid-cols-5 p-0">
          <TabsTrigger value="project" className="text-[10px] sm:text-xs data-[state=active]:bg-blue-500/20 py-2">
            <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
            Files
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-[10px] sm:text-xs data-[state=active]:bg-purple-500/20 py-2">
            <Layout className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-[10px] sm:text-xs data-[state=active]:bg-pink-500/20 py-2">
            <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-[10px] sm:text-xs data-[state=active]:bg-green-500/20 py-2">
            <BrainCircuit className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
            AI
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-[10px] sm:text-xs data-[state=active]:bg-orange-500/20 py-2">
            <Music className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
            Audio
          </TabsTrigger>
        </TabsList>

        {/* Project Tab */}
        <TabsContent value="project" className="flex-1 p-3 sm:p-4 mt-0 overflow-hidden">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input 
                placeholder="Search files..." 
                className="h-8 sm:h-9 pl-7 sm:pl-9 bg-white/5 border-white/10 text-xs sm:text-sm"
              />
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*,image/*,audio/*"
                  onChange={onFileInputChange}
                  className="hidden"
                />
                
                <Button 
                  className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xs sm:text-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Media
                    </>
                  )}
                </Button>

                {/* Display uploaded media files */}
                {editor.mediaFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <Upload className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No media files yet</p>
                    <p className="text-xs mt-1">Upload files to get started</p>
                  </div>
                ) : (
                  editor.mediaFiles.map((file) => (
                    <div 
                      key={file.id} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('mediaFileId', file.id);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-white/5 hover:border-blue-500/30"
                    >
                      {file.type === 'video' && <Video className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />}
                      {file.type === 'image' && <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />}
                      {file.type === 'audio' && <Music className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">{file.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          {formatFileSize(file.size)}
                          {file.duration && ` • ${formatTime(file.duration)}`}
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0"
                        onClick={() => editor.addLayerFromMedia(file)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 p-3 sm:p-4 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {templates.map((template, i) => (
                <div key={i} className="group relative p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-lg cursor-pointer transition-all border border-purple-500/20 hover:border-purple-500/40">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold mb-1">{template.name}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{template.size}</div>
                      <Badge variant="outline" className="mt-2 text-[10px]">{template.category}</Badge>
                    </div>
                    <Button size="sm" className="h-7 opacity-0 group-hover:opacity-100 bg-purple-500 hover:bg-purple-600">
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="flex-1 p-3 sm:p-4 mt-0 overflow-hidden">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input 
                placeholder="Search effects..." 
                className="h-8 sm:h-9 pl-7 sm:pl-9 bg-white/5 border-white/10 text-xs sm:text-sm"
              />
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-2">
                {effects.map((effect, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-white/5 to-white/0 hover:from-pink-500/20 hover:to-purple-500/20 rounded-lg cursor-pointer transition-all border border-white/5 hover:border-pink-500/30"
                    onClick={() => {
                      if (editor.selectedLayerId) {
                        editor.addEffect(editor.selectedLayerId, effect.name);
                        toast({
                          title: "Effect Added!",
                          description: `${effect.name} applied to ${editor.selectedLayer?.name}`,
                        });
                      } else {
                        toast({
                          title: "No layer selected",
                          description: "Please select a layer first",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <span className="text-base sm:text-xl">{effect.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium truncate">{effect.name}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">{effect.category}</div>
                    </div>
                    <Plus className="h-4 w-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="ai" className="flex-1 p-3 sm:p-4 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              <div className="text-[10px] sm:text-xs font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI-POWERED TOOLS
              </div>
              {smartTools.map((tool, i) => (
                <div 
                  key={i} 
                  className="group relative p-3 bg-gradient-to-br from-green-500/10 to-blue-500/10 hover:from-green-500/20 hover:to-blue-500/20 rounded-lg cursor-pointer transition-all border border-green-500/20 hover:border-green-500/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl sm:text-2xl">{tool.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold mb-1">{tool.name}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{tool.desc}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 text-[10px] border-green-500/30">
                      {tool.category}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 h-7 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-xs"
                    onClick={() => handleAITool(tool.name)}
                  >
                    <Sparkles className="h-3 w-3 mr-2" />
                    Apply AI
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="flex-1 p-3 sm:p-4 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={() => editor.addTextLayer("Audio Track")}
              >
                <Mic className="h-4 w-4 mr-2" />
                Record Audio
              </Button>

              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-orange-400 mb-2">AUDIO EFFECTS</div>
                {['Voice Enhance', 'Noise Reduction', 'Audio Ducking', 'Echo', 'Reverb', 'Pitch Shift'].map((effect, i) => (
                  <div key={i} className="p-2 sm:p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg cursor-pointer border border-orange-500/20 hover:border-orange-500/40 transition-all">
                    <div className="text-xs sm:text-sm font-medium">{effect}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Right Panel Content
  const RightPanelContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-10 sm:h-12 bg-white/5 border-b border-white/10 flex items-center px-3 sm:px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          <span className="text-xs sm:text-sm font-semibold">Properties</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 hidden lg:flex hover:bg-white/10"
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        {editor.selectedLayer ? (
          <div className="space-y-4">
            {/* Layer Info */}
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse" style={{ backgroundColor: editor.selectedLayer.color }} />
                <span className="text-xs sm:text-sm font-semibold truncate flex-1">{editor.selectedLayer.name}</span>
                <Badge variant="outline" className="text-[10px]">{editor.selectedLayer.type}</Badge>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 flex gap-2">
                <span className="px-2 py-0.5 bg-white/5 rounded">{editor.selectedLayer.duration}s</span>
                <span className="px-2 py-0.5 bg-white/5 rounded">{editor.selectedLayer.opacity}%</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs border-white/10"
                onClick={() => editor.duplicateLayer(editor.selectedLayer!.id)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Duplicate
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs border-white/10 text-red-400 hover:text-red-300"
                onClick={() => {
                  editor.deleteLayer(editor.selectedLayer!.id);
                  toast({
                    title: "Layer deleted",
                    description: `${editor.selectedLayer!.name} has been removed`,
                  });
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            {/* Transform */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Move className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-300">TRANSFORM</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs text-gray-400">Opacity</span>
                    <span className="text-[10px] sm:text-xs text-blue-400 font-mono">{editor.selectedLayer.opacity}%</span>
                  </div>
                  <Slider 
                    value={[editor.selectedLayer.opacity]} 
                    max={100}
                    onValueChange={([val]) => editor.updateLayer(editor.selectedLayer!.id, { opacity: val })}
                  />
                </div>
              </div>
            </div>

            {/* Blend Mode */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Blend className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-300">BLEND MODE</span>
              </div>
              <Select 
                value={editor.selectedLayer.blendMode} 
                onValueChange={(val) => editor.updateLayer(editor.selectedLayer!.id, { blendMode: val })}
              >
                <SelectTrigger className="h-8 sm:h-9 bg-white/5 border-white/10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {blendModes.map((mode) => (
                    <SelectItem key={mode} value={mode} className="capitalize text-xs">
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effects */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-300">EFFECTS</span>
              </div>
              {editor.selectedLayer.effects.length > 0 ? (
                <div className="space-y-2">
                  {editor.selectedLayer.effects.map((effect, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                      <span className="text-xs">{effect}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        onClick={() => editor.removeEffect(editor.selectedLayer!.id, effect)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 sm:p-3 bg-white/5 rounded border border-dashed border-white/10 text-center">
                  <span className="text-[10px] sm:text-xs text-gray-500">No effects applied</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500 text-xs sm:text-sm py-8">
            <div>
              <Layers className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-30 animate-pulse" />
              <p>Select a layer to edit properties</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] text-gray-100 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Modern Top Bar */}
      <div className="h-12 sm:h-14 bg-gradient-to-r from-[#1E1E1E]/95 to-[#2A2A2A]/95 backdrop-blur-xl border-b border-white/10 flex items-center px-2 sm:px-4 gap-1 sm:gap-2 shadow-2xl flex-shrink-0">
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96 bg-[#1A1A1A]/95 backdrop-blur-xl border-white/10 p-0">
              <LeftPanelContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <div className="hidden sm:flex items-center gap-2 mr-2 sm:mr-4">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
            <span className="font-bold text-sm sm:text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
              Trendix Pro
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden xl:flex items-center gap-2 mr-2 px-2 sm:px-3 py-1 bg-white/5 rounded-lg border border-white/10">
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
            <Label className="text-[10px] sm:text-xs cursor-pointer whitespace-nowrap">Grid</Label>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 sm:h-9 text-xs sm:text-sm text-gray-300 hover:bg-white/10 hidden md:flex px-2 sm:px-3"
            onClick={() => editor.undo()}
            disabled={!editor.canUndo}
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 sm:h-9 text-xs sm:text-sm text-gray-300 hover:bg-white/10 hidden md:flex px-2 sm:px-3"
            onClick={() => editor.redo()}
            disabled={!editor.canRedo}
          >
            <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Redo</span>
          </Button>
          <Button 
            size="sm" 
            className="h-7 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg px-2 sm:px-3"
            onClick={async () => {
              toast({
                title: "Export Starting...",
                description: "Your video is being processed",
              });
              await editor.exportProject({ format: 'mp4', quality: 'high', fps: 30 });
              toast({
                title: "Export Complete!",
                description: "Your video is ready to download",
              });
            }}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          {/* Mobile Properties */}
          <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:hidden">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 bg-[#1A1A1A]/95 backdrop-blur-xl border-white/10 p-0">
              <RightPanelContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Collapsible */}
        {!leftPanelCollapsed ? (
          <div 
            className="hidden lg:flex bg-[#1A1A1A]/60 backdrop-blur-xl border-r border-white/10 flex-col relative transition-all duration-300"
            style={{ width: `${leftPanelWidth}px` }}
          >
            <LeftPanelContent />
            <div
              ref={leftResizeRef}
              onMouseDown={handleLeftResize}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-10"
            />
          </div>
        ) : (
          <div className="hidden lg:flex w-12 bg-[#1A1A1A]/60 backdrop-blur-xl border-r border-white/10 flex-col items-center py-4 gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/10"
              onClick={() => setLeftPanelCollapsed(false)}
            >
              <PanelLeftClose className="h-5 w-5 rotate-180" />
            </Button>
            <div className="h-px w-full bg-white/10" />
            {[FolderOpen, Layout, Wand2, BrainCircuit, Music].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10">
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        )}

        {/* Center - Composition Preview */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] relative min-w-0">
          {/* Preview Header */}
          <div className="h-10 sm:h-12 bg-[#1A1A1A]/80 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-2 sm:px-4 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-xs sm:text-sm font-semibold truncate">Main Composition</span>
              <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-xs text-gray-400">
                <Badge variant="outline" className="text-[10px]">720x540</Badge>
                <Badge variant="outline" className="text-[10px]">30fps</Badge>
                <Badge variant="outline" className="text-[10px]">{formatTime(editor.duration)}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs hover:bg-white/10 hidden md:flex"
                onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
              >
                {fitMode === 'contain' ? (
                  <>
                    <Minimize2 className="h-3 w-3 mr-1" />
                    Fit
                  </>
                ) : (
                  <>
                    <Maximize className="h-3 w-3 mr-1" />
                    Fill
                  </>
                )}
              </Button>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white/10" onClick={() => editor.setZoom(Math.max(25, editor.zoom - 25))}>
                <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-[10px] sm:text-xs text-gray-400 w-10 sm:w-14 text-center font-mono">{editor.zoom}%</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white/10" onClick={() => editor.setZoom(Math.min(400, editor.zoom + 25))}>
                <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-3 md:p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0 animate-pulse" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div 
              className="relative bg-black backdrop-blur-sm border-2 border-white/30 shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
              style={{ 
                width: `min(${720 * (editor.zoom / 100)}px, 90vw)`,
                height: `min(${540 * (editor.zoom / 100)}px, 75vh)`,
                aspectRatio: '4/3'
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
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
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
              }}
            >
              {showGrid && (
                <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(59,130,246,.2) 35px, rgba(59,130,246,.2) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(59,130,246,.2) 35px, rgba(59,130,246,.2) 36px)'
                }} />
              )}
              
              {/* Render actual layers */}
              {editor.layers.length > 0 ? (
                <>
                  {editor.layers
                    .filter(layer => layer.visible && editor.currentTime >= layer.startTime && editor.currentTime < layer.startTime + layer.duration)
                    .map((layer) => {
                      const mediaFile = editor.mediaFiles.find(f => f.id === layer.mediaFileId);
                      return (
                        <div
                          key={layer.id}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            opacity: layer.opacity / 100,
                            mixBlendMode: layer.blendMode as any,
                            transform: `scale(${layer.transform?.scale || 1}) rotate(${layer.transform?.rotation || 0}deg)`,
                            zIndex: editor.layers.indexOf(layer),
                          }}
                        >
                          {layer.type === 'video' && mediaFile?.url && (
                            <video
                              ref={(el) => {
                                if (el) {
                                  videoRefs.current.set(layer.id, el);
                                } else {
                                  videoRefs.current.delete(layer.id);
                                }
                              }}
                              src={mediaFile.url}
                              className="w-full h-full"
                              style={{
                                objectFit: fitMode,
                                transform: `translate(${layer.transform?.x || 0}px, ${layer.transform?.y || 0}px)`,
                              }}
                              muted
                              playsInline
                            />
                          )}
                          {layer.type === 'image' && mediaFile?.url && (
                            <img
                              src={mediaFile.url}
                              alt={layer.name}
                              className="w-full h-full"
                              style={{
                                objectFit: fitMode,
                                transform: `translate(${layer.transform?.x || 0}px, ${layer.transform?.y || 0}px)`,
                              }}
                            />
                          )}
                          {layer.type === 'text' && (
                            <div
                              className="text-white text-4xl font-bold text-center px-4"
                              style={{
                                transform: `translate(${layer.transform?.x || 0}px, ${layer.transform?.y || 0}px)`,
                              }}
                            >
                              {layer.content || layer.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  
                  {/* Selection indicator */}
                  {editor.selectedLayerId && (
                    <div className="absolute inset-[5%] border-2 border-blue-500 rounded pointer-events-none z-20 animate-pulse">
                      <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {editor.selectedLayer?.name}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="relative">
                      <Video className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-4 text-gray-700" />
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 absolute top-0 right-0 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-lg mb-2 font-semibold">Drop media to start creating</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Upload files or drag them here</p>
                  </div>
                </div>
              )}

              {/* Safe zone guides */}
              {showRulers && editor.layers.length > 0 && (
                <>
                  <div className="absolute inset-[5%] border-2 border-dashed border-blue-500/30 rounded pointer-events-none z-10" />
                  <div className="absolute inset-[10%] border-2 border-dashed border-green-500/30 rounded pointer-events-none z-10" />
                </>
              )}

              {/* Center crosshair */}
              {showRulers && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 pointer-events-none z-10">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/50" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-500/50" />
                </div>
              )}

              {/* Drag overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-blue-500 border-dashed rounded-lg pointer-events-none animate-pulse">
                  <div className="text-center">
                    <CloudUpload className="h-16 w-16 mx-auto mb-3 text-blue-400" />
                    <p className="text-lg font-bold text-white">Drop to add to composition</p>
                    <p className="text-sm text-blue-200">Video will be added to timeline</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Playback Controls */}
          <div className="h-14 sm:h-16 bg-[#1A1A1A]/80 backdrop-blur-sm border-t border-white/10 flex items-center px-2 sm:px-4 gap-2 sm:gap-3 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/10 rounded-full" onClick={() => editor.seekTo(Math.max(0, editor.currentTime - 1))}>
              <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              size="icon" 
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all shadow-xl",
                editor.isPlaying 
                  ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-500/30 animate-pulse" 
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 ring-4 ring-blue-500/30"
              )}
              onClick={editor.togglePlay}
            >
              {editor.isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/10 rounded-full" onClick={() => editor.seekTo(Math.min(editor.duration, editor.currentTime + 1))}>
              <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/10 rounded-full" onClick={() => editor.seekTo(0)}>
              <Square className="h-3 w-3" />
            </Button>

            <div className="flex-1 mx-2 sm:mx-4 relative group min-w-0">
              <Slider
                value={[editor.currentTime]}
                onValueChange={([val]) => editor.seekTo(val)}
                max={editor.duration}
                step={0.1}
                className="cursor-pointer [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-500 [&_[role=slider]]:to-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:ring-4 [&_[role=slider]]:ring-blue-500/30"
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
                {formatTime(editor.currentTime)}
              </div>
            </div>

            <Badge className="text-[10px] sm:text-sm font-mono bg-white/10 px-3 py-1 whitespace-nowrap">
              {formatTime(editor.currentTime)} / {formatTime(editor.duration)}
            </Badge>

            <div className="h-8 w-px bg-white/10 mx-1 sm:mx-2 hidden sm:block" />

            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/10 hidden sm:flex">
              <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Collapsible */}
        {!rightPanelCollapsed ? (
          <div 
            className="hidden lg:flex bg-[#1A1A1A]/60 backdrop-blur-xl border-l border-white/10 flex-col relative transition-all duration-300"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <RightPanelContent />
            <div
              ref={rightResizeRef}
              onMouseDown={handleRightResize}
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-10"
            />
          </div>
        ) : (
          <div className="hidden lg:flex w-12 bg-[#1A1A1A]/60 backdrop-blur-xl border-l border-white/10 flex-col items-center py-4 gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/10"
              onClick={() => setRightPanelCollapsed(false)}
            >
              <PanelRightClose className="h-5 w-5 rotate-180" />
            </Button>
            <div className="h-px w-full bg-white/10" />
            {[Sliders, Move, Gauge, Blend, Sparkles].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10">
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Timeline */}
      <div 
        className={cn(
          "bg-[#1A1A1A]/80 backdrop-blur-xl border-t border-white/10 flex flex-col relative transition-all duration-300 flex-shrink-0",
          timelineCollapsed && "h-auto"
        )}
        style={{ height: timelineCollapsed ? 'auto' : `${timelineHeight}px` }}
      >
        <div
          ref={timelineResizeRef}
          onMouseDown={handleTimelineResize}
          className="hidden sm:block absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500/50 transition-colors z-10"
        />

        {/* Timeline Header */}
        <div className="h-10 sm:h-11 bg-white/5 border-b border-white/10 flex items-center px-2 sm:px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:hidden"
              onClick={() => setTimelineCollapsed(!timelineCollapsed)}
            >
              {timelineCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold">Timeline</span>
            <Badge variant="outline" className="text-[10px] sm:text-xs">{editor.layers.length} layers</Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 sm:h-7 text-[10px] sm:text-xs hover:bg-white/10 hidden sm:flex px-2"
              onClick={() => editor.addTextLayer()}
            >
              <Plus className="h-3 w-3 mr-1" />
              Layer
            </Button>
            <div className="h-5 sm:h-6 w-px bg-white/10 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white/10" onClick={() => editor.setTimelineZoom(Math.max(0.5, editor.timelineZoom - 0.5))}>
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-[10px] sm:text-xs text-gray-400 w-8 sm:w-12 text-center font-mono bg-white/5 px-1 rounded">{editor.timelineZoom}x</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-white/10" onClick={() => editor.setTimelineZoom(Math.min(5, editor.timelineZoom + 0.5))}>
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Timeline Content */}
        {!timelineCollapsed && (
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Layer Names */}
            <div className="w-32 sm:w-48 md:w-64 lg:w-72 bg-[#1A1A1A]/80 border-r border-white/10 flex-shrink-0">
              <ScrollArea className="h-full">
                {editor.layers.length === 0 ? (
                  <div className="text-center py-8 px-4 text-gray-500 text-sm">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No layers yet</p>
                    <p className="text-xs mt-1">Upload media to get started</p>
                  </div>
                ) : (
                  editor.layers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => editor.setSelectedLayerId(layer.id)}
                      className={cn(
                        "h-12 sm:h-14 flex items-center px-2 sm:px-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group",
                        editor.selectedLayerId === layer.id && "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-blue-500/30"
                      )}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 mr-1 hover:bg-white/10 flex-shrink-0 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          editor.toggleVisibility(layer.id);
                        }}
                      >
                        {layer.visible ? (
                          <Eye className="h-3 w-3 text-blue-400" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-gray-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 mr-1 sm:mr-2 hover:bg-white/10 flex-shrink-0 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          editor.toggleLock(layer.id);
                        }}
                      >
                        {layer.locked ? (
                          <Lock className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <Unlock className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm mr-1 sm:mr-2 shadow-lg flex-shrink-0 animate-pulse" 
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-xs sm:text-sm flex-1 truncate font-medium min-w-0">{layer.name}</span>
                      
                      <div className="opacity-0 group-hover:opacity-100 hidden sm:flex items-center gap-1 transition-opacity flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-blue-500/20 hover:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            editor.duplicateLayer(layer.id);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-red-500/20 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            editor.deleteLayer(layer.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 relative overflow-auto bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] min-w-0">
              {/* Time Ruler */}
              <div className="sticky top-0 left-0 right-0 h-7 sm:h-8 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-white/10 flex z-10">
                {Array.from({ length: Math.ceil(editor.duration) + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 border-l border-white/10 px-1 sm:px-2 relative"
                    style={{ width: `${60 * editor.timelineZoom}px` }}
                  >
                    <span className="text-[10px] text-gray-400 font-mono">{i}s</span>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 sm:px-2">
                      {[1, 2, 3, 4].map((tick) => (
                        <div key={tick} className="w-px h-1 sm:h-2 bg-white/5" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Layers */}
              <div className="pt-0">
                {editor.layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={cn(
                      "h-12 sm:h-14 border-b border-white/5 relative hover:bg-white/5 transition-colors",
                      editor.selectedLayerId === layer.id && "bg-blue-500/5"
                    )}
                  >
                    <div
                      className="absolute top-2 h-8 sm:h-10 rounded-lg cursor-move hover:brightness-125 transition-all shadow-lg group border border-white/20 hover:ring-2 hover:ring-blue-500/50"
                      style={{
                        background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.color}dd 100%)`,
                        left: `${layer.startTime * 60 * editor.timelineZoom}px`,
                        width: `${layer.duration * 60 * editor.timelineZoom}px`,
                        opacity: layer.visible ? 1 : 0.3
                      }}
                    >
                      <div className="px-2 sm:px-3 py-1 sm:py-2 flex items-center justify-between h-full">
                        <span className="text-[10px] sm:text-xs font-semibold text-white truncate drop-shadow-lg">
                          {layer.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-white/80 font-mono ml-2">{layer.duration}s</span>
                      </div>
                      
                      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-lg transition-opacity" />
                      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-lg transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-red-600 pointer-events-none z-20 shadow-lg"
                style={{ left: `${editor.currentTime * 60 * editor.timelineZoom}px` }}
              >
                <div className="absolute -top-1 -left-2 sm:-left-2.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-t-md shadow-lg animate-pulse">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                </div>
              </div>

              {/* Snap guidelines */}
              {editor.snapEnabled && (
                <div className="absolute inset-0 pointer-events-none opacity-5">
                  {Array.from({ length: Math.ceil(editor.duration) + 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-blue-400"
                      style={{ left: `${i * 60 * editor.timelineZoom}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

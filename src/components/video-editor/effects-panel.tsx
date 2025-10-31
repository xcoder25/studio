'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Wand2,
  Filter,
  Palette,
  Sparkles,
  Zap,
  Wind,
  Droplets,
  Sun,
  Moon,
  Camera,
  Film,
  Image as ImageIcon,
  Layers,
  Blend BlendMode,
  Move3d,
} from 'lucide-react';

interface Effect {
  id: string;
  name: string;
  category: 'transition' | 'filter' | 'color' | 'ai' | 'motion' | 'text';
  icon: React.ReactNode;
  isPro?: boolean;
  preview?: string;
}

const EFFECTS: Effect[] = [
  // Transitions
  { id: 'fade', name: 'Fade', category: 'transition', icon: <Zap className="h-4 w-4" /> },
  { id: 'dissolve', name: 'Cross Dissolve', category: 'transition', icon: <Wind className="h-4 w-4" /> },
  { id: 'wipe', name: 'Wipe', category: 'transition', icon: <Move3d className="h-4 w-4" /> },
  { id: 'zoom', name: 'Zoom', category: 'transition', icon: <Camera className="h-4 w-4" /> },
  { id: 'slide', name: 'Slide', category: 'transition', icon: <Layers className="h-4 w-4" /> },
  { id: 'glitch', name: 'Glitch', category: 'transition', icon: <Sparkles className="h-4 w-4" />, isPro: true },
  
  // Filters
  { id: 'blur', name: 'Blur', category: 'filter', icon: <Droplets className="h-4 w-4" /> },
  { id: 'sharpen', name: 'Sharpen', category: 'filter', icon: <Zap className="h-4 w-4" /> },
  { id: 'vignette', name: 'Vignette', category: 'filter', icon: <Sun className="h-4 w-4" /> },
  { id: 'grain', name: 'Film Grain', category: 'filter', icon: <Film className="h-4 w-4" /> },
  { id: 'noise', name: 'Noise', category: 'filter', icon: <Filter className="h-4 w-4" /> },
  { id: 'glow', name: 'Glow', category: 'filter', icon: <Sparkles className="h-4 w-4" />, isPro: true },
  
  // Color Grading
  { id: 'cinematic', name: 'Cinematic', category: 'color', icon: <Palette className="h-4 w-4" /> },
  { id: 'vintage', name: 'Vintage', category: 'color', icon: <Film className="h-4 w-4" /> },
  { id: 'bw', name: 'Black & White', category: 'color', icon: <Moon className="h-4 w-4" /> },
  { id: 'sepia', name: 'Sepia', category: 'color', icon: <Sun className="h-4 w-4" /> },
  { id: 'cyberpunk', name: 'Cyberpunk', category: 'color', icon: <Sparkles className="h-4 w-4" />, isPro: true },
  { id: 'lut_teal_orange', name: 'Teal & Orange', category: 'color', icon: <Palette className="h-4 w-4" />, isPro: true },
  
  // AI Effects
  { id: 'ai_upscale', name: 'AI Upscale', category: 'ai', icon: <Sparkles className="h-4 w-4" />, isPro: true },
  { id: 'ai_denoise', name: 'AI Denoise', category: 'ai', icon: <Wand2 className="h-4 w-4" />, isPro: true },
  { id: 'ai_stabilize', name: 'Stabilize', category: 'ai', icon: <Camera className="h-4 w-4" />, isPro: true },
  { id: 'ai_bg_remove', name: 'Remove Background', category: 'ai', icon: <Layers className="h-4 w-4" />, isPro: true },
  { id: 'ai_enhance', name: 'Auto Enhance', category: 'ai', icon: <Sparkles className="h-4 w-4" />, isPro: true },
  
  // Motion Effects
  { id: 'zoom_in', name: 'Zoom In', category: 'motion', icon: <Camera className="h-4 w-4" /> },
  { id: 'zoom_out', name: 'Zoom Out', category: 'motion', icon: <Camera className="h-4 w-4" /> },
  { id: 'pan', name: 'Pan', category: 'motion', icon: <Move3d className="h-4 w-4" /> },
  { id: 'rotate', name: 'Rotate', category: 'motion', icon: <Wind className="h-4 w-4" /> },
  { id: 'shake', name: 'Camera Shake', category: 'motion', icon: <Zap className="h-4 w-4" />, isPro: true },
];

export function EffectsPanel() {
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEffects = EFFECTS.filter(effect =>
    effect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const effectsByCategory = {
    transition: filteredEffects.filter(e => e.category === 'transition'),
    filter: filteredEffects.filter(e => e.category === 'filter'),
    color: filteredEffects.filter(e => e.category === 'color'),
    ai: filteredEffects.filter(e => e.category === 'ai'),
    motion: filteredEffects.filter(e => e.category === 'motion'),
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Effects & Filters
        </CardTitle>
        <Input
          placeholder="Search effects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="transition" className="text-xs">Transitions</TabsTrigger>
            <TabsTrigger value="filter" className="text-xs">Filters</TabsTrigger>
            <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
            <TabsTrigger value="motion" className="text-xs">Motion</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 grid grid-cols-2 gap-2">
                {filteredEffects.map((effect) => (
                  <EffectCard
                    key={effect.id}
                    effect={effect}
                    selected={selectedEffect?.id === effect.id}
                    onClick={() => setSelectedEffect(effect)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {Object.entries(effectsByCategory).map(([category, effects]) => (
            <TabsContent key={category} value={category} className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {effects.map((effect) => (
                    <EffectCard
                      key={effect.id}
                      effect={effect}
                      selected={selectedEffect?.id === effect.id}
                      onClick={() => setSelectedEffect(effect)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {selectedEffect && (
        <div className="border-t p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{selectedEffect.name}</h3>
            {selectedEffect.isPro && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Pro
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Intensity</Label>
              <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
            </div>
            
            <div>
              <Label className="text-xs">Duration (s)</Label>
              <Input type="number" defaultValue="1.0" step="0.1" className="mt-1" />
            </div>

            <Button className="w-full" size="sm">
              Apply Effect
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function EffectCard({ 
  effect, 
  selected, 
  onClick 
}: { 
  effect: Effect; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className={`h-auto p-3 flex-col gap-2 ${selected ? 'border-primary bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        {effect.icon}
        {effect.isPro && (
          <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4">
            PRO
          </Badge>
        )}
      </div>
      <span className="text-xs font-medium text-center w-full">{effect.name}</span>
    </Button>
  );
}


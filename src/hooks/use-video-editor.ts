import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  generateId, 
  formatTime, 
  formatFileSize,
  generateVideoThumbnail,
  getVideoDuration,
  getImageDimensions,
  getAudioDuration,
  snapToGrid,
  applyTransform,
  interpolateKeyframes,
  MediaFile
} from '@/lib/video-editor-utils';

export interface Layer {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text' | 'shape' | 'audio' | 'sticker' | 'overlay';
  visible: boolean;
  locked: boolean;
  duration: number;
  startTime: number;
  color: string;
  opacity: number;
  blendMode: string;
  effects: string[];
  keyframes: any[];
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  mediaFileId?: string;
  content?: string; // for text layers
  mask?: string;
  tracking?: boolean;
  speed: number;
}

export const useVideoEditor = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setCurrentTime(prev => {
          const newTime = prev + delta;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  // Upload media file
  const uploadFile = useCallback(async (file: File): Promise<MediaFile> => {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' 
                : file.type.startsWith('image/') ? 'image'
                : file.type.startsWith('audio/') ? 'audio'
                : 'video';

    let mediaFile: MediaFile = {
      id: generateId(),
      name: file.name,
      type,
      url,
      size: file.size,
    };

    if (type === 'video') {
      const [duration, thumbnail] = await Promise.all([
        getVideoDuration(file),
        generateVideoThumbnail(file)
      ]);
      mediaFile.duration = duration;
      mediaFile.thumbnail = thumbnail;
    } else if (type === 'image') {
      const { width, height } = await getImageDimensions(file);
      mediaFile.width = width;
      mediaFile.height = height;
    } else if (type === 'audio') {
      mediaFile.duration = await getAudioDuration(file);
    }

    setMediaFiles(prev => [...prev, mediaFile]);
    return mediaFile;
  }, []);

  // Add layer from media file
  const addLayerFromMedia = useCallback((mediaFile: MediaFile, startTime: number = currentTime) => {
    const newLayer: Layer = {
      id: generateId(),
      name: mediaFile.name,
      type: mediaFile.type,
      visible: true,
      locked: false,
      duration: mediaFile.duration || 5,
      startTime: snapToGrid(startTime, 1, snapEnabled),
      color: mediaFile.type === 'video' ? '#3B82F6' 
            : mediaFile.type === 'image' ? '#10B981'
            : '#F59E0B',
      opacity: 100,
      blendMode: 'normal',
      effects: [],
      keyframes: [],
      transform: { x: 0, y: 0, scale: 100, rotation: 0 },
      mediaFileId: mediaFile.id,
      speed: 1,
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    
    // Update duration if needed
    const layerEndTime = newLayer.startTime + newLayer.duration;
    if (layerEndTime > duration) {
      setDuration(Math.ceil(layerEndTime));
    }

    saveHistory();
  }, [currentTime, duration, snapEnabled]);

  // Add text layer
  const addTextLayer = useCallback((text: string = 'Your Text Here') => {
    const newLayer: Layer = {
      id: generateId(),
      name: 'Text Layer',
      type: 'text',
      visible: true,
      locked: false,
      duration: 5,
      startTime: snapToGrid(currentTime, 1, snapEnabled),
      color: '#EF4444',
      opacity: 100,
      blendMode: 'normal',
      effects: [],
      keyframes: [],
      transform: { x: 0, y: 0, scale: 100, rotation: 0 },
      content: text,
      speed: 1,
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    saveHistory();
  }, [currentTime, snapEnabled]);

  // Update layer
  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
    saveHistory();
  }, []);

  // Update layer transform
  const updateLayerTransform = useCallback((layerId: string, transform: Partial<Layer['transform']>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, transform: { ...layer.transform, ...transform } }
        : layer
    ));
  }, []);

  // Delete layer
  const deleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
    saveHistory();
  }, [selectedLayerId]);

  // Duplicate layer
  const duplicateLayer = useCallback((layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const newLayer: Layer = {
      ...layer,
      id: generateId(),
      name: `${layer.name} Copy`,
      startTime: snapToGrid(layer.startTime + layer.duration, 1, snapEnabled),
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    saveHistory();
  }, [layers, snapEnabled]);

  // Move layer on timeline
  const moveLayer = useCallback((layerId: string, newStartTime: number) => {
    const snappedTime = snapToGrid(Math.max(0, newStartTime), 1, snapEnabled);
    updateLayer(layerId, { startTime: snappedTime });
  }, [snapEnabled, updateLayer]);

  // Resize layer duration
  const resizeLayer = useCallback((layerId: string, newDuration: number) => {
    const snappedDuration = snapToGrid(Math.max(0.5, newDuration), 0.5, snapEnabled);
    updateLayer(layerId, { duration: snappedDuration });
  }, [snapEnabled, updateLayer]);

  // Toggle layer visibility
  const toggleVisibility = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);

  // Toggle layer lock
  const toggleLock = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  }, []);

  // Add effect to layer
  const addEffect = useCallback((layerId: string, effect: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, effects: [...layer.effects, effect] }
        : layer
    ));
    saveHistory();
  }, []);

  // Remove effect from layer
  const removeEffect = useCallback((layerId: string, effect: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, effects: layer.effects.filter(e => e !== effect) }
        : layer
    ));
    saveHistory();
  }, []);

  // Add keyframe
  const addKeyframe = useCallback((layerId: string, property: string, value: any) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id !== layerId) return layer;
      
      const keyframe = {
        time: currentTime,
        property,
        value,
        easing: 'ease-in-out' as const,
      };
      
      return {
        ...layer,
        keyframes: [...layer.keyframes, keyframe],
      };
    }));
    saveHistory();
  }, [currentTime]);

  // Save history for undo/redo
  const saveHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { layers, currentTime, duration }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [layers, currentTime, duration, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setLayers(previousState.layers);
      setCurrentTime(previousState.currentTime);
      setDuration(previousState.duration);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLayers(nextState.layers);
      setCurrentTime(nextState.currentTime);
      setDuration(nextState.duration);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  // Play/pause
  const togglePlay = useCallback(() => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(prev => !prev);
  }, [currentTime, duration]);

  // Seek to time
  const seekTo = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
    setIsPlaying(false);
  }, [duration]);

  // Get visible layers at current time
  const getVisibleLayers = useCallback(() => {
    return layers.filter(layer => 
      layer.visible &&
      currentTime >= layer.startTime &&
      currentTime <= layer.startTime + layer.duration
    );
  }, [layers, currentTime]);

  // Export project
  const exportProject = useCallback(async (options: {
    format: 'mp4' | 'webm' | 'gif';
    quality: 'low' | 'medium' | 'high' | '4k';
    fps: number;
  }) => {
    // This would trigger actual video rendering
    // For now, return mock data
    return {
      success: true,
      message: 'Export started',
      format: options.format,
      quality: options.quality,
    };
  }, [layers, duration]);

  return {
    // State
    layers,
    selectedLayerId,
    mediaFiles,
    currentTime,
    duration,
    isPlaying,
    zoom,
    timelineZoom,
    snapEnabled,
    history,
    historyIndex,
    
    // Getters
    selectedLayer: layers.find(l => l.id === selectedLayerId),
    getVisibleLayers,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    
    // Actions
    uploadFile,
    addLayerFromMedia,
    addTextLayer,
    updateLayer,
    updateLayerTransform,
    deleteLayer,
    duplicateLayer,
    moveLayer,
    resizeLayer,
    toggleVisibility,
    toggleLock,
    addEffect,
    removeEffect,
    addKeyframe,
    undo,
    redo,
    togglePlay,
    seekTo,
    exportProject,
    
    // Setters
    setLayers,
    setSelectedLayerId,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setZoom,
    setTimelineZoom,
    setSnapEnabled,
  };
};


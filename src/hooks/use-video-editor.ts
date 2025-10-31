
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  generateId, 
  generateVideoThumbnail,
  getVideoDuration,
  getImageDimensions,
  getAudioDuration,
  snapToGrid
} from '@/lib/video-editor-utils';
import type { MediaFile, Layer } from '@/lib/video-editor-utils';

export const useVideoEditor = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [snapEnabled] = useState(true);
  
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const saveStateToHistory = useCallback(() => {
    const currentState = {
      layers: layers,
      selectedLayerId: selectedLayerId,
      mediaFiles: mediaFiles,
      currentTime: currentTime,
      duration: duration
    };
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  }, [layers, selectedLayerId, mediaFiles, currentTime, duration, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setLayers(prevState.layers);
      setSelectedLayerId(prevState.selectedLayerId);
      setMediaFiles(prevState.mediaFiles);
      setCurrentTime(prevState.currentTime);
      setDuration(prevState.duration);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLayers(nextState.layers);
      setSelectedLayerId(nextState.selectedLayerId);
      setMediaFiles(nextState.mediaFiles);
      setCurrentTime(nextState.currentTime);
      setDuration(nextState.duration);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) };
  }, [isPlaying, duration]);

  const uploadFile = useCallback(async (file: File): Promise<MediaFile> => {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : 'audio';

    let mediaFile: MediaFile = { id: generateId(), name: file.name, type, url, size: file.size };

    if (type === 'video') {
      const [duration, thumbnail] = await Promise.all([getVideoDuration(file), generateVideoThumbnail(file)]);
      mediaFile = { ...mediaFile, duration, thumbnail };
    } else if (type === 'image') {
      const { width, height } = await getImageDimensions(file);
      mediaFile = { ...mediaFile, width, height };
    } else if (type === 'audio') {
      mediaFile.duration = await getAudioDuration(file);
    }

    setMediaFiles(prev => [...prev, mediaFile]);
    saveStateToHistory();
    return mediaFile;
  }, [saveStateToHistory]);

  const addLayer = useCallback((layer: Partial<Layer>) => {
    const newLayer: Layer = {
      id: generateId(),
      name: 'New Layer',
      type: 'video',
      visible: true,
      locked: false,
      duration: 5,
      startTime: snapToGrid(currentTime, 1, snapEnabled),
      color: '#3B82F6',
      opacity: 100,
      blendMode: 'normal',
      effects: [],
      keyframes: [],
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
      speed: 1,
      ...layer
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    if (newLayer.startTime + newLayer.duration > duration) setDuration(Math.ceil(newLayer.startTime + newLayer.duration));
    saveStateToHistory();
  }, [currentTime, duration, snapEnabled, saveStateToHistory]);
  
  const addLayerFromMedia = useCallback((mediaFile: MediaFile) => {
    addLayer({
      name: mediaFile.name,
      type: mediaFile.type,
      duration: mediaFile.duration || 5,
      mediaFileId: mediaFile.id,
      color: mediaFile.type === 'video' ? '#3B82F6' : mediaFile.type === 'image' ? '#10B981' : '#F59E0B'
    });
  }, [addLayer]);

  const addTextLayer = useCallback((text = 'Your Text Here') => {
    addLayer({ name: 'Text Layer', type: 'text', content: text, color: '#EF4444' });
  }, [addLayer]);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, ...updates } : l));
    saveStateToHistory();
  }, [saveStateToHistory]);
  
  const deleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId));
    if (selectedLayerId === layerId) setSelectedLayerId(null);
    saveStateToHistory();
  }, [selectedLayerId, saveStateToHistory]);

  const duplicateLayer = useCallback((layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    addLayer({ ...layer, name: `${layer.name} Copy`, startTime: snapToGrid(layer.startTime + 1, 1, snapEnabled) });
  }, [layers, addLayer, snapEnabled]);

  const toggleVisibility = useCallback((layerId: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l));
  }, []);

  const toggleLock = useCallback((layerId: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, locked: !l.locked } : l));
  }, []);
  
  const addEffect = useCallback((layerId: string, effect: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, effects: [...l.effects, effect] } : l));
    saveStateToHistory();
  }, [saveStateToHistory]);
  
  const removeEffect = useCallback((layerId: string, effectName: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, effects: l.effects.filter(e => e !== effectName) } : l));
    saveStateToHistory();
  }, [saveStateToHistory]);
  
  const togglePlay = useCallback(() => {
    if (currentTime >= duration) setCurrentTime(0);
    setIsPlaying(p => !p);
  }, [currentTime, duration]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
    setIsPlaying(false);
  }, [duration]);
  
  const exportProject = useCallback(async (options: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Export started' };
  }, []);

  return {
    layers, mediaFiles, selectedLayerId, currentTime, duration, isPlaying, zoom, timelineZoom, snapEnabled,
    selectedLayer: layers.find(l => l.id === selectedLayerId),
    canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1,
    uploadFile, addLayerFromMedia, addTextLayer, updateLayer, deleteLayer, duplicateLayer,
    toggleVisibility, toggleLock, addEffect, removeEffect, undo, redo,
    setSelectedLayerId, togglePlay, seekTo, exportProject, setZoom, setTimelineZoom,
    updateLayerTransform: (id: string, t: any) => updateLayer(id, { transform: t }),
  };
};

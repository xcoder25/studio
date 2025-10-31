// Video Editor Utility Functions

export interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  duration?: number;
  thumbnail?: string;
  size: number;
  width?: number;
  height?: number;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface Keyframe {
  time: number;
  property: string;
  value: any;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// Generate thumbnail from video
export const generateVideoThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    
    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0.1;
    };
    
    video.onseeked = () => {
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };
  });
};

// Get video duration
export const getVideoDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
  });
};

// Get image dimensions
export const getImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
  });
};

// Get audio duration
export const getAudioDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
  });
};

// Format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

// Apply transform to element
export const applyTransform = (transform: Transform): string => {
  return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale / 100}) rotate(${transform.rotation}deg)`;
};

// Interpolate between keyframes
export const interpolateKeyframes = (
  keyframes: Keyframe[],
  time: number,
  property: string
): any => {
  const propertyKeyframes = keyframes
    .filter(k => k.property === property)
    .sort((a, b) => a.time - b.time);
  
  if (propertyKeyframes.length === 0) return null;
  if (propertyKeyframes.length === 1) return propertyKeyframes[0].value;
  
  // Find surrounding keyframes
  let before = propertyKeyframes[0];
  let after = propertyKeyframes[propertyKeyframes.length - 1];
  
  for (let i = 0; i < propertyKeyframes.length - 1; i++) {
    if (time >= propertyKeyframes[i].time && time <= propertyKeyframes[i + 1].time) {
      before = propertyKeyframes[i];
      after = propertyKeyframes[i + 1];
      break;
    }
  }
  
  // Interpolate
  const t = (time - before.time) / (after.time - before.time);
  const easedT = applyEasing(t, after.easing || 'linear');
  
  if (typeof before.value === 'number' && typeof after.value === 'number') {
    return before.value + (after.value - before.value) * easedT;
  }
  
  return time < after.time ? before.value : after.value;
};

// Apply easing function
const applyEasing = (t: number, easing: string): number => {
  switch (easing) {
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return t * (2 - t);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t;
  }
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Snap to grid
export const snapToGrid = (value: number, gridSize: number, enabled: boolean): number => {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
};

// Export video (mock for now)
export const exportVideo = async (
  layers: any[],
  duration: number,
  options: {
    format: 'mp4' | 'webm' | 'gif';
    quality: 'low' | 'medium' | 'high' | '4k';
    fps: number;
  }
): Promise<Blob> => {
  // This would integrate with actual video encoding library
  // For now, return mock blob
  await new Promise(resolve => setTimeout(resolve, 2000));
  return new Blob(['mock video data'], { type: `video/${options.format}` });
};

// Apply effect (mock for now)
export const applyEffect = async (
  layer: any,
  effect: string,
  params?: any
): Promise<any> => {
  // This would apply actual video/image effects
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...layer, effects: [...layer.effects, effect] };
};

// AI processing (mock for now)
export const processWithAI = async (
  tool: string,
  input: any
): Promise<any> => {
  // This would call actual AI APIs
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    tool,
    result: `Processed with ${tool}`,
  };
};


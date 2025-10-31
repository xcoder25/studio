
export interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Layer {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text' | 'shape' | 'audio';
  visible: boolean;
  locked: boolean;
  duration: number;
  startTime: number;
  color: string;
  opacity: number;
  blendMode: string;
  effects: string[];
  keyframes: any[];
  transform: { x: number; y: number; scale: number; rotation: number; };
  mediaFileId?: string;
  content?: string;
  speed: number;
}

// Generate unique ID
export const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Format time from seconds to MM:SS.ms
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Generate thumbnail from video file
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      video.currentTime = 0.1;
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        reject(new Error('Canvas context not available'));
      }
      URL.revokeObjectURL(video.src);
    };
    video.onerror = (e) => reject(e);
  });
};

// Get duration of a video file
export const getVideoDuration = (file: File): Promise<number> => {
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

// Get dimensions of an image file
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
  });
};

// Get duration of an audio file
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
  });
};

// Snap value to grid
export const snapToGrid = (value: number, gridSize: number, enabled: boolean): number => {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
};

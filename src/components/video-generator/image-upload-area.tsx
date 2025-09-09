
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon } from 'lucide-react';

interface ImageUploadAreaProps {
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setImageDataUri: (uri: string | null) => void;
  isLoading: boolean;
}

export function ImageUploadArea({
  imagePreview,
  setImagePreview,
  setImageDataUri,
  isLoading
}: ImageUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(event, false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
    };
    reader.readAsDataURL(file);
  }

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setImageDataUri(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
       <label
          htmlFor="image-upload"
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
              "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
              isDragging && "border-primary bg-primary/10"
          )}
      >
        {imagePreview ? (
          <>
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg p-2" />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2 z-10" onClick={removeImage}>
                  Remove
              </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <ImageIcon className="w-10 h-10 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Drag & drop an image</span>
            </p>
            <p className="text-xs text-muted-foreground">or click to upload</p>
          </div>
        )}
      </label>
      <Input 
        id="image-upload"
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
}

    
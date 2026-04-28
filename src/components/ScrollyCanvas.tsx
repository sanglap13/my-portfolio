'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Overlay from './Overlay';
import type { SequenceConfig, Config } from '@/utils/config';

type OverlayContent = Config['overlay'];

export default function ScrollyCanvas({ 
  className,
  overlay,
  sequence
}: { 
  className?: string;
  overlay: OverlayContent;
  sequence: SequenceConfig;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastIndex = useRef<number>(-1);

  const FRAME_COUNT = sequence.frameCount || 110;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Re-render current frame on resize
      const currentIndex = Math.floor(frameIndex.get());
      renderFrame(currentIndex);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload Images
  useEffect(() => {
    if (!sequence.baseUrl) return;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preload = async () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `${sequence.baseUrl}${sequence.framePattern.replace('{index}', paddedIndex)}`;
        
        try {
          // Pre-decode for smoother canvas drawing
          if (img.decode) await img.decode();
        } catch (e) {
          console.warn("Failed to decode frame", i);
        }

        loadedImages[i] = img;
        loadedCount++;
        
        if (i === 0) {
           setImages([...loadedImages]);
        }
        
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      }
    };

    preload();
  }, [sequence.baseUrl]);

  const renderFrame = (index: number) => {
    if (images.length === 0 || !canvasRef.current) return;
    
    // Only skip if it's the same index AND we've already drawn successfully
    if (index === lastIndex.current && lastIndex.current !== -1) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = images[index];
    if (!img) return;

    const draw = () => {
      if (!canvasRef.current || !ctx) return;
      
      const ZOOM = 1.12; 
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height * ZOOM;
        drawWidth = (canvas.height * imgRatio) * ZOOM;
      } else {
        drawWidth = canvas.width * ZOOM;
        drawHeight = (canvas.width / imgRatio) * ZOOM;
      }

      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2 + (drawHeight * 0.02);

      // Clear to theme color instead of black
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      lastIndex.current = index;
    };

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }
  };

  useMotionValueEvent(frameIndex, 'change', (latest) => {
     renderFrame(Math.floor(latest));
  });

  useEffect(() => {
     if (isLoaded) {
        // Double-check render on any state change that could mean readiness
        requestAnimationFrame(() => {
          renderFrame(Math.floor(frameIndex.get()));
        });
     }
  }, [isLoaded]);

  return (
    <div ref={containerRef} className={cn("relative h-[500vh] w-full bg-[#121212]", className)}>
       <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full bg-[#121212]" 
            style={{ touchAction: 'none' }}
          />
          <Overlay scrollYProgress={scrollYProgress} content={overlay} />
       </div>
    </div>
  );
}

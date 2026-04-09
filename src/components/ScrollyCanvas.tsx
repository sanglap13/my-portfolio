'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Overlay from './Overlay';

const FRAME_COUNT = 120;

export default function ScrollyCanvas({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `/sequence/frame_${paddedIndex}_delay-0.066s.webp`;
        loadedImages.push(img);
    }
    
    // Once first image loads, we trigger a re-render to draw it.
    loadedImages[0].onload = () => setImages(loadedImages);
    setImages(loadedImages);
  }, []);

  const renderFrame = (index: number) => {
      if (images.length === 0 || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const img = images[index];
      if (img && img.complete) {
          // Zoom less (10% total) and anchor to the top (sy = 0) so the head isn't cut off.
          // This cuts 5% from the left, 5% from the right, and 10% from the bottom (hiding the watermark).
          const zoomRatio = 0.10; 
          const sx = img.width * (zoomRatio / 2);
          const sy = 0;
          const sWidth = img.width * (1 - zoomRatio);
          const sHeight = img.height * (1 - zoomRatio);
          
          canvasRef.current.width = sWidth;
          canvasRef.current.height = sHeight;
          
          // Draw the cropped portion
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
      }
  };

  useMotionValueEvent(frameIndex, 'change', (latest) => {
     renderFrame(Math.floor(latest));
  });

  // Render initial frame on load
  useEffect(() => {
     if (images.length > 0 && images[0].complete) {
        renderFrame(0);
     }
  }, [images]);

  return (
    <div ref={containerRef} className={cn("relative h-[500vh] w-full bg-[#121212]", className)}>
       <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <Overlay scrollYProgress={scrollYProgress} />
       </div>
    </div>
  );
}

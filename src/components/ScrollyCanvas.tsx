'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Overlay from './Overlay';

const FRAME_COUNT = 110;

type OverlayContent = typeof import('@/data/config.json').overlay;

export default function ScrollyCanvas({ 
  className,
  overlay
}: { 
  className?: string;
  overlay: OverlayContent;
}) {
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
      // Set onload BEFORE src so cache hits are not missed
      if (i === 0) {
        img.onload = () => setImages((prev) => (prev.length === 0 ? loadedImages : prev));
      }
      img.src = `/sequence/frame_${paddedIndex}_delay-0.066s.webp`;
      loadedImages.push(img);
    }

    // Handle the case where image 0 was already cached (complete synchronously)
    if (loadedImages[0].complete) {
      setImages(loadedImages);
    }
  }, []);

  const renderFrame = (index: number) => {
      if (images.length === 0 || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const img = images[index];
      if (!img) return;

      const draw = (image: HTMLImageElement) => {
          if (!canvasRef.current) return;
          const drawCtx = canvasRef.current.getContext('2d');
          if (!drawCtx) return;

          const zoomRatio = 0.10;
          const panOffset = 0.03;
          const sx = image.width * ((zoomRatio / 2) + panOffset);
          const sy = 0;
          const sWidth = image.width * (1 - zoomRatio);
          const sHeight = image.height * (1 - zoomRatio);

          canvasRef.current.width = sWidth;
          canvasRef.current.height = sHeight;
          drawCtx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
      };

      if (img.complete) {
          draw(img);
      } else {
          // Image not loaded yet — draw when ready (handles mid-scroll refresh)
          img.onload = () => {
              // Only draw if this is still the frame we need
              const currentIndex = Math.round(frameIndex.get());
              if (currentIndex === index) draw(img);
          };
      }
  };

  useMotionValueEvent(frameIndex, 'change', (latest) => {
     renderFrame(Math.floor(latest));
  });

  // Render the correct frame for the current scroll position when images first load
  useEffect(() => {
     if (images.length > 0 && images[0].complete) {
        const currentIndex = Math.round(frameIndex.get());
        renderFrame(Math.max(0, Math.min(currentIndex, FRAME_COUNT - 1)));
     }
  }, [images]);

  return (
    <div ref={containerRef} className={cn("relative h-[500vh] w-full bg-transparent", className)}>
       <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <Overlay scrollYProgress={scrollYProgress} content={overlay} />
       </div>
    </div>
  );
}

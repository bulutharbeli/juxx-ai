import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

const ZOOM_FACTOR = 1.35;
const FRAME_COUNT = 470;
// Load initial 10 frames to unlock the screen instantly (<300ms)
const INITIAL_BATCH_SIZE = 10;

const getFramePath = (index: number) => {
    const formattedIndex = index.toString().padStart(5, '0');
    return `/frames/comp1/frames_${formattedIndex}.jpg`;
};

interface ScrollVideoPlayerProps {
    progress: MotionValue<number>;
}

export const ScrollVideoPlayer: React.FC<ScrollVideoPlayerProps> = ({ progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
    const loadedFlagsRef = useRef<boolean[]>(new Array(FRAME_COUNT).fill(false));
    const [isLoading, setIsLoading] = useState(true);

    // Map scroll progress (0 to 1) to frame index (0 to 469)
    const frameIndexValue = useTransform(progress, [0, 1], [0, FRAME_COUNT - 1]);

    // Find the best available frame index (target or nearest loaded neighbor)
    const getBestFrameIndex = useCallback((targetIndex: number): number => {
        if (loadedFlagsRef.current[targetIndex]) return targetIndex;

        // Search outwards for nearest loaded frame
        for (let delta = 1; delta < FRAME_COUNT; delta++) {
            const prev = targetIndex - delta;
            if (prev >= 0 && loadedFlagsRef.current[prev]) return prev;
            const next = targetIndex + delta;
            if (next < FRAME_COUNT && loadedFlagsRef.current[next]) return next;
        }

        return targetIndex;
    }, []);

    const drawFrame = useCallback((targetIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const bestIndex = getBestFrameIndex(targetIndex);
        const img = imagesRef.current[bestIndex];
        if (!img || !img.complete) return;

        const { width, height } = canvas;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = width / height;

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

        if (canvasRatio > imgRatio) {
            drawWidth = width * ZOOM_FACTOR;
            drawHeight = (width / imgRatio) * ZOOM_FACTOR;
        } else {
            drawHeight = height * ZOOM_FACTOR;
            drawWidth = (height * imgRatio) * ZOOM_FACTOR;
        }

        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }, [getBestFrameIndex]);

    // Handle scroll progress updates
    useEffect(() => {
        const unsubscribe = frameIndexValue.on("change", (latest) => {
            const index = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(latest)));
            drawFrame(index);
        });
        return () => unsubscribe();
    }, [frameIndexValue, drawFrame]);

    // Progressive loading logic
    useEffect(() => {
        let isCancelled = false;
        imagesRef.current = new Array(FRAME_COUNT).fill(null);
        loadedFlagsRef.current = new Array(FRAME_COUNT).fill(false);

        const loadSingleFrame = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                if (loadedFlagsRef.current[index]) {
                    resolve();
                    return;
                }
                const img = new Image();
                img.src = getFramePath(index);
                img.onload = () => {
                    if (!isCancelled) {
                        imagesRef.current[index] = img;
                        loadedFlagsRef.current[index] = true;
                    }
                    resolve();
                };
                img.onerror = () => resolve();
            });
        };

        const startProgressiveLoad = async () => {
            // Step 1: Load initial batch immediately for instant page display
            const initialPromises: Promise<void>[] = [];
            for (let i = 0; i < Math.min(INITIAL_BATCH_SIZE, FRAME_COUNT); i++) {
                initialPromises.push(loadSingleFrame(i));
            }
            await Promise.all(initialPromises);

            if (isCancelled) return;

            // Instantly unblock page load
            setIsLoading(false);
            setTimeout(() => drawFrame(Math.floor(frameIndexValue.get())), 50);

            // Step 2: Load keyframes across timeline (every 5th frame)
            const keyframeBatch: number[] = [];
            for (let i = INITIAL_BATCH_SIZE; i < FRAME_COUNT; i += 5) {
                keyframeBatch.push(i);
            }
            for (let i = 0; i < keyframeBatch.length; i += 10) {
                if (isCancelled) return;
                const chunk = keyframeBatch.slice(i, i + 10);
                await Promise.all(chunk.map(idx => loadSingleFrame(idx)));
            }

            // Step 3: Fill in remaining frames in background
            const remaining: number[] = [];
            for (let i = 0; i < FRAME_COUNT; i++) {
                if (!loadedFlagsRef.current[i]) remaining.push(i);
            }

            for (let i = 0; i < remaining.length; i += 10) {
                if (isCancelled) return;
                const chunk = remaining.slice(i, i + 10);
                await Promise.all(chunk.map(idx => loadSingleFrame(idx)));
            }
        };

        startProgressiveLoad();

        return () => {
            isCancelled = true;
        };
    }, [drawFrame, frameIndexValue]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                drawFrame(Math.floor(frameIndexValue.get()));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [drawFrame, frameIndexValue]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
            {isLoading && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-white transition-all duration-300 animate-pulse w-full"
                        />
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="w-full h-full block transition-opacity duration-500"
                style={{ opacity: isLoading ? 0 : 1 }}
            />
        </div>
    );
};


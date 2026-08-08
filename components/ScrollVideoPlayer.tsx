import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

const ZOOM_FACTOR = 1.35;
// The folder has up to 470 frames, let's use all of them for maximum smoothness
const FRAME_COUNT = 470;

const getFramePath = (index: number) => {
    const formattedIndex = index.toString().padStart(5, '0');
    return `/frames/comp1/frames_${formattedIndex}.jpg`;
};

interface ScrollVideoPlayerProps {
    progress: MotionValue<number>;
}

export const ScrollVideoPlayer: React.FC<ScrollVideoPlayerProps> = ({ progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Map scroll progress (0 to 1) to frame index (0 to 469)
    // Downscroll moves from frame 0 to 469
    const frameIndexValue = useTransform(progress, [0, 1], [0, FRAME_COUNT - 1]);

    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || imagesRef.current.length === 0) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const img = imagesRef.current[index];
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
    }, []);

    // Effect to handle canvas updates when scroll progress changes
    useEffect(() => {
        const unsubscribe = frameIndexValue.on("change", (latest) => {
            if (!isLoading) {
                const index = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(latest)));
                drawFrame(index);
            }
        });
        return () => unsubscribe();
    }, [frameIndexValue, isLoading, drawFrame]);

    // Preloading Logic for all 470 frames
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                if (loadedCount === FRAME_COUNT) {
                    setIsLoading(false);
                    // Draw initial frame based on current scroll
                    setTimeout(() => drawFrame(Math.floor(frameIndexValue.get())), 100);
                }
            };
            // Error handling to prevent loading screen from hanging if a frame is missing
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setIsLoading(false);
                }
            };
            images.push(img);
        }
        imagesRef.current = images;
    }, [drawFrame, frameIndexValue]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && !isLoading) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                drawFrame(Math.floor(frameIndexValue.get()));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [drawFrame, frameIndexValue, isLoading]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
            {isLoading && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-white transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ opacity: isLoading ? 0 : 1 }}
            />
        </div>
    );
};

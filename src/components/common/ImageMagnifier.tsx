"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageMagnifierProps {
    src: string;
    width?: string | number;
    height?: string | number;
    zoomLevel?: number;
    alt: string;
    className?: string;
}

export default function ImageMagnifier({
    src,
    width,
    height,
    zoomLevel = 2.5,
    alt,
    className = "",
}: ImageMagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [xy, setXY] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // Disable on touch/tablet/mobile (<1024px)
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!src) return null;

    return (
        <div
            className={`relative block overflow-hidden ${className}`}
            style={{
                width: width,
                height: height,
                cursor: (showMagnifier && !isMobile) ? "zoom-in" : "default",
            }}
            onMouseEnter={(e) => {
                if (isMobile) return;
                const elem = e.currentTarget;
                const { width, height } = elem.getBoundingClientRect();
                setImgSize({ width, height });
                setShowMagnifier(true);
            }}
            onMouseLeave={() => {
                setShowMagnifier(false);
            }}
            onMouseMove={(e) => {
                if (isMobile || !showMagnifier) return;
                const elem = e.currentTarget;
                const { top, left } = elem.getBoundingClientRect();

                // Calculate cursor position relative to the image
                const x = e.pageX - left - window.scrollX;
                const y = e.pageY - top - window.scrollY;

                // Clamp values to prevent glitching at edges
                // Check if x and y are within bounds? Not strictly necessary for this logic but good for safety
                setXY({ x, y });
            }}
        >
            {/* Original Image - visible when not zooming, or underneath */}
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain p-6 mix-blend-multiply"
                priority
                unoptimized
            />

            {/* Magnifier Overlay - visible only on non-mobile when hovered */}
            {!isMobile && (
                <div
                    style={{
                        display: showMagnifier ? "block" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 50,
                        pointerEvents: "none",
                        backgroundColor: "white",
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: "no-repeat",

                        // Size of the background image (zoomed)
                        backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,

                        // Position of background to show zoomed area under cursor
                        backgroundPositionX: `${-xy.x * (zoomLevel - 1)}px`,
                        backgroundPositionY: `${-xy.y * (zoomLevel - 1)}px`,
                    }}
                />
            )}
        </div>
    );
}

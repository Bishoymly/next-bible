"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = ["/img/demo/demo1.png", "/img/demo/demo2.png", "/img/demo/demo3.png", "/img/demo/demo4.png"];

export function ImagePreview() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full mx-auto h-40 md:h-80">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Preview image ${index + 1}`}
          fill
          className={`object-contain transition-opacity duration-1000 ${index === currentImageIndex ? (isTransitioning ? "opacity-0" : "opacity-100") : "opacity-0"}`}
        />
      ))}
    </div>
  );
}

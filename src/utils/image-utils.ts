
export const getImageDimensions = (baseSize: string, aspectRatio: string) => {
  // If it's a custom size, we'll handle it in the ImageGenerationHandler
  if (baseSize === "custom") {
    return { width: 512, height: 512 }; // Default fallback
  }
  
  const [size] = baseSize.split('x').map(Number);
  
  const roundToMultipleOf64 = (num: number) => {
    return Math.min(2048, Math.max(128, Math.round(num / 64) * 64));
  };

  switch (aspectRatio) {
    case 'portrait':
      return { 
        width: size,
        height: roundToMultipleOf64(size * (16/9))
      };
    case 'landscape':
      return { 
        width: roundToMultipleOf64(size * (16/9)),
        height: size
      };
    default:
      return { width: size, height: size };
  }
};

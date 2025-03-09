
export const getImageDimensions = (baseSize: string, aspectRatio: string) => {
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

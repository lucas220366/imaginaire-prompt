
export const getImageDimensions = (baseSize: string, aspectRatio: string) => {
  const [size] = baseSize.split('x').map(Number);
  switch (aspectRatio) {
    case 'portrait':
      return { width: size, height: Math.round(size * (16/9)) };
    case 'landscape':
      return { width: Math.round(size * (16/9)), height: size };
    default:
      return { width: size, height: size };
  }
};

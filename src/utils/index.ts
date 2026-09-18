// Export utility functions here

/**
 * Genera un numero random tra min e max (inclusi)
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Genera una sequenza di `count` numeri consecutivi a partire da `start`
 */
export const generateSequentialNumbers = (count: number, start: number): number[] => {
  return Array.from({ length: count }, (_, i) => i + start);
};

/**
 * Genera colori per gli spicchi della ruota
 */
export const generateWheelColors = (count: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  
  return colors;
};

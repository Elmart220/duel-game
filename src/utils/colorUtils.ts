import type {Color} from '../types/EngineTypes';

export const getRandomColorChannel = () => {
  return Math.floor(Math.random() * 256);
}

export const getRandomRGBColor = (): Color => {
  return [getRandomColorChannel(), getRandomColorChannel(), getRandomColorChannel()];
}

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const hexToRgb = (hex: string): Color => {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [ r, g, b ];
}

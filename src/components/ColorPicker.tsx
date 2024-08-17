import {useMemo} from 'react';
import {Color} from '../types/EngineTypes';
import type {Position} from '../types/EngineTypes';
import {hexToRgb, rgbToHex} from '../utils/colorUtils';

type ColorPickerProps = {
  position: Position
  active: boolean
  onChange: (color: Color) => void
  color?: Color
}

export const ColorPicker = ({ position, color, active, onChange }: ColorPickerProps) => {
  const hexColor = useMemo(() => rgbToHex(...(color ?? [0, 0, 0])), [color]);

  return (
    <div className="colorPickerWrapper" style={{
      ...(position.x > window.innerWidth * 0.5 ? {right: window.innerWidth - position.x - 20} : {left: position.x - 20}),
      ...(position.y > window.innerHeight * 0.5 ? {bottom: window.innerHeight - position.y - 20} : {top: position.y - 20}),
      display: active ? 'flex' : 'none'
    }}>
      <input
        className={'colorPicker'}
        type={'color'}
        value={hexColor}
        onChange={(e) => {
          const color = hexToRgb(e.target.value);
          onChange(color);
        }}
      />
      <div className="colorLabel">
        <span>{`R: ${color?.[0] ?? 0}`}</span>
        <span>{`G: ${color?.[1] ?? 0}`}</span>
        <span>{`B: ${color?.[2] ?? 0}`}</span>
      </div>
      <span className="colorLabel">{`HEX: ${hexColor}`}</span>
    </div>
  );
}

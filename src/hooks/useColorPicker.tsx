import React, {useMemo, useState} from 'react';
import {ColorPicker} from '../components/ColorPicker';
import {Color} from '../types/EngineTypes';

type UseColorPickerProps = {
  onColorChange: (color: Color) => void
}

export const useColorPicker = ({onColorChange}: UseColorPickerProps) => {
  const [colorPickerValue, setColorPickerValue] = useState<Color>([0, 0, 0]);
  const [colorPickerPosition, setColorPickerPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);

  const picker = useMemo(() => {
    return (
      <ColorPicker
        position={colorPickerPosition}
        active={colorPickerActive}
        color={colorPickerValue}
        onChange={(color) => {
          onColorChange(color);
          setColorPickerValue(color);
        }}
      />
    );
  }, [colorPickerPosition, colorPickerValue, colorPickerActive, onColorChange]);

  return {
    Picker: picker,
    setColorPickerValue,
    setColorPickerPosition,
    setColorPickerActive,
  };
}

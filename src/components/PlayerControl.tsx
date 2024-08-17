import React, {useState} from 'react';
import type {ChangePlayerOptions} from '../types/EngineTypes';

type PlayerControlProps = {
  changeHandler: (options: Omit<ChangePlayerOptions, 'name'>) => void
  speedRange: [number, number]
  frequencyRange: [number, number]
  score: number
  initOptions?: Omit<ChangePlayerOptions, 'name'>
}
export const PlayerControl = ({changeHandler, speedRange, frequencyRange, score, initOptions}: PlayerControlProps) => {
  const [speed, setSpeed] = useState<number>(initOptions?.speed ?? speedRange[0]);
  const [frequency, setFrequency] = useState<number>(initOptions?.dropFrequency ?? frequencyRange[0]);

  return (
    <div className="playerControl">
      <div className="rangeInput">
        <span>speed</span>
        <input type={'range'} value={speed} min={speedRange[0]} max={speedRange[1]} onChange={(e) => {
          changeHandler({
            speed: Number(e.target.value),
            dropFrequency: frequency
          })

          setSpeed(Number(e.target.value));
        }} />
      </div>
      <span className="score">{score}</span>
      <div className="rangeInput">
        <input type={'range'} value={frequency} min={frequencyRange[0]} max={frequencyRange[1]} onChange={(e) => {
          changeHandler({
            speed: speed,
            dropFrequency: Number(e.target.value)
          })

          setFrequency(Number(e.target.value));
        }} />
        <span>drop frequency</span>
      </div>
    </div>
  );
}

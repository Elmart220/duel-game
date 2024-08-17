import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {PlayerControl} from './components/PlayerControl';
import {DuelController} from './duel/DuelController';
import engine from './duel/DuelEngine';
import {useColorPicker} from './hooks/useColorPicker';
import type {Color, Position, IPlayer} from './types/EngineTypes';

function App() {
  const [score, setScore] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<DuelController | null>(null);

  const changeColorHandler = useCallback((color: Color) => {
    if (!currentPlayer) {
      return;
    }

    controllerRef.current?.eventManager.emit('changePlayer', {
      name: currentPlayer.name,
      dropColor: color
    })
  }, [currentPlayer]);

  const {
    Picker,
    setColorPickerPosition,
    setColorPickerActive,
    setColorPickerValue
  } = useColorPicker({
    onColorChange: changeColorHandler,
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const controller = new DuelController(canvasRef.current, engine);
    controllerRef.current = controller;
    controller.start();

    return () => {
      controller.destroy();
    }
  }, []);

  useEffect(() => {
    if (!controllerRef.current) {
      return;
    }

    controllerRef.current?.eventManager.off('score');
    controllerRef.current?.eventManager.off('touch');

    controllerRef.current.eventManager.on('score', (score: number[]) => {
      setScore(score);
    });
    controllerRef.current.eventManager.on('touch', (args: {player: IPlayer | null, touchPos: Position}) => {
      setCurrentPlayer(args.player);
      setColorPickerActive(!!args.player);

      if (args.player) {
        setColorPickerValue(args.player.color);
        setColorPickerPosition(args.touchPos);
      }
    });
  }, [setCurrentPlayer, setColorPickerActive, setColorPickerPosition, setColorPickerValue]);

  return (
    <div className="App">
      <div className="frame">
        <canvas id="canvas" ref={canvasRef}/>
      </div>
      <div className="control">
        {engine.players.map((player, index) => (
          <PlayerControl
            key={`${player.name}-control`}
            speedRange={[0, 100]}
            score={score[index] ?? 0}
            frequencyRange={[0, 1000]}
            changeHandler={(options) => {
              controllerRef.current?.eventManager.emit('changePlayer', {
                name: player.name,
                speed: (options.speed ?? 0) / 100,
                dropFrequency: (options.dropFrequency ?? 0)
              });
            }}
            initOptions={{
              speed: player.speed * 100,
              dropFrequency: player.dropFrequency
            }}
          />
        ))}
      </div>
      {Picker}
    </div>
  );
}

export default App;

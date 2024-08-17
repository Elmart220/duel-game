import {getPointOnField} from '../utils/canvasUtils';
import {DuelEngine} from './DuelEngine';
import {DuelRenderer} from './DuelRenderer';

export class DuelController {
  private _engine: DuelEngine;
  private _renderer: DuelRenderer;

  public get eventManager() {
    return this._engine.eventManager;
  }

  constructor(canvas: HTMLCanvasElement, engine: DuelEngine) {
    this._engine = engine;
    this._renderer = new DuelRenderer(canvas, engine);

    this._init();
  }

  private _init() {
    this._engine.eventManager.on('tick', () => {
      this._renderer.render();
    });

    this._engine.eventManager.on('damage', () => {
      this.eventManager.emit('score', this._engine.players.map(p => p.damage));
    });

    const clickHandler = (e: MouseEvent) => {
      const point = getPointOnField(e, this._renderer.canvas, this._renderer.scale);

      const touchPlayer = this._engine.players.find((player) => {
        return Math.hypot(player.position.x - point.x, player.position.y - point.y) <= player.radius;
      });

      this._engine.eventManager.emit('touch', {
        player: touchPlayer,
        touchPos: {x: e.clientX, y: e.clientY}
      });
    }

    const moveHandler = (e: MouseEvent) => {
      const point = getPointOnField(e, this._renderer.canvas, this._renderer.scale);

      this._engine.eventManager.emit('changeRigidBody', {
        name: 'cursor',
        position: point
      });
    }

    const leaveHandler = () => {
      this._engine.eventManager.emit('changeRigidBody', {
        name: 'cursor',
        active: false
      });
    }

    this._renderer.canvas.addEventListener('mousedown', clickHandler);
    this._renderer.canvas.addEventListener('mousemove', moveHandler);
    this._renderer.canvas.addEventListener('mouseleave', leaveHandler);

    this._engine.eventManager.on('destroy', () => {
      this._renderer.canvas.removeEventListener('mousedown', clickHandler);
      this._renderer.canvas.removeEventListener('mousemove', moveHandler);
      this._renderer.canvas.removeEventListener('mouseleave', leaveHandler);
    })

    console.log('init controller');
  }

  public start() {
    this._engine.start();
  }

  public destroy() {
    this._engine.destroy();
  }
}

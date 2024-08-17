import {DuelEngine} from './DuelEngine';

export class DuelRenderer {
  private _engine: DuelEngine;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _scale = 1;

  get canvas() {
    return this._canvas;
  }

  get scale() {
    return this._scale;
  }

  constructor(canvas: HTMLCanvasElement, engine: DuelEngine) {
    this._engine = engine;
    this._canvas = canvas;

    const ctx = this._canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2d context');
    }

    this._ctx = ctx;

    console.log('init renderer');
  }

  private _screenAdapt() {
    this._scale = Math.min(window.innerWidth / this._engine.field.width, window.innerHeight / this._engine.field.height);

    this._canvas.width = this._engine.field.width * this._scale;
    this._canvas.height = this._engine.field.height * this._scale;
  }

  public render() {
    this._screenAdapt();

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    const players = this._engine.players;
    const drops = this._engine.drops;
    const rigidBodies = this._engine.rigidBodies;

    for (const body of [...drops, ...rigidBodies, ...players]) {
      this._ctx.beginPath();
      this._ctx.arc(body.position.x * this._scale, body.position.y * this._scale, body.radius * this._scale, 0, 2 * Math.PI);
      this._ctx.fillStyle = `rgb(${body.color[0]}, ${body.color[1]}, ${body.color[2]})`;
      this._ctx.fill();
    }
  }
}

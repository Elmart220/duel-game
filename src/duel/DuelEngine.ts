import {IRigidBody, RigidBodyOptions} from '../types/EngineTypes';
import type {
  ChangePlayerOptions,
  CreatePlayerOptions,
  DuelOptions,
  IDrop,
  IField,
  IPlayer
} from '../types/EngineTypes';
import {getRandomRGBColor} from '../utils/colorUtils';
import {EventManager} from './EventManager';

const MIN_DROP_SPEED = 0.1;
const RIGID_BODY_RADIUS = 10;

export class DuelEngine {
  private _field: IField;
  private _players: IPlayer[];
  private _drops: IDrop[];
  private _rigidBodies: IRigidBody[];
  private _eventManager: EventManager;
  private _animationRequestId: number | null = null;

  public get field() {
    return this._field;
  }

  public get players() {
    return this._players;
  }

  public get drops() {
    return this._drops;
  }

  public get rigidBodies() {
    return this._rigidBodies;
  }

  public get eventManager() {
    return this._eventManager;
  }

  constructor(options: DuelOptions) {
    this._field = {
      width: options.fieldWidth,
      height: options.fieldHeight
    }

    this._players = [];
    this._drops = [];
    this._rigidBodies = [];
    this._eventManager = new EventManager();

    this._init(options);
  }

  private _createPlayer(options: CreatePlayerOptions): IPlayer {
    const radius = options.playerRadius ?? 50;

    const frequency = options.playerDropFrequencyRange[0] + Math.random() * (options.playerDropFrequencyRange[1] - options.playerDropFrequencyRange[0])

    return {
      name: options.name,
      position: {x: 0, y: 0},
      damage: 0,
      regenDelay: 1000,
      damageDown: 0,
      direction: {x: 0, y: 1},
      radius,
      speed: options.playerSpeedRange[0] + Math.random() * (options.playerSpeedRange[1] - options.playerSpeedRange[0]),
      dropFrequency: frequency,
      coolDown: frequency,
      color: options.playerDropColor ?? getRandomRGBColor(),
      active: true
    };
  }

  private _createRigidBody(options: RigidBodyOptions): IRigidBody {
    return {
      name: options.name,
      position: {...(options.position ?? { x: 0, y: 0 })},
      active: true,
      speed: 0,
      color: [200, 200, 200],
      radius: RIGID_BODY_RADIUS,
      direction: {x: 0, y: 1}
    }
  }

  private _initListeners() {
    this._eventManager.on('changePlayer', (options: ChangePlayerOptions) => {
      this._changePlayer(options);
    });

    this._eventManager.on('changeRigidBody', (options: RigidBodyOptions) => {
      this._changeRigidBody(options);
    });

    console.log('init listeners');
  }

  private _init(options: DuelOptions) {
    for (const player of options.players) {
      const newPlayer = this._createPlayer(player);
      this._players.push(newPlayer);
    }

    for (let i = 0; i < this.players.length; i++) {
      const radius = this.players[i].radius;

      this._players[i].position.x = radius + (this._field.width - 2 * radius) * (i / (this.players.length - 1));
      this._players[i].position.y = radius + Math.random() * (this._field.height - 2 * radius);
    }

    console.log('init duel');
    this._initListeners();
  }

  private _movePlayers(dt: number) {
    for (const player of this._players) {
      player.position.x += player.speed * player.direction.x * dt;
      player.position.y += player.speed * player.direction.y * dt;
      player.damageDown = Math.max(0, player.damageDown - dt);
    }
  }

  private _moveDrops(dt: number) {
    for (const drop of this._drops) {
      drop.position.x += drop.speed * drop.direction.x * dt;
      drop.position.y += drop.speed * drop.direction.y * dt;

      drop.active = drop.position.x > 0 || drop.position.x < this.field.width || drop.position.y > 0 || drop.position.y < this.field.height;
    }
  }

  private _observePlayers(dt: number) {
    for (const player of this._players) {
      if (player.position.x < player.radius || player.position.x > this.field.width - player.radius) {
        player.direction.x *= -1;
        player.position.x = player.position.x < player.radius ? player.radius : this.field.width - player.radius;
      }

      if (player.position.y < player.radius || player.position.y > this.field.height - player.radius) {
        player.direction.y *= -1;
        player.position.y = player.position.y < player.radius ? player.radius : this.field.height - player.radius;
      }

      player.damageDown = Math.max(0, player.damageDown - dt);
      player.coolDown -= dt;

      if (player.coolDown <= 0) {
        this._drops.push({
          position: {...player.position},
          active: true,
          speed: Math.max(MIN_DROP_SPEED, player.speed),
          color: player.color,
          direction: {x: player.position.x > this.field.width * 0.5 ? -1 : 1, y: 0},
          radius: player.radius * 0.1,
          owner: player
        });

        player.coolDown = player.dropFrequency;
      }
    }
  }

  private _observeDrops() {
    for (const drop of this._drops) {
      drop.active = drop.position.x > 0 && drop.position.x < this.field.width && drop.position.y > 0 && drop.position.y < this.field.height;

      for (const player of this._players) {
        if (drop.owner !== player && Math.hypot(drop.position.x - player.position.x, drop.position.y - player.position.y) < player.radius) {
          player.damage++;
          player.damageDown = player.regenDelay;
          drop.active = false;

          this._eventManager.emit('damage', player);
        }
      }
    }

    this._drops = this._drops.filter(drop => drop.active);
  }

  private _observeRigidBodies() {
    this._rigidBodies = this._rigidBodies.filter(body => body.active);

    for (const body of this._rigidBodies) {
      for (const player of this._players) {
        if (Math.hypot(body.position.x - player.position.x, body.position.y - player.position.y) < player.radius + body.radius) {
          if (body.position.y > player.position.y && player.direction.y > 0) {
            player.direction.y *= -1;
          }

          if (body.position.y < player.position.y && player.direction.y < 0) {
            player.direction.y *= -1;
          }
        }
      }
    }
  }

  private _observe(dt: number) {
    this._observePlayers(dt);
    this._observeDrops();
    this._observeRigidBodies();
  }

  private _next(dt: number) {
    this._moveDrops(dt);
    this._movePlayers(dt);
    this._observe(dt);

    this._eventManager.emit('tick');
  }

  private _changePlayer(options: ChangePlayerOptions) {
    const player = this._players.find(p => p.name === options.name);

    if (player) {
      player.speed = options.speed ?? player.speed;
      player.dropFrequency = options.dropFrequency ?? player.dropFrequency;
      player.color = options.dropColor ?? player.color;
    }
  }

  private _changeRigidBody(options: RigidBodyOptions) {
    const body = this._rigidBodies.find(p => p.name === options.name);

    if (!body) {
      this._rigidBodies.push(this._createRigidBody({
        ...options,
        position: options.position ?? {x: this._field.width * 0.5, y: this._field.height * 0.5}
      }));
      return;
    }

    body.position = options.position ?? body.position;
    body.active = options.active ?? body.active;
  }

  public start() {
    const self = this;
    let previousFrame = performance.now();

    this._animationRequestId = requestAnimationFrame(function loop(frame: number) {
      const dt = frame - previousFrame;
      previousFrame = frame;
      self._next(dt);

      if (self._animationRequestId !== null) {
        requestAnimationFrame(loop);
      }
    });

    this._eventManager.emit('start');
  }

  public destroy() {
    if (this._animationRequestId) {
      cancelAnimationFrame(this._animationRequestId);
      this._animationRequestId = null;
    }

    this._eventManager.emit('destroy');
    this._eventManager.off();
  }
}

const engine = new DuelEngine({
  fieldWidth: 1280,
  fieldHeight: 720,
  players: ['left', 'right'].map(name => ({
    name,
    playerSpeedRange: [0.2, 0.5],
    playerDropFrequencyRange: [700, 900],
    playerRadius: 50,
  })),
});

export default engine

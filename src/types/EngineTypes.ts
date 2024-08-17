export interface IField {
  width: number
  height: number
}

export type Color = [number, number, number];
export type Position = {x: number, y: number};

export interface IEntity {
  position: Position
  direction: Position
  radius: number
  speed: number
  color: Color
  active: boolean
}

export interface IPlayer extends IEntity {
  name: string
  dropFrequency: number
  coolDown: number
  damage: number
  damageDown: number
  regenDelay: number
}

export interface IDrop extends IEntity {
  owner: IPlayer
}

export interface IRigidBody extends IEntity {
  name: string
}

export type DuelOptions = {
  fieldWidth: number
  fieldHeight: number
  players: CreatePlayerOptions[]
}

export type CreatePlayerOptions = {
  name: string
  playerSpeedRange: [number, number]
  playerDropFrequencyRange: [number, number]
  playerDropColor?: Color
  playerRadius?: number
}

export type ChangePlayerOptions = {
  name: string
  speed?: number,
  dropFrequency?: number,
  dropColor?: Color
}

export type RigidBodyOptions = {
  name: string
  position?: Position
  active?: boolean
}

type NumberPair = [number, number];

type Vector2 = { x: number; y: number };

type Cursor = {
  target: HTMLCanvasElement;
  position: Vector2;
};

type ApplicationState = {
  spritesheet?: HTMLImageElement;
  metadata?: SpriteAtlas;
  level?: Level;
  cursor?: Cursor;
  selectedTileIndex?: number;
};

type Layer = {
  name: string;
  collision: boolean;
  data: number[][];
};

type Level = {
  tileset: string;
  rows: number;
  columns: number;
  layers: Layer[];
};

type SpriteAtlas = {
  tilesheet: Tilesheet;
  tiles: Tile[];
};

type Tilesheet = {
  file: string;
  tileWidth: number;
  tileHeight: number;
  rows: number;
  columns: number;
};

type Tile = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type {
  ApplicationState,
  Layer,
  Level,
  NumberPair,
  SpriteAtlas,
  Tile,
  Tilesheet,
  Vector2,
};

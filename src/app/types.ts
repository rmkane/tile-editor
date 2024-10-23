type NumberPair = [number, number];

type Vector2 = { x: number; y: number };

type Cell = { row: number; column: number };

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
  dragStartPosition?: Cell;
  dragEndPosition?: Cell;
  selectedCells?: Cell[];
};

type Layer = {
  name: string;
  collision: boolean;
  data: number[][];
};

type Level = {
  name: string;
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
} & Entity;

type Entity = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type {
  ApplicationState,
  Cell,
  Entity,
  Layer,
  Level,
  NumberPair,
  SpriteAtlas,
  Tile,
  Tilesheet,
  Vector2,
};

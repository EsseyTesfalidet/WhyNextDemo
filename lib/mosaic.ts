export type TileZone = 'osu' | 'background';

export type MosaicTile = {
  index: number;
  row: number;
  col: number;
  zone: TileZone;
};

export const MOSAIC_COLS = 100;
export const MOSAIC_ROWS = 60;
export const MOSAIC_TOTAL = MOSAIC_COLS * MOSAIC_ROWS;

function between(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

function inO(x: number, y: number) {
  const cx = 0.21;
  const cy = 0.5;
  const outer = ((x - cx) / 0.12) ** 2 + ((y - cy) / 0.28) ** 2 <= 1;
  const inner = ((x - cx) / 0.06) ** 2 + ((y - cy) / 0.18) ** 2 <= 1;
  return outer && inner === false;
}

function inS(x: number, y: number) {
  const topBar = between(x, 0.41, 0.59) && between(y, 0.24, 0.31);
  const midBar = between(x, 0.43, 0.57) && between(y, 0.46, 0.53);
  const botBar = between(x, 0.41, 0.59) && between(y, 0.69, 0.76);

  const upperLeftStem = between(x, 0.41, 0.47) && between(y, 0.31, 0.46);
  const lowerRightStem = between(x, 0.53, 0.59) && between(y, 0.53, 0.69);

  // Rounded caps to avoid a blocky look.
  const topLeftCap = ((x - 0.44) / 0.045) ** 2 + ((y - 0.31) / 0.05) ** 2 <= 1 && y <= 0.36;
  const midRightCap = ((x - 0.56) / 0.04) ** 2 + ((y - 0.5) / 0.045) ** 2 <= 1;
  const botLeftCap = ((x - 0.44) / 0.045) ** 2 + ((y - 0.69) / 0.05) ** 2 <= 1 && y >= 0.64;

  return topBar || midBar || botBar || upperLeftStem || lowerRightStem || topLeftCap || midRightCap || botLeftCap;
}

function inU(x: number, y: number) {
  const leftStem = between(x, 0.72, 0.78) && between(y, 0.24, 0.7);
  const rightStem = between(x, 0.86, 0.92) && between(y, 0.24, 0.7);
  const base = ((x - 0.82) / 0.1) ** 2 + ((y - 0.7) / 0.12) ** 2 <= 1 && y >= 0.62;
  const innerCut = ((x - 0.82) / 0.045) ** 2 + ((y - 0.66) / 0.06) ** 2 <= 1;
  return (leftStem || rightStem || base) && innerCut === false;
}

function zoneFor(row: number, col: number, rows: number, cols: number): TileZone {
  const x = col / (cols - 1);
  const y = row / (rows - 1);

  if (inO(x, y) || inS(x, y) || inU(x, y)) {
    return 'osu';
  }
  return 'background';
}

export function buildMosaicMask(rows = MOSAIC_ROWS, cols = MOSAIC_COLS): MosaicTile[] {
  const tiles: MosaicTile[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      tiles.push({
        index,
        row,
        col,
        zone: zoneFor(row, col, rows, cols)
      });
    }
  }

  return tiles;
}

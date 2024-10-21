/**
 * @typedef {Object} ApplicationState
 * @property {HTMLImageElement} spritesheet
 * @property {SpriteAtlas} metadata
 * @property {Level} level
 */

/**
 * @typedef {Object} Layer
 * @property {string} name
 * @property {boolean} collision
 * @property {number[][]} data
 */

/**
 * @typedef {Object} Level
 * @property {string} tileset
 * @property {number} rows
 * @property {number} columns
 * @property {Layer[]} layers
 */

/**
 * @typedef {Object} SpriteAtlas
 * @property {Tilesheet} tilesheet
 * @property {Tile[]} tiles
 */

/**
 * @typedef {Object} Tilesheet
 * @property {string} file
 * @property {number} tileWidth
 * @property {number} tileHeight
 * @property {number} rows
 * @property {number} columns
 */

/**
 * @typedef {Object} Tile
 * @property {string} id
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

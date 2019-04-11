export const key = (x, y) => {
	return x + ',' + y
}
export const unkey = k => {
	return k.split(',').map(s => parseInt(s))
}

export function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function computeBitmaskWalls(x, y, blockedCells) {
	let sum = 0
	let above = `${x},${y - 1}`
	let below = `${x},${y + 1}`
	let left = `${x - 1},${y}`
	let right = `${x + 1},${y}`
	let ur = `${x + 1},${y - 1}`
	let ll = `${x - 1},${y + 1}`
	let ul = `${x - 1},${y - 1}`
	let lr = `${x + 1},${y + 1}`

	let blocked = coord => {
		return !(coord in blockedCells) || blockedCells[coord]
	}

	if (blocked(above)) sum += 2
	if (blocked(right)) sum += 16
	if (blocked(below)) sum += 64
	if (blocked(left)) sum += 8
	if (blocked(ul) && blocked(above) && blocked(left)) sum += 1
	if (blocked(ur) && blocked(above) && blocked(right)) sum += 4
	if (blocked(ll) && blocked(below) && blocked(left)) sum += 32
	if (blocked(lr) && blocked(below) && blocked(right)) sum += 128
	return sum
}

export const sumToTileIdMap = {
	2: 1,
	8: 2,
	10: 3,
	11: 4,
	16: 5,
	18: 6,
	22: 7,
	24: 8,
	26: 9,
	27: 10,
	30: 11,
	31: 12,
	64: 13,
	66: 14,
	72: 15,
	74: 16,
	75: 17,
	80: 18,
	82: 19,
	86: 20,
	88: 21,
	90: 22,
	91: 23,
	94: 24,
	95: 25,
	104: 26,
	106: 27,
	107: 28,
	120: 29,
	122: 30,
	123: 31,
	126: 32,
	127: 33,
	208: 34,
	210: 35,
	214: 36,
	216: 37,
	218: 38,
	219: 39,
	222: 40,
	223: 41,
	246: 36,
	248: 42,
	250: 43,
	251: 44,
	254: 45,
	255: 46,
	0: 47
}

// ╔═╗   ╦
// ║#║  ╠╬╣
// ╚═╝  ╞╩╡
export const unicodeBoxTiles = [
	['╦', '║', '═', '╝', '╝', '═', '╚', '╚'],
	['═', '╩', '╩', '╩', '═', '║', '║', '╗'],
	['╣', '╣', '╔', '╠', '╠', '╦', '╬', '╦'],
	['═', '╦', '╗', '╣', '║', '╦', '╠', '╠'],
	['╬', '╔', '╔', '╠', '║', '╦', '╬', '╬'],
	['╣', '╗', '═', '╩', '╚', '╝', '', '╬']
]

// 3D Effect
// export const unicodeBoxTiles = [
// 	//    0    1
// 	[' ', '╨', '╦', '╝', '╝', '╦', '╚', '╚'],
// 	//    7    8
// 	['╦', '╩', '╩', '╩', '╦', '╥', '║', '╗'],
// 	//    14   15
// 	['╣', '╣', '╔', '╠', '╠', '╦', ' ', ' '],
// 	//    21   22  23   24    25
// 	['╦', ' ', '╗', '╣', '║', '╦', ' ', ' '],
// 	['╬', '╔', '╔', '╠', '║', '╦', '╬', '!'],
// 	['╣', '╗', '═', '╩', '╚', '╝', ' ', ' ']
// ]
const flattenedUnixBoxTiles = unicodeBoxTiles.reduce((a, b) => a.concat(b))
export function sumToTile(sum) {
	return !(sumToTileIdMap[sum] in flattenedUnixBoxTiles) ? sum : flattenedUnixBoxTiles[sumToTileIdMap[sum]]
}

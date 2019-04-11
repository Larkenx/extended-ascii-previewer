<style>
html {
	overflow: auto;
	background-color: #303030;
}
</style>


<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Extended ASCII Previewer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-layout
        justify-space-between
        fill-height
      >
        <v-flex>
          <v-layout
            fill-height
            column
            wrap
          >
            <!-- The Game View -->
            <v-layout
              justify-start
              column
            >
              <PixiRenderer />
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-flex grow>
            <v-layout
              fill-height
              wrap
            >
              <!-- Map Generation Card -->
              <v-flex
                md12
                lg6
              >
                <MapGenerationPicker @generateMap="generateMap()" />
              </v-flex>
              <!-- Color Theme Card -->
              <v-flex
                md12
                lg6
              >
                <ColorThemePicker />
              </v-flex>
            </v-layout>
          </v-flex>
          <TilesetPicker />
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import ROT from 'rot-js'
import { mapState, mapMutations } from 'vuex'
import TilesetPicker from '@/components/TilesetPicker'
import PixiRenderer from '@/components/PixiRenderer'
import MapGenerationPicker from '@/components/MapGenerationPicker'
import ColorThemePicker from '@/components/ColorThemePicker'
import { SELECT_TILESET, SELECT_THEME, LOAD_TILESETS, LOAD_MAP, LOAD_THEMES } from '@/store'
import { computeBitmaskWalls, sumToTile, key, unkey, getRandomInt } from '@/assets/Utils'

const width = 50
const height = 50

class Glyph {
	constructor(character, fg = '#ffffff', bg = 'transparent') {
		this.character = character
		this.fg = fg.replace('#', '0x').toString(16)
		this.bg = bg
	}
}

export default {
	name: 'App',
	components: {
		TilesetPicker,
		PixiRenderer,
		MapGenerationPicker,
		ColorThemePicker
	},
	computed: mapState(['tilesets', 'map', 'selectedTileset', 'selectedMapGenerationTechnique', 'selectedColors', 'shouldBitmask']),
	watch: {
		shouldBitmask(newState, oldState) {
			this.createMapFromBlockedCells()
		},
		selectedColors(newState, oldState) {
			this.createMapFromBlockedCells()
		}
	},
	methods: {
		...mapMutations({
			loadTilesets: LOAD_TILESETS,
			loadMap: LOAD_MAP,
			loadThemes: LOAD_THEMES,
			selectTileset: SELECT_TILESET,
			selectTheme: SELECT_THEME
		}),
		getCharacter(x, y, map) {
			if (map[key(x, y)]) {
				if (this.shouldBitmask) {
					return sumToTile(computeBitmaskWalls(x, y, map))
				}
				return '#'
			} else if (!map[key(x, y)]) return '.'
		},
		generateMap() {
			let map = null
			let flipWalls = false
			if (this.selectedMapGenerationTechnique.includes('Digger')) {
				map = new ROT.Map.Digger(width, height)
			} else if (this.selectedMapGenerationTechnique.includes('Uniform')) {
				map = new ROT.Map.Uniform(width, height)
			} else if (this.selectedMapGenerationTechnique.includes('Rogue')) {
				map = new ROT.Map.Rogue(width, height)
			} else if (this.selectedMapGenerationTechnique.includes('Cellular')) {
				map = new ROT.Map.Cellular(width, height)
				map.randomize(0.5)
				flipWalls = true
				for (let i = 0; i < 4; i++) map.create()
				map.connect()
			} else if (this.selectedMapGenerationTechnique.includes('Divided Maze')) {
				map = new ROT.Map.DividedMaze(width, height)
			} else if (this.selectedMapGenerationTechnique.includes("Icey's")) {
				map = new ROT.Map.IceyMaze(width, height)
			} else if (this.selectedMapGenerationTechnique.includes("Eller's Perfect")) {
				map = new ROT.Map.EllerMaze(width, height)
			} else {
				map = new ROT.Map.Rogue(width, height)
			}
			this.blockedCells = {}
			let mapGeneratorCallback = (x, y, blocked) => {
				this.blockedCells[key(x, y)] = blocked || x >= width || y >= height
				if (flipWalls) {
					this.blockedCells[key(x, y)] = !this.blockedCells[key(x, y)]
				}
			}
			map.create(mapGeneratorCallback)
			this.createMapFromBlockedCells()
		},
		createMapFromBlockedCells() {
			let colors = {
				Black: '#090200',
				Blue: '#00a0e4',
				BrightBlack: '#5b5754',
				BrightBlue: '#7f7c7b',
				BrightCyan: '#ccab53',
				BrightGreen: '#3a3332',
				BrightMagenta: '#d6d4d3',
				BrightRed: '#e8bacf',
				BrightWhite: '#f7f7f7',
				BrightYellow: '#494542',
				Cyan: '#b5e4f4',
				Green: '#00a152',
				Magenta: '#a06994',
				Red: '#da2c20',
				White: '#a4a1a1',
				Yellow: '#fcec02'
			}
			if (this.selectedColors) {
				colors = { ...this.selectedColors }
			}
			let entities = [
				new Glyph('@', colors.Yellow),
				new Glyph('g', colors.Green),
				new Glyph('r', colors.Blue),
				new Glyph('t', colors.BrightGreen),
				new Glyph('b', colors.BrightMagenta),
				new Glyph('$', colors.Yellow),
				new Glyph('>', colors.BrightRed),
				new Glyph('<', colors.BrightRed),
				new Glyph('e', colors.Cyan),
				new Glyph('m', colors.Magenta),
				new Glyph('w', colors.Blue),
				new Glyph('j', colors.BrightCyan),
				new Glyph('!', colors.BrightMagenta),
				new Glyph('?', colors.BrightMagenta),
				new Glyph('[', colors.BrightGreen),
				new Glyph(')', colors.BrightGreen),
				new Glyph('%', colors.BrightRed)
			]
			let result = []
			let freeCells = []
			let entityPlacements = {}
			const popRandomElement = arr => {
				if (arr.length !== 0) {
					let index = getRandomInt(0, arr.length - 1)
					return arr.splice(index, 1)[0]
				}
			}

			for (let y = 0; y < height; y++) {
				result.push([])
				for (let x = 0; x < width; x++) {
					const blocked = this.blockedCells[key(x, y)]
					if (!blocked) {
						freeCells.push([x, y])
					}
					result[y].push(new Glyph(this.getCharacter(x, y, this.blockedCells), blocked ? colors.BrightWhite : colors.BrightBlack))
				}
			}

			while (freeCells.length > 0 && entities.length > 0) {
				let [x, y] = popRandomElement(freeCells)
				let entity = popRandomElement(entities)
				console.log(`Placing '${entity.character}' at ${x},${y}`)
				result[y][x] = entity
			}

			this.loadMap(result)
		}
	},
	created() {
		const api = window.origin.includes('localhost') ? 'http://localhost:5000' : window.origin
		axios
			.get(api + '/themes-and-tilesets')
			.then(response => {
				this.loadTilesets(response.data.tilesets)
				this.loadThemes(response.data.themes)
				this.selectTileset(response.data.tilesets.filter(ts => ts.name.includes('16x16-sb-ascii'))[0])
				// this.selectTheme(response.data.themes[0].name)
				this.selectTheme('Afterglow')

				this.generateMap()
			})
			.catch(error => {
				console.error(`Could not retrieve tilesets at this time: ${error}`)
			})
	},
	data() {
		return {
			blockedCells: {},
			selectedColorTheme: 'Black and White',
			possibleColorThemes: ['Black and White']
		}
	}
}
</script>

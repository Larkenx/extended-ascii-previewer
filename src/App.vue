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
                <v-layout
                  justify-start
                  fill-height
                  column
                >
                  <v-card
                    flat
                    class="ma-2"
                  >
                    <v-card-title class="grey darken-4">
                      <span class="title">Color Themes</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-container class="pa-0 ma-0">
                          <v-layout
                            justify-center
                            align-center
                            align-content-center
                          >
                            <v-flex>
                              <v-select
                                color="deep-orange darken-4"
                                v-model="selectedColorTheme"
                                :items="possibleColorThemes"
                                label="Color Themes (Reloads on selection)"
                              />
                            </v-flex>
                            <!-- <v-flex>
                              <v-btn color="deep-orange darken-4">Generate Map</v-btn>
                            </v-flex>-->
                          </v-layout>
                        </v-container>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-layout>
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
import { SELECT_TILESET, LOAD_TILESETS, LOAD_MAP } from '@/store'
import { computeBitmaskWalls, sumToTile, key, unkey } from '@/assets/Utils'

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
		MapGenerationPicker
	},
	computed: mapState(['tilesets', 'selectedTileset', 'map', 'selectedMapGenerationTechnique', 'shouldBitmask']),
	watch: {
		shouldBitmask(newState, oldState) {
			this.createMapFromBlockedCells()
		}
	},
	methods: {
		...mapMutations({
			loadTilesets: LOAD_TILESETS,
			selectTileset: SELECT_TILESET,
			loadMap: LOAD_MAP
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
			let result = []
			let playerPlaced = false
			for (let y = 0; y < height; y++) {
				result.push([])
				for (let x = 0; x < width; x++) {
					const blocked = this.blockedCells[key(x, y)]
					if (!blocked && !playerPlaced) {
						result[y].push(new Glyph('@', '#7FB069'))
						playerPlaced = true
						continue
					}

					result[y].push(new Glyph(this.getCharacter(x, y, this.blockedCells), blocked ? '#D36135' : '#ECE4B7'))
				}
			}
			this.loadMap(result)
		}
	},
	created() {
		const tilesetApi = window.origin.includes('localhost') ? 'http://localhost:5000' : window.origin
		axios
			.get(tilesetApi + '/tilesets')
			.then(response => {
				this.loadTilesets(response.data.tilesets)
				this.selectTileset(response.data.tilesets[0])
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

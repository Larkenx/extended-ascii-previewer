<style>
html {
	overflow: auto;
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
      <v-layout justify-space-around fill-height>
        <v-flex>
          <v-layout fill-height column>
            <!-- The Game View -->
            <v-layout justify-start column>
              <PixiRenderer/>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-flex grow>
            <v-layout fill-height wrap>
              <v-flex>
                <v-layout justify-start fill-height column>
                  <v-card flat class="ma-2">
                    <v-card-title class="grey darken-4">
                      <span class="title">Map Generation</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-container class="pa-0 ma-0">
                          <v-layout justify-space-between align-center align-content-center>
                            <v-flex>
                              <v-select
                                color="deep-orange darken-4"
                                v-model="selectedMapGenerationTechnique"
                                :items="possibleMapGenerationTechniques"
                                label="Map Generation Type"
                              />
                            </v-flex>
                            <v-flex>
                              <v-btn
                                @click.native="generateMap()"
                                color="deep-orange darken-4"
                              >Generate Map</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout justify-start fill-height column>
                  <v-card flat class="ma-2">
                    <v-card-title class="grey darken-4">
                      <span class="title">Color Themes</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-container class="pa-0 ma-0">
                          <v-layout justify-center align-center align-content-center>
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
          <TilesetPicker/>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import ROT from 'rot-js'
import { mapState, mapMutations } from 'vuex'
import TilesetPicker from './components/TilesetPicker'
import PixiRenderer from './components/PixiRenderer'
import { SELECT_TILESET, LOAD_TILESETS, LOAD_MAP } from '@/store'
import { computeBitmaskWalls, sumToTile, key, unkey } from '@/assets/Utils'

const width = 40
const height = 40

export default {
	name: 'App',
	components: {
		TilesetPicker,
		PixiRenderer
	},
	computed: mapState(['tilesets']),
	methods: {
		...mapMutations({
			loadTilesets: LOAD_TILESETS,
			selectTileset: SELECT_TILESET,
			loadMap: LOAD_MAP
		}),
		getCharacter(x, y, map) {
			if (map[key(x, y)]) return sumToTile(computeBitmaskWalls(x, y, map))
			else if (!map[key(x, y)]) return '.'
		},
		generateMap() {
			let map = null
			if (this.selectedMapGenerationTechnique.includes('Digger')) {
				map = new ROT.Map.Digger(width, height)
			} else if (this.selectedMapGenerationTechnique.includes('Uniform')) {
				map = new ROT.Map.Uniform(width, height)
			} else if (this.selectedMapGenerationTechnique.includes('Rogue')) {
				map = new ROT.Map.Rogue(width, height)
			} else {
				map = new ROT.Map.Uniform(width, height)
			}
			let blockedCells = {}
			let mapGeneratorCallback = (x, y, blocked) => {
				blockedCells[key(x, y)] = blocked || x >= width || y >= height
			}
			map.create(mapGeneratorCallback)
			let result = []
			let playerPlaced = false
			for (let y = 0; y < height; y++) {
				result.push([])
				for (let x = 0; x < width; x++) {
					const blocked = blockedCells[key(x, y)]
					if (!blocked && !playerPlaced) {
						result[y].push('@')
						playerPlaced = true
						continue
					}
					result[y].push(this.getCharacter(x, y, blockedCells))
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
			possibleMapGenerationTechniques: ['Uniform Dungeon', 'Digger Dungeon', 'Rogue Dungeon'],
			selectedMapGenerationTechnique: 'Uniform Dungeon',
			selectedColorTheme: 'Black and White',
			possibleColorThemes: ['Black and White']
		}
	}
}
</script>

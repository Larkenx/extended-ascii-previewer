<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Extended ASCII Previewer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-layout fill-height>
        <v-flex xs6>
          <v-layout
            align-center
            justify-center
          >
            <v-layout
              align-center
              justify-center
              column
            >
              <PixiRenderer />
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex>
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
import TilesetPicker from './components/TilesetPicker'
import PixiRenderer from './components/PixiRenderer'
import { SELECT_TILESET, LOAD_TILESETS, LOAD_MAP } from '@/store'
import { key, unkey } from '@/assets/Utils'

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
		generateMap() {
			let blockedMap = {}
			let map = new ROT.Map.Uniform(width, height)
			let mapGeneratorCallback = (x, y, blocked) => {
				blockedMap[key(x, y)] = blocked || x >= width || y >= height
			}
			map.create(mapGeneratorCallback)
			let result = []
			let playerPlaced = false
			for (let y = 0; y < height; y++) {
				result.push([])
				for (let x = 0; x < width; x++) {
					const blocked = blockedMap[key(x, y)]
					if (!blocked && !playerPlaced) {
						result[y].push('@')
						playerPlaced = true
					}
					result[y].push(blocked ? '#' : '.')
				}
			}

			return result
		}
	},
	created() {
		const tilesetApi = window.origin.includes('localhost') ? 'http://localhost:5000' : window.origin
		axios
			.get(tilesetApi + '/tilesets')
			.then(response => {
				this.loadTilesets(response.data.tilesets)
				this.selectTileset(response.data.tilesets[0])
				this.loadMap(this.generateMap())
			})
			.catch(error => {
				console.error(`Could not retrieve tilesets at this time: ${error}`)
			})
	},
	data() {
		return {}
	}
}
</script>

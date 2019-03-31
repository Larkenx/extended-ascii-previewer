<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Extended ASCII Previewer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-layout>
        <v-flex xs6>
          <v-layout align-center justify-center fill-height>
            <v-layout align-center justify-center column>
              <PixiRenderer/>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex xs6>
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
			let result = []
			for (let rows = 0; rows < height; rows++) {
				result.push([])
				for (let columns = 0; columns < width; columns++) {
					result[rows].push('#')
				}
			}
			let map = new ROT.Map.Uniform(width, height)
			let mapGeneratorCallback = (x, y, blocked) => {
				if (!blocked && x < width && y < height) result[y][x] = '.'
			}
			map.create(mapGeneratorCallback)
			console.log(result)
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

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
              <PixiRenderer :tilesets="tilesets"/>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex xs6>
          <TilesetPicker :tilesets="tilesets"/>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import TilesetPicker from './components/TilesetPicker'
import PixiRenderer from './components/PixiRenderer'
export default {
	name: 'App',
	components: {
		TilesetPicker,
		PixiRenderer
	},
	created() {
		const tilesetApi = window.origin.includes('localhost') ? 'http://localhost:5000' : window.origin
		axios
			.get(tilesetApi + '/tilesets')
			.then(response => {
				this.tilesets = response.data.tilesets
			})
			.catch(error => {
				console.error(`Could not retrieve tilesets at this time: ${error}`)
			})
	},
	data() {
		return {
			tilesets: []
		}
	}
}
</script>

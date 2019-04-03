<template>
  <v-layout wrap>
    <v-flex
      xs12
      md6
      lg4
      v-for="(tileset, index) in tilesets"
      :key="index"
    >
      <v-layout justify-center>
        <v-card
          class="ma-4"
          :elevation="tileset === selectedTileset ? 8 : 2"
        >
          <v-card-title class="orange darken-4">
            <v-layout align-content-center>
              <span class="title font-weight-light">{{formatFilename(tileset.name)}}</span>
              <v-spacer />
              <v-icon
                small
                v-if="tileset === selectedTileset"
                class="pl-2"
              >visibility</v-icon>

              <!-- <span
                style="background-color: #474747; margin: 2px; border-radius: 4px"
                v-if="tileset === selectedTileset"
              >
                <small class="white--text">
                  selected
                </small>
              </span> -->
            </v-layout>
          </v-card-title>
          <v-img
            class="ma-2"
            :src="tileset.url"
            :height="300"
            :width="300"
          />
          <v-card-actions>
            <v-btn
              color="orange darken-4"
              @click.native="selectTileset(tileset)"
              :disabled="tileset === selectedTileset"
            >
              Preview Tileset
            </v-btn>
            <v-spacer />
            <v-btn
              flat
              :href="tileset.url"
              download
            >
              Download
              <v-icon class="pl-2">get_app</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SELECT_TILESET } from '@/store'
import { setInterval } from 'timers'
export default {
	name: 'TilesetPicker',
	computed: mapState(['selectedTileset', 'tilesets']),
	methods: {
		...mapMutations({
			selectTileset: SELECT_TILESET
		}),
		formatFilename(s) {
			let beginFileExtension = s.lastIndexOf('.')
			let result = s.slice(0, beginFileExtension)
			let findDimensionPattern = /\d+x\d+/g
			result = result.replace(findDimensionPattern, '')
			return result.split('-').join(' ')
		}
	},
	mounted() {
		// cycle through all the tilesets
		// setInterval(() => {
		// 	if (this.tilesets) {
		// 		this.selectTileset(this.tilesets[this.selectedTilesetIndex])
		// 		this.selectedTilesetIndex++
		// 		if (this.tilesets.length <= this.selectedTilesetIndex) {
		// 			this.selectedTilesetIndex = 0
		// 		}
		// 	}
		// }, 500)
	},
	data() {
		return {
			selectedTilesetIndex: 0
		}
	}
}
</script>

<style>
body {
	background-color: aliceblue;
}
</style>

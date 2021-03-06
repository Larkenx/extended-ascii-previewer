<template>
  <v-layout
    justify-start
    column
  >
    <v-card
      flat
      class="ma-2"
      style="height: inherit"
    >
      <v-card-title class="grey darken-4">
        <span class="title">Tileset Picker</span>
      </v-card-title>

      <!-- Card Title & Search Controls  -->
      <v-card-text class="pa-2">
        <v-layout
          wrap
          justify-space-between
        >
          <v-flex xs12>
            <v-layout
              justify-center
              align-end
              align-content-end
              wrap
            >
              <v-flex
                xs12
                lg6
                class="pa-1"
              >
                <v-text-field
                  color="deep-orange darken-4"
                  label="Search"
                  append-icon="search"
                  v-model="searchName"
                />
              </v-flex>
              <!-- <v-flex
                xs6
                lg4
                class="pa-1"
              >
                <v-switch
                  class="ml-4 mb-4"
                  color="deep-orange darken-4"
                  v-model="squareRatioOnly"
                  hint="Square Fonts Only"
                  persistent-hint
                />
              </v-flex> -->
              <v-flex
                xs12
                lg6
                class="pa-1"
              >
                <v-select
                  color="deep-orange darken-4"
                  v-model="selectedDimensions"
                  :items="sortPossibleDimensions(filterPossibleDimensions(possibleDimensions))"
                  chips
                  label="Dimensions"
                  multiple
                  clearable
                ></v-select>
              </v-flex>

            </v-layout>
          </v-flex>
          <!--  List of Tilesets -->
          <v-flex xs12>
            <v-layout
              wrap
              style="overflow-y: scroll; max-height: 480px; min-height: 480px;"
            >
              <v-flex
                v-for="(tileset, index) in filterVisibleTilests(tilesets)"
                :key="index"
              >
                <v-layout justify-center>
                  <v-card
                    color="grey darken-4"
                    class="ma-1"
                    :elevation="tileset === selectedTileset ? 12 : 2"
                  >
                    <v-card-title class="deep-orange darken-4">
                      <v-layout align-content-center>
                        <span class="title font-weight-light">{{formatFilename(tileset.name)}}</span>
                        <v-spacer />
                        <v-icon
                          small
                          v-if="tileset === selectedTileset"
                          class="pl-2"
                        >visibility</v-icon>
                      </v-layout>
                    </v-card-title>
                    <v-img
                      class="ma-2"
                      :src="tileset.url"
                      :height="275"
                      :width="275"
                    />
                    <v-card-actions>
                      <v-btn
                        small
                        color="deep-orange darken-4"
                        @click.native="selectTileset(tileset)"
                        :disabled="tileset === selectedTileset"
                      >Preview Tileset</v-btn>
                      <v-spacer />
                      <v-btn
                        flat
                        small
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
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout fill-height>
          <v-layout
            column
            justify-end
          >
            <small>Showing {{filterVisibleTilests(tilesets).length}} of {{tilesets.length}} tilesets</small>
          </v-layout>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SELECT_TILESET } from '@/store'
import { setInterval } from 'timers'
export default {
	name: 'TilesetPicker',
	computed: mapState({
		selectedTileset: state => state.selectedTileset,
		tilesets: state => state.tilesets,
		possibleDimensions: state => [...new Set(state.tilesets.map(({ spriteWidth, spriteHeight }) => `${spriteWidth}x${spriteHeight}`))]
	}),
	methods: {
		...mapMutations({
			selectTileset: SELECT_TILESET
		}),
		formatFilename(s) {
			let beginFileExtension = s.lastIndexOf('.')
			let result = s.slice(0, beginFileExtension)
			let findDimensionPattern = /\d+x\d+/g
			result = result
				.replace(findDimensionPattern, '')
				.split('-')
				.join(' ')
			return result.length === 0 ? s : result
		},
		filterPossibleDimensions(dimensions) {
			if (this.squareRatioOnly) {
				return dimensions.filter(ts => {
					let [w, h] = ts.split('x')
					return w === h
				})
			}
			return dimensions
		},
		sortPossibleDimensions(dimensions) {
			return dimensions.sort((a, b) => {
				let [wa, ha] = a.split('x').map(n => parseInt(n))
				let [wb, hb] = b.split('x').map(n => parseInt(n))
				return wa - wb
			})
		},
		filterVisibleTilests(tilesets) {
			return tilesets.filter(({ spriteWidth, spriteHeight, name }) => {
				if (this.squareRatioOnly && spriteWidth !== spriteHeight) return false
				if (this.selectedDimensions.length !== 0) return this.selectedDimensions.includes(`${spriteWidth}x${spriteHeight}`)
				if (this.searchName.trim().length !== 0) return name.includes(this.searchName)
				return true
			})
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
			selectedTilesetIndex: 0,
			selectedDimensions: [],
			squareRatioOnly: false,
			searchName: ''
		}
	}
}
</script>

<style>
body {
	background-color: aliceblue;
}
</style>

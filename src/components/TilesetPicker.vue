<template>
  <v-layout
    fill-height
    justify-start
    column
  >
    <v-card
      flat
      height="800px"
      class="ma-4"
    >
      <v-card-title class="grey darken-4">
        <span class="title">Tileset Picker</span>
      </v-card-title>

      <!-- Card Title & Search Controls  -->
      <v-card-text>
        <v-layout
          wrap
          justify-space-between
        >
          <v-flex xs12>
            <v-form>
              <v-container class="pa-0 ma-0">
                <v-layout
                  justify-center
                  align-end
                  align-content-end
                >
                  <v-flex xs4>
                    <v-text-field
                      color="deep-orange darken-4"
                      label="Search"
                      append-icon="search"
                      v-model="searchName"
                    />
                  </v-flex>
                  <v-flex xs4>
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
                  <v-flex xs4>
                    <v-switch
                      class="ml-4 mb-4"
                      color="deep-orange darken-4"
                      v-model="squareRatioOnly"
                      label="Show only square ratio fonts"
                    />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-flex>
          <!--  List of Tilesets -->
          <v-flex xs12>
            <v-layout
              wrap
              style="overflow-y: scroll; max-height: 600px; min-height: 600px;"
            >
              <v-flex
                xs12
                md6
                lg4
                v-for="(tileset, index) in filterVisibleTilests(tilesets)"
                :key="index"
              >
                <v-layout justify-center>
                  <v-card
                    color="grey darken-4"
                    class="ma-4"
                    :elevation="tileset === selectedTileset ? 8 : 2"
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
                        color="deep-orange darken-4"
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
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout fill-height>
          <v-layout
            column
            justify-end
          >
            <small>
              Showing {{filterVisibleTilests(tilesets).length}} of {{tilesets.length}} tilesets
            </small>
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
		selectedTileset: state => state.selectTileset,
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

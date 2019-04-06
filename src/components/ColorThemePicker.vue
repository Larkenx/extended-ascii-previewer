<template>
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
              <v-flex xs6>
                <v-select
                  color="deep-orange darken-4"
                  @change="theme => selectTheme(theme)"
                  :input-value="selectedTheme"
                  v-model="selectedTheme"
                  :items="Object.keys(themes).sort()"
                  label="Color Themes"
                />
              </v-flex>
              <v-flex xs6>
                <v-layout>
                  <div
                    v-for="(color, index) in themeColors"
                    :style="{backgroundColor: color, width: '20px', height: '70px'}"
                    :key="index"
                  >
                    <!-- <v-layout
                      wrap
                      align-center
                    >
                      <v-flex
                        class="text-xs-center"
                        xs12
                        v-for="(color, index) in themeColors.reverse()"
                        :style="{color, fontSize: '5px', fontFamily: 'monospace'}"
                        :key="index"
                      >
                        @
                      </v-flex>
                    </v-layout> -->
                  </div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SELECT_THEME } from '@/store'
import { setInterval } from 'timers'

export default {
	name: 'ColorThemePicker',
	created() {
		// setInterval(() => {
		// 	if (this.possibleThemes) {
		// 		this.selectTheme(this.possibleThemes[this.currentThemeNameIndex])
		// 		this.currentThemeNameIndex++
		// 		if (this.possibleThemes.length <= this.currentThemeNameIndex) {
		// 			this.currentThemeNameIndex = 0
		// 		}
		// 	}
		// }, 500)
	},
	computed: mapState({
		selectedTheme: state => state.selectedTheme,
		themes(state) {
			return state.themes
		},
		themeColors: state => {
			let result = []
			if (state.themes && state.selectedTheme) {
				let colors = state.themes[state.selectedTheme]
				for (let name of Object.keys(colors).sort()) {
					result.push(colors[name])
				}
			}
			return result
		},
		possibleThemes(state) {
			return Object.keys(state.themes).sort()
		}
	}),
	methods: {
		...mapMutations({
			selectTheme: SELECT_THEME
		})
	},
	data() {
		return {
			currentThemeNameIndex: 0
		}
	}
}
</script>

<template>
  <v-layout
    justify-start
    fill-height
    column
  >
    <v-card
      flat
      class="ma-2"
      style="height: inherit"
    >
      <v-card-title class="grey darken-4">
        <span class="title">Map Generation</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container class="pa-0 ma-0">
            <v-layout
              wrap
              justify-space-between
              align-center
              align-content-center
            >
              <v-flex xs5>
                <v-select
                  color="deep-orange darken-4"
                  @change="state => selectMapGenerationTechnique(state)"
                  v-model="localTechnique"
                  :items="possibleMapGenerationTechniques"
                  label="Map Generation Type"
                />
              </v-flex>
              <v-flex xs5>
                <v-switch
                  color="deep-orange darken-4"
                  @change="(state) => toggleShouldBitmask(state)"
                  v-model="localMask"
                  label="Bitmasking"
                />
              </v-flex>
              <v-flex xs12>
                <v-layout justify-center>
                  <v-btn
                    small
                    block
                    @click.native="generateMap()"
                    color="deep-orange darken-4"
                    append-icon="map"
                  >Generate
                    <v-icon right>map</v-icon>
                  </v-btn>
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
import { SELECT_MAP_GENERATION_TECHNIQUE, TOGGLE_SHOULD_BITMASK } from '@/store'

export default {
	name: 'MapGenerationPicker',
	computed: mapState(['selectedMapGenerationTechnique', 'shouldBitmask']),
	methods: {
		...mapMutations({
			selectMapGenerationTechnique: SELECT_MAP_GENERATION_TECHNIQUE,
			toggleShouldBitmask: TOGGLE_SHOULD_BITMASK
		}),
		generateMap() {
			this.$emit('generateMap')
		},
		print(s) {
			console.log(s)
		}
	},
	data() {
		return {
			localMask: true,
			localTechnique: 'Uniform Dungeon',
			possibleMapGenerationTechniques: [
				'Uniform Dungeon',
				'Digger Dungeon',
				'Rogue Dungeon',
				'Cellular Automata',
				'Divided Maze',
				"Eller's Perfect Maze",
				"Icey's Maze"
			]
		}
	}
}
</script>

<style>
</style>

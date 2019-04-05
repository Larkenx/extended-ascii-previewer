import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const LOAD_TILESETS = 'LOAD_TILESETS'
export const LOAD_MAP = 'LOAD_MAP'
export const SELECT_TILESET = 'SELECT_TILESET'
export const SELECT_MAP_GENERATION_TECHNIQUE = 'SELECT_MAP_GENERATION_TECHNIQUE'
export const TOGGLE_SHOULD_BITMASK = 'TOGGLE_SHOULD_BITMASK'

export default new Vuex.Store({
	state: {
		selectedTileset: null,
		shouldBitmask: true,
		selectedMapGenerationTechnique: 'Uniform Dungeon',
		map: null,
		tilesets: []
	},
	mutations: {
		[LOAD_MAP](state, map) {
			state.map = map
		},
		[LOAD_TILESETS](state, tilesets) {
			state.tilesets = tilesets
		},
		[SELECT_TILESET](state, tileset) {
			state.selectedTileset = tileset
		},
		[SELECT_MAP_GENERATION_TECHNIQUE](state, technique) {
			state.selectedMapGenerationTechnique = technique
		},
		[TOGGLE_SHOULD_BITMASK](state, shouldBitmask) {
			state.shouldBitmask = shouldBitmask
		}
	}
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const LOAD_TILESETS = 'LOAD_TILESETS'
export const LOAD_MAP = 'LOAD_MAP'
export const SELECT_TILESET = 'SELECT_TILESET'

export default new Vuex.Store({
	state: {
		selectedTileset: null,
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
		}
	}
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const LOAD_TILESETS = 'LOAD_TILESETS'
export const LOAD_MAP = 'LOAD_MAP'
export const LOAD_THEMES = 'LOAD_THEMES'
export const SELECT_TILESET = 'SELECT_TILESET'
export const SELECT_THEME = 'SELECT_THEME'
export const SELECT_MAP_GENERATION_TECHNIQUE = 'SELECT_MAP_GENERATION_TECHNIQUE'
export const TOGGLE_SHOULD_BITMASK = 'TOGGLE_SHOULD_BITMASK'

export default new Vuex.Store({
	state: {
		selectedTileset: null,
		selectedTheme: null,
		selectedColors: null,
		selectedMapGenerationTechnique: 'Uniform Dungeon',
		shouldBitmask: true,
		map: null,
		tilesets: [],
		themes: {}
	},
	mutations: {
		[LOAD_MAP](state, map) {
			state.map = map
		},
		[LOAD_TILESETS](state, tilesets) {
			state.tilesets = tilesets
		},
		[LOAD_THEMES](state, themes) {
			for (let theme of themes) {
				let { name, ...colors } = theme
				state.themes[theme.name] = colors
			}
		},
		[SELECT_TILESET](state, tileset) {
			state.selectedTileset = tileset
		},
		[SELECT_MAP_GENERATION_TECHNIQUE](state, technique) {
			state.selectedMapGenerationTechnique = technique
		},
		[SELECT_THEME](state, name) {
			state.selectedTheme = name
			state.selectedColors = state.themes[state.selectedTheme]
		},
		[TOGGLE_SHOULD_BITMASK](state, shouldBitmask) {
			state.shouldBitmask = shouldBitmask
		}
	}
})

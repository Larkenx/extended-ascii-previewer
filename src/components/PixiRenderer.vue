<template>
  <div id="pixi_canvas"/>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { computeBitmaskWalls, sumToTile, key, unkey } from '@/assets/Utils'

// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const WIDTH = 800
const HEIGHT = 800

const app = new PIXI.Application({
	width: WIDTH,
	height: HEIGHT,
	antialias: true,
	backgroundColor: 0x000
})
// TODO: instantiate Pixi.js app/container outside of vue data context because we don't want reactive setters/getters on pixijs components themselves; pixi internal canvas
// rendering does not require us to track those changes (and furthermore would cause huge performance problems)
export default {
	name: 'PixiRenderer',
	mounted() {
		// When we mount this component, we want to register Pixi with a new HTML5 canvas...
		this.mountCanvas()
	},
	computed: mapState(['selectedTileset', 'tilesets', 'map']),
	watch: {
		tilesets(newState, oldState) {
			this.loadTilesets()
		},
		selectedTileset(newState, oldState) {
			console.log('Watching a new selected tileset', this.selectedTileset)
			if (this.loaded) this.renderMap()
		},
		map(newState, oldState) {
			if (this.loaded) this.renderMap()
		}
	},
	data() {
		return {
			textureMap: null,
			loaded: false
		}
	},
	methods: {
		mountCanvas() {
			document.getElementById('pixi_canvas').innerHTML = ''
			document.getElementById('pixi_canvas').appendChild(app.view)
		},
		loadTilesets() {
			if (this.tilesets) {
				PIXI.loader
					.add(this.tilesets)
					.on('progress', (loader, resource) => this.handleAssetLoad(loader, resource))
					.load((loader, resources) => {
						this.clear()
						this.generateTextures()
						this.renderMap()
						this.loaded = true
					})
			}
		},
		clear() {
			app.stage.removeChildren()
		},
		handleAssetLoad(loader, resource) {
			let { stage, renderer } = app
			this.clear()
			// let graphics = new PIXI.Graphics()
			let cx = stage.width / 2
			let cy = stage.height / 2
			// let barLength = renderer.width / 2
			let text = new PIXI.Text(`Loading ${resource.name}... ${Math.floor(loader.progress)}%`, {
				fill: 0xffffff,
				fontSize: 16,
				fontFamily: ['Source Code Pro', 'Menlo', 'Consolas'],
				x: cx,
				y: cy
			})
			stage.addChild(text)
		},
		getTilesetCoords(index, tileWidth, tileHeight, columns) {
			let rowNumber = Math.floor(index / columns) * tileHeight
			let colNumber = (index % columns) * tileWidth
			return [colNumber, rowNumber]
		},
		generateTextures() {
			this.textureMap = {}
			for (let tileset of this.tilesets) {
				const { spriteWidth, spriteHeight, name } = tileset
				// console.log(`Generating ${name}. ${spriteWidth}x${spriteHeight}`)
				this.textureMap[name] = {}
				for (let i = 0; i <= 255; i++) {
					const character = String.fromCharCode(i)
					const coords = this.getTilesetCoords(i, spriteWidth, spriteHeight, 16)
					const frame = new PIXI.Rectangle(coords[0], coords[1], spriteWidth, spriteHeight)
					const texture = new PIXI.Texture(PIXI.loader.resources[tileset.name].texture, frame)
					this.textureMap[name][character] = texture
				}
			}
		},
		getCharacter(x, y, map) {
			if (map[key(x, y)]) return sumToTile(computeBitmaskWalls(x, y, map))
			else if (!map[key(x, y)]) return '.'
		},
		renderMap() {
			if (this.selectedTileset && this.map) {
				/* Generate a hashmap of coordinate keys that tell us which coords are walls, and which are floors */
				let blockedCells = {}
				for (let y = 0; y < this.map.length; y++) {
					for (let x = 0; x < this.map[0].length; x++) {
						blockedCells[key(x, y)] = this.map[y][x] === '#'
					}
				}
				// Clear the screen
				this.clear()
				// Grab the width/height and name of the current tileset tiles
				const { spriteWidth, spriteHeight, name } = this.selectedTileset
				// Calculate scale (by width) of tiles so that it fills the screen properly
				let scale = WIDTH / (this.map[0].length * spriteWidth)
				let background = new PIXI.Container()
				for (let y = 0; y < this.map.length; y++) {
					for (let x = 0; x < this.map[0].length; x++) {
						const character = this.getCharacter(x, y, blockedCells)
						const texture = this.textureMap[name][character]
						console.log(`Drawing ${character}`, texture)
						let sprite = new PIXI.Sprite(texture)
						sprite.position.set(x * spriteWidth, y * spriteHeight)
						background.addChild(sprite)
					}
				}
				let staticBackground = new PIXI.Sprite(app.renderer.generateTexture(background))
				staticBackground.position.set(0, 0)
				app.stage.addChild(staticBackground)
				app.stage.scale.x = app.stage.scale.y = scale
			}
		}
	}
}
</script>



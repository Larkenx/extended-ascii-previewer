<template>
  <div id="pixi_canvas"/>
</template>

<script>
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
	width: 800,
	height: 600,
	antialias: true,
	backgroundColor: 0x474747
})
// TODO: instantiate Pixi.js app/container outside of vue data context because we don't want reactive setters/getters on pixijs components themselves; pixi internal canvas
// rendering does not require us to track those changes (and furthermore would cause huge performance problems)
export default {
	name: 'PixiRenderer',
	mounted() {
		// When we mount this component, we want to register Pixi with a new HTML5 canvas...
		this.mountCanvas()
	},
	props: {
		tilesets: Array,
		selectedTileset: Object,
		map: Array
	},
	watch: {
		tilesets(newState, oldState) {
			this.loadTilesets()
		},
		selectedTileset(newState, oldState) {
			this.renderMap()
		}
	},
	data() {
		return {
			textureMap: null
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
			let colNumber = (index % columns) * tileHeight
			return [colNumber, rowNumber]
		},
		generateTextures() {
			this.textureMap = {}
			for (let tileset of this.tilesets) {
				const { spriteWidth, spriteHeight, name } = tileset
				console.log(`Generating ${name}. ${spriteWidth}x${spriteHeight}`)
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
		renderMap() {
			this.clear()
			let background = new PIXI.Container()
			const { spriteWidth, spriteHeight, name } = this.selectedTileset
			for (let y = 0; y < this.map.length; y++) {
				for (let x = 0; x < this.map[0].length; x++) {
					const character = this.map[y][x]
					const texture = this.textureMap[character]
					let sprite = new PIXI.Sprite(texture)
					sprite.position.set(x * spriteWidth, y * spriteHeight)
					background.addChild(sprite)
				}
			}
			let staticBackground = new PIXI.Sprite(app.renderer.generateTexture(background))
			staticBackground.position.set(0, 0)
			app.stage.addChild(staticBackground)
		}
	}
}
</script>



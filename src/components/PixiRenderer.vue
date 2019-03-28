<template>
  <div id="pixi_canvas"/>
</template>

<script>
// TODO: instantiate Pixi.js app/container outside of vue data context because we don't want reactive setters/getters on pixijs components themselves; pixi internal canvas
// rendering does not require us to track those changes (and furthermore would cause huge performance problems)
export default {
	name: 'PixiRenderer',
	mounted() {
		// When we mount this component, we want to register Pixi with a new HTML5 canvas...
	},
	props: {
		width: Number,
		height: Number
	},
	methods: {
		mountCanvas() {
			document.getElementById('pixi_canvas').innerHTML = ''
			document.getElementById('pixi_canvas').appendChild(this.renderer.view)
		}
	}
}
</script>



<template>
  <v-flex>
    <v-layout wrap>
      <v-flex xs12 v-for="(tileset, index) in tilesets" :key="index">
        <v-layout justify-end>
          <v-card class="ma-4">
            <v-card-title class="orange darken-2">
              <span class="title font-weight-light">{{formatFilename(tileset.name)}}</span>
            </v-card-title>
            <v-img class="ma-2" :src="tileset.url" :height="300" :width="300"/>
            <v-card-actions>
              <v-btn color="orange darken-2">
                Preview
                <v-icon class="pl-2">visibility</v-icon>
              </v-btn>
              <v-spacer/>
              <v-btn flat>
                Download
                <v-icon class="pl-2">get_app</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
	name: 'TilesetPicker',
	props: {
		tilesets: Array
	},
	methods: {
		formatFilename(s) {
			let beginFileExtension = s.lastIndexOf('.')
			let result = s.slice(0, beginFileExtension)
			let findDimensionPattern = /\d+x\d+/g
			result = result.replace(findDimensionPattern, '')
			return result.split('-').join(' ')
		}
	}
}
</script>

<style>
</style>

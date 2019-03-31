import Vue from 'vue'
import store from './store'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	store
}).$mount('#app')

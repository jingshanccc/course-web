<template>
  <video-player
    ref="videoPlayer"
    class="vjs-custom-skin video-player-box"
    :options="playerOptions"
    :playsinline="true"

    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"

    @statechanged="playerStateChanged($event)"
    @ready="playerReadied"
  />
</template>
<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css' // 添加后才支持自适应宽高
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'Player',
  components: {
    videoPlayer
  },
  data() {
    return {
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
        }],
        poster: '/static/images/author.jpg'
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted() {
    console.log('this is current player instance object', this.player)
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>
<style>
</style>

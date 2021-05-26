<template>
  <video-player
    ref="videoPlayer"
    class="vjs-custom-skin video-player-box"
    :options="playerOptions"
    :playsinline="true"

    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"

    @statechanged="playerStateChanged($event)"
    @ready="playerReadied"
    @timeupdate="onPlayerTimeupdate($event)"
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
  props: {
    playerOptions: {
      type: Object,
      default: () => {
        return {
          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }],
          poster: '/static/images/author.jpg',
          startTime: 0
        }
      }
    },
    play: {
      type: Function,
      default: null
    },
    paused: {
      type: Function,
      default: null
    },
    ready: {
      type: Function,
      default: null
    },
    ended: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      curTime: 0
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
      // this.play()
    },
    onPlayerPause(player) {
      // this.paused()
      // console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      // console.log('player ended!', player)
      this.ended()
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      player.currentTime(this.playerOptions.startTime)
      // you can use it to do something...
      // player.[methods]
    },
    onPlayerTimeupdate(player) {
      this.curTime = player.cache_.currentTime
    }
  }
}
</script>
<style>
</style>

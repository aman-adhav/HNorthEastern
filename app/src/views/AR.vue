<template>
  <div id="app-ar-container">
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
    >
      <a-marker
        markerhandler
        emitevents="true"
        crossorigin="anonymous"
        cursor="fuse: false; rayOrigin: mouse"
        id="animated-marker"
        type="barcode"
        value="6"
      >
        <template v-for="marker in markers">
          <a-image
            :key="marker.id"
            :id="marker.id"
            :src="marker.logo_url"
            :url="marker.url"
            :position="`2.5 0 ${-3 + 1.5 * marker.id}`"
            rotation="-90 0 0"
            opacity="1"
            transparent="true"
            alpha-test="0.2"
            shader="standard"
            scale="1 1 1"
            visible=""
            material=""
            geometry=""
            crossOrigin="anonymous"
            width="1"
            height="1"
          ></a-image>
        </template>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  </div>
</template>

<style lang="scss">
#app-ar-container {
  width: 100%;
  height: 100%;
}
</style>

<script>
// import axios from "axios";

export default {
  data() {
    return {
      markers: [
        {
          id: 1,
          url: "https://github.com/dreamInCoDeforlife",
          logo_url:
            "https://dreamincodeforlife.github.io/AR-BusinessCard/img/github.png"
        },
        {
          id: 2,
          url: "https://www.youtube.com/",
          logo_url:
            "https://dreamincodeforlife.github.io/AR-BusinessCard/img/youtube.png"
        }
      ]
    };
  },
  mounted() {}
};
</script>

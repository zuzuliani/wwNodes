<template>
  <div class="my-element">
    <VueFlow v-model="elements" class="vue-flow-wrapper">
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script>
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

export default {
  components: {
    VueFlow,
    Background,
    Controls,
    MiniMap,
  },
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      elements: this.content.elements || [],
    }
  },
  watch: {
    'content.elements': {
      handler(newVal) {
        this.elements = newVal || [];
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.my-element {
  width: 100%;
  height: 500px;
  
  .vue-flow-wrapper {
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
  }
}
</style>

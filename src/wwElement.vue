<template>
  <div class="my-element">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :nodesDraggable="true"
      class="vue-flow-wrapper"
    >
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

export default {
  components: {
    VueFlow,
    Background,
    Controls,
    MiniMap,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
  },
  setup(props) {
    const initialElements = props.content.elements || [];
    const nodes = ref(initialElements.filter(el => !el.source && !el.target));
    const edges = ref(initialElements.filter(el => el.source && el.target));

    const { setValue: setElements } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "elements",
      type: "array",
      defaultValue: initialElements,
    });

    // Watch for any change in nodes or edges and update the exposed variable
    watch(
      [nodes, edges],
      () => {
        setElements([...nodes.value, ...edges.value]);
      },
      { deep: true }
    );

    onMounted(() => {
      setElements([...nodes.value, ...edges.value]);
    });

    return { nodes, edges };
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

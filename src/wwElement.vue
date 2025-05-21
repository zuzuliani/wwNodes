<template>
  <div class="my-element">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      @nodesChange="onNodesChange"
      @edgesChange="onEdgesChange"
      class="vue-flow-wrapper"
    >
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { VueFlow, applyNodeChanges, applyEdgeChanges } from '@vue-flow/core';
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
    const { value: elements, setValue: setElements } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "elements",
      type: "array",
      defaultValue: props.content.elements || [],
    });

    const nodes = ref(elements.value.filter(el => !el.source && !el.target));
    const edges = ref(elements.value.filter(el => el.source && el.target));

    watch(elements, (newElements) => {
      nodes.value = newElements.filter(el => !el.source && !el.target);
      edges.value = newElements.filter(el => el.source && el.target);
    });

    function onNodesChange(changes) {
      nodes.value = applyNodeChanges(changes, nodes.value);
      setElements([...nodes.value, ...edges.value]);
    }
    function onEdgesChange(changes) {
      edges.value = applyEdgeChanges(changes, edges.value);
      setElements([...nodes.value, ...edges.value]);
    }

    return { nodes, edges, onNodesChange, onEdgesChange };
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

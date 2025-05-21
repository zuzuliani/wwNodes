<template>
  <div class="my-element" @keydown="onKeyDown" tabindex="0">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :nodesDraggable="true"
      class="vue-flow-wrapper"
      @connect="onConnect"
      @selectionStart="onSelectionStart"
      @selectionEnd="onSelectionEnd"
    >
      <Background />
      <Controls />
      <MiniMap />
      <div v-if="hasSelection" class="delete-button" @click="deleteSelection">
        Delete Selected
      </div>
    </VueFlow>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
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
    const hasSelection = ref(false);

    const { setValue: setElements } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "elements",
      type: "array",
      defaultValue: initialElements,
    });

    // Handle keyboard events
    const onKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelection();
      }
    };

    // Handle selection events
    const onSelectionStart = () => {
      hasSelection.value = true;
    };

    const onSelectionEnd = () => {
      hasSelection.value = false;
    };

    // Delete selected elements
    const deleteSelection = () => {
      // Get selected nodes and edges
      const selectedNodes = nodes.value.filter(node => node.selected);
      const selectedEdges = edges.value.filter(edge => edge.selected);

      // Remove selected nodes and their connected edges
      if (selectedNodes.length > 0) {
        const nodeIds = selectedNodes.map(node => node.id);
        nodes.value = nodes.value.filter(node => !nodeIds.includes(node.id));
        edges.value = edges.value.filter(
          edge => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
        );
      }

      // Remove selected edges
      if (selectedEdges.length > 0) {
        const edgeIds = selectedEdges.map(edge => edge.id);
        edges.value = edges.value.filter(edge => !edgeIds.includes(edge.id));
      }

      hasSelection.value = false;
    };

    // Handle new edge connections
    const onConnect = (params) => {
      // Check if edge already exists
      const edgeExists = edges.value.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      
      if (edgeExists) {
        console.log('Edge already exists');
        return;
      }

      // Get source and target nodes
      const sourceNode = nodes.value.find(node => node.id === params.source);
      const targetNode = nodes.value.find(node => node.id === params.target);

      // Check if we're connecting from source to target
      if (sourceNode.type === 'output' || targetNode.type === 'input') {
        console.log('Invalid connection: Cannot connect from output to input');
        return;
      }

      const newEdge = {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
      };
      edges.value = [...edges.value, newEdge];
    };

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

    return { 
      nodes, 
      edges, 
      onConnect,
      onSelectionStart,
      onSelectionEnd,
      deleteSelection,
      hasSelection,
      onKeyDown
    };
  },
};
</script>

<style lang="scss" scoped>
.my-element {
  width: 100%;
  height: 500px;
  outline: none; /* Remove focus outline */
  
  .vue-flow-wrapper {
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
  }

  .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5;
    padding: 8px 16px;
    background: #ff4444;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);

    &:hover {
      background: #ff0000;
    }
  }
}
</style>

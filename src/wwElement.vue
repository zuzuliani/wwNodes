<template>
  <div class="my-element" @keydown="onKeyDown" tabindex="0" @drop="onCanvasDrop" @dragover.prevent>
    <button class="auto-layout-btn" @click="layoutGraph('LR')" style="position:absolute;top:24px;left:32px;z-index:30;">Auto Layout</button>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :nodesDraggable="true"
      class="vue-flow-wrapper"
      @connect="onConnect"
      @selectionStart="onSelectionStart"
      @selectionEnd="onSelectionEnd"
      :minZoom="0.25"
      @nodes-initialized="layoutGraph('LR')"
    >
      <template #node-start="props">
        <DefaultNode v-bind="props" @edit-click="onEditClick" />
      </template>
      <template #node-regular="props">
        <DefaultNode v-bind="props" @edit-click="onEditClick" />
      </template>
      <template #node-end="props">
        <DefaultNode v-bind="props" @edit-click="onEditClick" />
      </template>
      <Background ref="backgroundRef" />
      <Controls />
      <MiniMap />
      <div v-if="hasSelection" class="delete-button" @click="deleteSelection">
        Delete Selected
      </div>
    </VueFlow>
    <!-- Floating Add Button -->
    <div class="add-node-btn" @click="toggleNodePanel">
      <span :class="{ 'add-node-btn-icon': true, open: showNodePanel }">{{ showNodePanel ? '-' : '+' }}</span>
    </div>
    <!-- Node Type Popover -->
    <div v-if="showNodePanel" class="node-type-popover">
      <div class="node-type-popover-title">Add node</div>
      <div
        class="node-type-option start"
        draggable="true"
        @dragstart="onDragStart('start', $event)"
      >
        <NodePreview
          type="start"
          title="Start Node"
          description="Node de início apenas com uma saída"
          agent="Start Agent"
        />
      </div>
      <div
        class="node-type-option regular"
        draggable="true"
        @dragstart="onDragStart('regular', $event)"
      >
        <NodePreview
          type="regular"
          title="Regular Node"
          description="Node default com entrada e saída"
          agent="Agent"
        />
      </div>
      <div
        class="node-type-option end"
        draggable="true"
        @dragstart="onDragStart('end', $event)"
      >
        <NodePreview
          type="end"
          title="End Node"
          description="Node final apenas com entrada"
          agent="End Agent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import DefaultNode from './components/DefaultNode.vue';
import NodePreview from './components/NodePreview.vue';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import { useLayout } from './useLayout';
import { nextTick } from 'vue';

export default {
  components: {
    VueFlow,
    Background,
    Controls,
    MiniMap,
    DefaultNode,
    NodePreview,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    height: { type: Number, default: 500 },
  },
  setup(props, { emit }) {
    const initialElements = props.content.elements || [];
    const nodes = ref(initialElements.filter(el => !el.source && !el.target).map(node => ({
      ...node,
      // type is now 'start', 'regular', or 'end' from config
    })));
    const edges = ref(initialElements.filter(el => el.source && el.target));
    const hasSelection = ref(false);

    const { setValue: setElements } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "elements",
      type: "array",
      defaultValue: initialElements,
    });

    // Dropdown state
    const dropdown = ref({ visible: false, x: 0, y: 0 });

    // Ref for Background
    const backgroundRef = ref(null);

    // Add Node Panel state
    const showNodePanel = ref(false);
    const toggleNodePanel = () => {
      showNodePanel.value = !showNodePanel.value;
    };

    // Drag and drop logic
    const dragNodeType = ref(null);
    const onDragStart = (type, event) => {
      console.log('DRAG START', type);
      dragNodeType.value = type;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('nodeType', type);
      // Create a drag image using NodePreview
      const preview = document.createElement('div');
      preview.style.position = 'absolute';
      preview.style.top = '-1000px';
      preview.style.left = '-1000px';
      document.body.appendChild(preview);
      const app = Vue.createApp(NodePreview, {
        type,
        title: type === 'start' ? 'Start Node' : type === 'end' ? 'End Node' : 'Regular Node',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
        agent: type === 'start' ? 'Start Agent' : type === 'end' ? 'End Agent' : 'Agent',
      });
      const vm = app.mount(preview);
      event.dataTransfer.setDragImage(preview, 50, 30);
      setTimeout(() => {
        app.unmount();
        document.body.removeChild(preview);
      }, 0);
    };
    const onCanvasDrop = (event) => {
      console.log('DROP EVENT', event);
      const type = event.dataTransfer.getData('nodeType');
      console.log('DROP TYPE', type);
      if (!type) return;
      // Get drop position relative to canvas
      const bounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      console.log('EMIT PAYLOAD', { type, position });
      emit('trigger-event', { name: 'add-node-requested', event: { type, position } });
      showNodePanel.value = false;
    };

    // Handle right-click on canvas (background)
    const onCanvasRightClick = (e) => {
      console.log('Right click target:', e.target, e.target.className);
      dropdown.value = { visible: true, x: e.clientX, y: e.clientY };
      document.addEventListener('click', onDocumentClick);
    };

    // Handle dropdown option click
    const onDropdownOption = (type) => {
      emit('add-node-requested', { type, position: { x: dropdown.value.x, y: dropdown.value.y } });
      dropdown.value.visible = false;
      document.removeEventListener('click', onDocumentClick);
    };

    // Close dropdown on outside click
    const onDocumentClick = (e) => {
      dropdown.value.visible = false;
      document.removeEventListener('click', onDocumentClick);
    };

    onMounted(() => {
      if (backgroundRef.value && backgroundRef.value.$el) {
        backgroundRef.value.$el.addEventListener('contextmenu', onCanvasRightClick);
      }
    });
    onBeforeUnmount(() => {
      if (backgroundRef.value && backgroundRef.value.$el) {
        backgroundRef.value.$el.removeEventListener('contextmenu', onCanvasRightClick);
      }
      document.removeEventListener('click', onDocumentClick);
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

    // Watch for any change in nodes or edges and update the exposed variable
    watch(
      [nodes, edges],
      () => {
        setElements([...nodes.value, ...edges.value]);
      },
      { deep: true }
    );

    // Watch for external changes to elements and update nodes/edges accordingly
    watch(
      () => props.content.elements,
      (newElements) => {
        if (!newElements) return;
        nodes.value = newElements.filter(el => !el.source && !el.target).map(node => ({
          ...node,
        }));
        edges.value = newElements.filter(el => el.source && el.target);
      },
      { deep: true }
    );

    // Handle new edge connections
    const onConnect = (params) => {
      // Check if edge already exists
      const edgeExists = edges.value.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      if (edgeExists) {
        console.log('Edge already existss');
        return;
      }
      // Get source and target nodes
      const sourceNode = nodes.value.find(node => node.id === params.source);
      const targetNode = nodes.value.find(node => node.id === params.target);
      // Ensure both nodes exist before creating the edge
      if (!sourceNode || !targetNode) {
        console.warn('Cannot connect: source or target node does not exist');
        return;
      }
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

    onMounted(() => {
      setElements([...nodes.value, ...edges.value]);
    });

    const { layout } = useLayout();
    const { fitView } = useVueFlow();

    async function layoutGraph(direction = 'LR') {
      nodes.value = layout(nodes.value, edges.value, direction);
      nextTick(() => {
        fitView();
      });
    }

    const onEditClick = (nodeId) => {
      emit('trigger-event', { name: 'onEditClick', event: { nodeId } });
    };

    return { 
      nodes, 
      edges, 
      onConnect,
      onSelectionStart,
      onSelectionEnd,
      deleteSelection,
      hasSelection,
      onKeyDown,
      dropdown,
      onDropdownOption,
      backgroundRef,
      showNodePanel,
      toggleNodePanel,
      onDragStart,
      onCanvasDrop,
      layoutGraph,
      onEditClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-element {
  width: 100%;
  height: v-bind(height + 'px');
  outline: none; /* Remove focus outline */
  position: relative;
  
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

  /* Floating Add Node Button */
  .add-node-btn {
    position: absolute;
    top: 24px;
    right: 32px;
    z-index: 20;
    width: 48px;
    height: 48px;
    background: #ED8F55;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    cursor: pointer;
    transition: background 0.2s;
    border: none;

    span.add-node-btn-icon {
      position: relative;
      top: -2px;
      transition: color 0.2s;
      font-size: 1.5rem;
      user-select: none;
    }
  }
  .add-node-btn:hover {
    background: #FF4E27;
  }

  /* Node Type Popover */
  .node-type-popover {
    position: absolute;
    top: 80px;
    right: 32px;
    z-index: 30;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    padding: 0 10px 10px 10px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    animation: fadeIn 0.2s;
    align-items: center;
  }
  .node-type-option {
    background: none;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    cursor: grab;
    transition: background 0.15s;
    display: flex;
    justify-content: center;
  }
  .node-type-option:hover .default-node {
    box-shadow: 0 4px 24px rgba(25, 118, 210, 0.18);
    transform: scale(1.03);
  }
  .node-type-option .icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-block;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Edge styling */
  :deep(.vue-flow__edge-path) {
    stroke-width: 3px;
    stroke-dasharray: 10;  /* Makes the dots longer */
    stroke-dashoffset: 0;
    animation: flowAnimation 1s linear infinite;
  }

  @keyframes flowAnimation {
    from {
      stroke-dashoffset: 10;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Add a title to the palette */
  .node-type-popover-title {
    font-size: 15px;
    font-weight: 600;
    color: #222;
    margin: 12px 0 2px 0;
    text-align: left;
    width: 100%;
  }
}

.context-dropdown {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 140px;
}
.dropdown-option {
  padding: 10px 10px;
  cursor: pointer;
}
.dropdown-option:hover {
  background: #f0f0f0;
}

.auto-layout-btn {
  position: absolute;
  top: 24px;
  left: 32px;
  z-index: 30;
  padding: 0;
  background: none;
  color: #ED8F55;
  border: none;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
}
.auto-layout-btn:hover {
  text-decoration: underline;
  color: #FF4E27;
}
</style>

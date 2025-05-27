<template>
  <div class="default-node" :class="[nodeType, { selected: selected }]" v-bind="$attrs">
    <div class="node-header" :style="{ background: headerColor }">
      <span class="node-title">{{ title }}</span>
    </div>
    <div v-if="agent" class="node-agent">
      <span class="agent-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :fill="headerColor" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
        </svg>
      </span>
      <span class="agent-name">{{ agent }}</span>
    </div>
    <div class="node-content">
      <div class="node-description">{{ description }}</div>
    </div>
    <button class="edit-btn" @click="onEditClick">Editar</button>
    <Handle
      v-if="nodeType !== 'end'"
      type="source"
      position="right"
      :style="{ top: '50%' }"
    />
    <Handle
      v-if="nodeType !== 'start'"
      type="target"
      position="left"
      :style="{ top: '50%' }"
    />
  </div>
</template>

<script>
import { Handle } from '@vue-flow/core'

const NODE_COLORS = {
  start: '#ED8F55', // Blue
  regular: '#111', // Black
  end: '#FF4E27'   // Orange
}

export default {
  name: 'DefaultNode',
  components: {
    Handle
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'regular',
      validator: (value) => ['start', 'regular', 'end'].includes(value)
    },
    data: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        agent: ''
      })
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nodeType() {
      return this.data.type || this.type
    },
    title() {
      return this.data.title || ''
    },
    description() {
      return this.data.description || ''
    },
    agent() {
      return this.data.agent || ''
    },
    headerColor() {
      return NODE_COLORS[this.nodeType] || NODE_COLORS.regular
    }
  },
  methods: {
    onEditClick() {
      this.$emit('edit-click', this.id);
    }
  }
}
</script>

<style scoped>
.default-node {
  border: none;
  border-radius: 20px;
  background: #fff;
  width: 450px;
  min-width: 450px;
  max-width: 450px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  position: relative;
  padding-bottom: 24px;
  height: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

/* Selected state */
.default-node.selected {
  box-shadow: 0 0 0 3px #1976D2, 0 2px 12px rgba(0,0,0,0.15) !important;
  transform: scale(1.1) !important;
  z-index: 1000;
}

.node-header {
  /* background is set dynamically */
  color: #fff;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 16px 20px 10px 20px;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
}

.node-title {
  display: block;
  text-align: left;
}

.node-agent {
  display: flex;
  align-items: center;
  padding: 12px 20px 0 20px;
  font-size: 18px;
  color: #222;
  text-align: left;
}
.agent-icon {
  font-size: 22px;
  margin-right: 8px;
  display: flex;
  align-items: center;
}
.agent-name {
  font-weight: 500;
}

.node-content {
  padding: 10px 20px 0 20px;
  text-align: left;
}
.node-description {
  font-size: 16px;
  color: #222;
  margin-bottom: 16px;
  white-space: pre-line;
  word-break: break-word;
  text-align: left;
}

.edit-btn {
  display: block;
  margin: 0 auto 0 auto;
  padding: 8px 0;
  width: 90%;
  background: #fff;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  font-size: 18px;
  color: #222;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
  font-weight: 500;
}
.edit-btn:hover {
  background: #f5f5f5;
}

/* Handles positioning */
:deep(.vue-flow__handle) {
  z-index: 2;
  width: 15px;
  height: 15px;
  /* Center the handle on the edge */
  margin-top: 0px;
}
</style> 
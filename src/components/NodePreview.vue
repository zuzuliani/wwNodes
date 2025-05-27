<template>
  <div class="default-node" :class="nodeType">
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
  </div>
</template>

<script>
const NODE_COLORS = {
  start: '#ED8F55', // Blue
  regular: '#111', // Black
  end: '#FF4E27'   // Orange
}

export default {
  name: 'NodePreview',
  props: {
    type: {
      type: String,
      default: 'regular',
      validator: (value) => ['start', 'regular', 'end'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    agent: {
      type: String,
      default: ''
    }
  },
  computed: {
    nodeType() {
      return this.type;
    },
    headerColor() {
      return NODE_COLORS[this.nodeType] || NODE_COLORS.regular;
    }
  }
}
</script>

<style scoped>
.default-node {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  margin: 4px 0;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}

.node-header {
  color: #fff;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  padding: 10px 14px 6px 14px;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
}

.node-agent {
  display: flex;
  align-items: center;
  padding: 7px 14px 0 14px;
  font-size: 13px;
  color: #222;
  text-align: left;
}
.node-content {
  padding: 6px 14px 0 14px;
  text-align: left;
}
.node-description {
  font-size: 12px;
  color: #222;
  margin-bottom: 10px;
  white-space: pre-line;
  word-break: break-word;
  text-align: left;
}

/* NodePreview uses the same styles as DefaultNode, but does not import the Vue file. Duplicate or move shared styles to a CSS/SCSS file if needed. */
</style> 
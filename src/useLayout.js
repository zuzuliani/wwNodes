import dagre from 'dagre';

export function useLayout() {
  function layout(nodes, edges, direction = 'LR') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    // Use your node size (width/height)
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 450, height: 180 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - 225, // width / 2
        y: nodeWithPosition.y - 90,  // height / 2
      };
      return node;
    });
  }

  return { layout };
} 
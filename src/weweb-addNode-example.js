// currentNodes: your current array of nodes (not edges)
// type: the type of node to add ('start', 'regular', 'end')
// x, y: the position where the node should be added

const newNode = {
    id: String(Date.now()), // or use a UUID if you prefer
    type: type,
    data: {
      type: type,
      title: type === 'start' ? 'Start Node' : type === 'end' ? 'End Node' : 'Regular Node',
      description: type === 'start'
        ? 'Node de início apenas com uma saída'
        : type === 'end'
          ? 'Node final apenas com entrada'
          : 'Node default com entrada e saída',
      agent: type === 'start' ? 'Start Agent' : type === 'end' ? 'End Agent' : 'Agent'
    },
    position: { x, y }
  };
  
  return [...currentNodes, newNode];
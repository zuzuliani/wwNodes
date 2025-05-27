export default {
  editor: {
    label: {
      en: "wwNodes",
    },
  },
  properties: {
    textColor: {
      label: {
        en: "Text color",
      },
      type: "Color",
      defaultValue: "#F23636",
    },
    elements: {
      label: {
        en: "Flow Elements",
      },
      type: "Array",
      defaultValue: [
        {
          id: '1',
          type: 'start',
          data: {
            type: 'start',
            title: 'Start Node',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
            agent: 'Start Agent'
          },
          position: { x: 250, y: 25 },
        },
        {
          id: '2',
          type: 'regular',
          data: {
            type: 'regular',
            title: 'Regular Node',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
            agent: 'Agent'
          },
          position: { x: 100, y: 125 },
        },
        {
          id: '3',
          type: 'end',
          data: {
            type: 'end',
            title: 'End Node',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
            agent: 'End Agent'
          },
          position: { x: 250, y: 250 },
        },
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          animated: true,
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          animated: true,
        },
      ],
      bindable: true,
    },
  },
  triggerEvents: [
    {
      name: "onEditClick",
      label: { en: "On edit click" },
    },
    {
      name: "add-node-requested",
      label: { en: "On add node requested" },
    },
  ],
};

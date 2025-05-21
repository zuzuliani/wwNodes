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
          type: 'input',
          label: 'Input Node',
          position: { x: 250, y: 25 },
        },
        {
          id: '2',
          label: 'Default Node',
          position: { x: 100, y: 125 },
        },
        {
          id: '3',
          type: 'output',
          label: 'Output Node',
          position: { x: 250, y: 250 },
        },
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
        },
      ],
      bindable: true,
    },
  },
};

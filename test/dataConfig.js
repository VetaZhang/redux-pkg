export default [
  {
    key: 'count',
    defaultValue: 0,
    initialState: 'get',
    methods: [
      {
        funcName: 'addTen',
        funcBody: function() {
          this.set(this.value + 10);
        }
      }
    ],
    requests: [
      {
        funcName: 'get',
        method: 'get',
        url: '...',
        autoUpdateValue: false
      }
    ]
  }
];

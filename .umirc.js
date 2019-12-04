export default {
  treeShaking: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          immer: true,
        },
        antd: true,
        routes: {
          exclude: [/components\//, /hooks\//, /models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/],
        },
        locale: {},
        dynamicImport: {
          webpackChunkName: true,
        },
        dll: false,
        hardSource: false,
        pwa: false,
        hd: false,
        fastClick: false,
        title: 'my-smart-city',
      },
    ],
  ],
  history: 'hash',
  targets: {
    ie: 9,
  },
  theme: {
    '@border-radius-base': '2px',
    '@table-padding-vertical': '10px',
    '@table-padding-horizontal': '12px',
  },
  define: {
    'process.env.MANHOLE_COVER_STATE': [
      { state: 0, text: '正常', color: '#88ffaa', seq: 1 },
      { state: 1, text: '未安装', color: '#ffaa66', seq: 0 },
      { state: 2, text: '离线', color: '#dddddd', seq: 2 },
      { state: 3, text: '异常', color: '#ff6655', seq: 3 },
      { state: 4, text: '维护', color: '#fafc55', seq: 4 },
    ],
    'process.env.MAP_VIEW_STATE': {
      longitude: 114.0213,
      latitude: 22.5523,
      zoom: 12.5,
      bearing: 0,
      pitch: 0,
    },
  },
  extraBabelPlugins: [
    ['import', { libraryName: 'react-use', libraryDirectory: 'lib', camel2DashComponentName: false }],
  ],
};

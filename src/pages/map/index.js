import * as React from 'react';
import { StaticMap, _MapContext as MapContext } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
import { connect } from 'dva';
import { ManholeCoverLayer } from './components';

const { MAP_VIEW_STATE } = process.env;

const MIN_MAX_BOUNDS = [
  [113.8719, 22.5105],
  [114.1011, 22.6024],
];

const IndexPage = () => {
  const [viewState, setViewState] = React.useState({
    ...MAP_VIEW_STATE,
    minZoom: 12.5,
    maxZoom: 18,
  });

  const [controller] = React.useState({
    type: MapController,
    scrollZoom: !0,
    dragPan: !0,
    dragRotate: !0,
    doubleClickZoom: !1,
    touchZoom: !0,
    touchRotate: !0,
    keyboard: !0,
  });

  const handleWebGLInitialized = () => {
    document.getElementById('deckgl-wrapper').addEventListener('contextmenu', (evt) => evt.preventDefault());
  };

  const handleViewStateChange = ({ viewState }) => {
    if (viewState['longitude'] < MIN_MAX_BOUNDS[0][0]) {
      viewState['longitude'] = MIN_MAX_BOUNDS[0][0];
    }
    if (viewState['latitude'] < MIN_MAX_BOUNDS[0][1]) {
      viewState['latitude'] = MIN_MAX_BOUNDS[0][1];
    }
    if (viewState['longitude'] > MIN_MAX_BOUNDS[1][0]) {
      viewState['longitude'] = MIN_MAX_BOUNDS[1][0];
    }
    if (viewState['latitude'] > MIN_MAX_BOUNDS[1][1]) {
      viewState['latitude'] = MIN_MAX_BOUNDS[1][1];
    }
    setViewState((oldViewState) => ({ ...oldViewState, ...viewState }));
  };

  return (
    <DeckGL
      ContextProvider={MapContext.Provider}
      viewState={viewState}
      controller={controller}
      onWebGLInitialized={handleWebGLInitialized}
      onViewStateChange={handleViewStateChange}
    >
      <StaticMap
        preventStyleDiffing={!1}
        reuseMaps={!0}
        mapStyle={require('@/assets/style.json')}
        onError={() => {}}
      ></StaticMap>

      <ManholeCoverLayer
        id="manhole-cover-layer"
        pickable={!0}
        autoHighlight={!0}
        data={require('@/assets/manhole-cover.json')}
        opacity={1}
      ></ManholeCoverLayer>
    </DeckGL>
  );
};

function mapStateToProps({ loading: { global: loading } }) {
  return { loading };
}

export default connect(mapStateToProps)(IndexPage);

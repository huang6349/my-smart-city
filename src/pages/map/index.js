import * as React from 'react';
import { StaticMap, _MapContext as MapContext } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
import { useIdle } from 'react-use';
import { connect } from 'dva';
import { PageContext, ManholeCoverLayer, PipesLayer, TripsAnimationLayer } from './components';
import { useRotateCamera } from './hooks';

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

  const { parentViewState, map, setMap, isUnderground } = React.useContext(PageContext);

  React.useEffect(() => {
    setViewState((viewState) => ({ ...viewState, ...parentViewState }));
  }, [parentViewState]);

  const isIdle = useIdle(1000 * 60 * 5, !1);

  const [rotateCameraViewState] = useRotateCamera({
    viewState,
    disable: isIdle,
  });

  React.useEffect(() => {
    setViewState((viewState) => ({ ...viewState, ...rotateCameraViewState }));
  }, [rotateCameraViewState]);

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
      pickingRadius={3}
      viewState={viewState}
      controller={controller}
      onWebGLInitialized={handleWebGLInitialized}
      onViewStateChange={handleViewStateChange}
    >
      <StaticMap
        preventStyleDiffing={!1}
        reuseMaps={!0}
        mapStyle={require('@/assets/style.json')}
        onLoad={({ target }) => setMap(target)}
        onError={() => {}}
      ></StaticMap>

      <ManholeCoverLayer
        id="manhole-cover-layer"
        pickable={!0}
        autoHighlight={!0}
        data={require('@/assets/manhole-cover.json')}
        opacity={1.0}
        visible={map && !isUnderground}
      />

      <PipesLayer
        id="pipes-layer"
        pickable={!0}
        autoHighlight={!0}
        data={require('@/assets/pipes.json')}
        opacity={0.85}
        visible={map && isUnderground}
      />

      <TripsAnimationLayer
        id="trips-layer"
        data={require('@/assets/trip.json')}
        opacity={0.3}
        visible={map && !isUnderground}
        widthMinPixels={2}
        rounded={!0}
        trailLength={280}
        shadowEnabled={!1}
      />
    </DeckGL>
  );
};

function mapStateToProps({ loading: { global: loading } }) {
  return { loading };
}

export default connect(mapStateToProps)(IndexPage);

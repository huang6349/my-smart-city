import * as React from 'react';
import { connect } from 'dva';
import { FlyToInterpolator } from '@deck.gl/core';
import * as d3 from 'd3-ease';
import { usePerformanceMonitor } from '@/hooks';
import { PageContext, MidRightBar } from './components';
import styles from './_layout.css';

const { MAP_VIEW_STATE } = process.env;

const LayoutPage = function({ children }) {
  const [viewState, setViewState] = React.useState({});

  const [map, setMap] = React.useState(null);

  const [isUnderground, setIsUnderground] = React.useState(!1);

  React.useLayoutEffect(() => {
    setViewState(() => ({
      ...MAP_VIEW_STATE,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    }));
  }, [isUnderground]);

  const [isScan, setIsScan] = React.useState(!1);

  const [fps] = usePerformanceMonitor();

  const handleHomeClick = () => {
    setViewState((viewState) => ({
      ...viewState,
      ...MAP_VIEW_STATE,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    }));
  };

  return (
    <PageContext.Provider value={{ parentViewState: viewState, map, setMap, isUnderground, isScan }}>
      <MidRightBar>
        <MidRightBar.HomeControl loading={!map} onClick={handleHomeClick} />
        <MidRightBar.UndergroundControl
          loading={!map}
          isUnderground={isUnderground}
          map={map}
          onClick={(isUnderground) => setIsUnderground(isUnderground)}
        />
        <MidRightBar.ScanControl
          loading={!map}
          isScan={isScan && !isUnderground}
          map={map}
          onClick={(isScan) => setIsScan(isScan)}
        />
        <MidRightBar.ScreenfullControl loading={!map} />
      </MidRightBar>
      <React.Fragment>{children}</React.Fragment>
      <div className={styles['monitor']}>{fps}</div>
    </PageContext.Provider>
  );
};

function mapStateToProps({ loading: { global: loading } }) {
  return { loading };
}

export default connect(mapStateToProps)(LayoutPage);

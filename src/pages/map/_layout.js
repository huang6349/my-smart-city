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

  const [fps] = usePerformanceMonitor();

  const handleHomeClick = () => {
    setViewState(() => ({
      ...MAP_VIEW_STATE,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    }));
  };

  return (
    <PageContext.Provider value={{ parentViewState: viewState }}>
      <MidRightBar>
        <MidRightBar.HomeControl onClick={handleHomeClick} />
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

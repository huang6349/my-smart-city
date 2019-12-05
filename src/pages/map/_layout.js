import * as React from 'react';
import { connect } from 'dva';
import { FlyToInterpolator } from '@deck.gl/core';
import * as d3 from 'd3-ease';
import { PageContext, MidRightBar } from './components';

const { MAP_VIEW_STATE } = process.env;

const LayoutPage = function({ children }) {
  const [viewState, setViewState] = React.useState({});

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
    </PageContext.Provider>
  );
};

function mapStateToProps({ loading: { global: loading } }) {
  return { loading };
}

export default connect(mapStateToProps)(LayoutPage);

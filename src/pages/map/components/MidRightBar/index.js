import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';
import { useMap } from 'react-use';
import { MidRightBarContext } from './context';
import HomeControl from './HomeControl';
import UndergroundControl from './UndergroundControl';
import ScanControl from './ScanControl';
import ScreenfullControl from './ScreenfullControl';
import style from './index.css';

export default function MidRightBarView({ visible, children }) {
  const [drawer, drawerControl] = useMap({});

  return (
    <MidRightBarContext.Provider value={{ drawer, drawerControl }}>
      <div className={classNames(style['layout'], { hide: !visible })}>{children}</div>
    </MidRightBarContext.Provider>
  );
}

MidRightBarView.propTypes = {
  visible: PropTypes.bool,
};

MidRightBarView.defaultProps = {
  visible: !0,
};

MidRightBarView.HomeControl = HomeControl;
MidRightBarView.UndergroundControl = UndergroundControl;
MidRightBarView.ScanControl = ScanControl;
MidRightBarView.ScreenfullControl = ScreenfullControl;

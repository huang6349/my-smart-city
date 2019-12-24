import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useToggle } from 'react-use';
import { Button, Tooltip } from 'antd';
import screenfull from 'screenfull';

export default function ScreenfullControl({ loading }) {
  const [on, toggle] = useToggle(screenfull.isFullscreen);

  React.useEffect(() => {
    screenfull.onchange(() => toggle(screenfull.isFullscreen));
  }, []);

  return (
    <Tooltip title={`${on ? '退出' : '进入'}全屏模式`} placement="left">
      <Button
        icon={on ? 'fullscreen-exit' : 'fullscreen'}
        loading={loading}
        shape="circle"
        type="primary"
        onClick={() => screenfull.isEnabled && screenfull.toggle()}
      />
    </Tooltip>
  );
}

ScreenfullControl.propTypes = {
  loading: PropTypes.bool.isRequired,
};

ScreenfullControl.defaultProps = {
  loading: !1,
};

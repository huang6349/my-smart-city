import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';

export default function HomeControlView({ loading, onClick }) {
  return (
    <Tooltip title="回到默认位置" placement="left">
      <Button icon="home" loading={loading} shape="circle" type="primary" onClick={onClick} />
    </Tooltip>
  );
}

HomeControlView.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

HomeControlView.defaultProps = {
  loading: !1,
};

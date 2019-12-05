import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';
import { Button, Tooltip } from 'antd';
import style from './index.css';

export default function UndergroundControlView({ loading, isUnderground, map, onClick }) {
  React.useEffect(() => {
    if (!map || !isUnderground) return;
    const opacitys = map.getStyle()['layers'].map(({ id, type }) => {
      if (type === 'symbol') type = 'text';
      return {
        id,
        type,
        color: map.getPaintProperty(id, `${type}-color`),
        opacity: map.getPaintProperty(id, `${type}-opacity`) || 1,
      };
    });
    opacitys.forEach(({ id, type, opacity }) => {
      if (id === 'background') {
        map.setPaintProperty('background', 'background-color', 'rgba(0, 0, 0, 1)');
      } else if (type === 'text' || type === '3d-buildings') {
        map.setPaintProperty(id, `${type}-opacity`, 0);
      } else {
        map.setPaintProperty(id, `${type}-opacity`, opacity * 0.2625);
      }
    });
    return () => {
      opacitys.forEach(({ id, type, color, opacity }) => {
        if (id === 'background') {
          map.setPaintProperty('background', 'background-color', color);
        } else {
          map.setPaintProperty(id, `${type}-opacity`, opacity);
        }
      });
    };
  }, [isUnderground, map]);

  return (
    <Tooltip title={`进入${!isUnderground ? '地下模式' : '地上模式'}`} placement="left">
      <Button
        className={classNames(style['btn'], { [style['up']]: isUnderground })}
        icon={'vertical-align-bottom'}
        loading={loading}
        shape="circle"
        type="primary"
        onClick={() => {
          typeof onClick === 'function' && onClick(!isUnderground);
        }}
      />
    </Tooltip>
  );
}

UndergroundControlView.propTypes = {
  loading: PropTypes.bool.isRequired,
  isUnderground: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onChange: PropTypes.func,
};

UndergroundControlView.defaultProps = {
  loading: !1,
  isUnderground: !1,
};

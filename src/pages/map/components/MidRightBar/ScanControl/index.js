import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useMap } from 'react-use';
import { Button, Tooltip } from 'antd';
import * as turf from '@turf/turf';
import { IconFont } from '@/components';

export default function ScanControlView({ loading, isScan, map, onClick }) {
  const [{ features }, { set }] = useMap({ radius: 0.0 });

  React.useEffect(() => {
    if (!map) return;
    const center = turf.point([114.0213, 22.5523]);
    const features = map.querySourceFeatures('buildings', { sourceLayer: 'buildings' }).map((feature) => ({
      id: feature['id'],
      distance: turf.distance(center, turf.center(feature)),
    }));
    set('features', features);
    return () => set('features', []);
  }, [map]);

  React.useLayoutEffect(() => {
    if (!map || !features || !isScan) return;
    const fn = (id, highlighted) => {
      map.setFeatureState({ id, source: 'buildings', sourceLayer: 'buildings' }, { highlighted });
    };

    const speedFactor = 25;
    let animation;
    let startTime = 0;
    let radius = 0.0;
    let filter = [];

    const updateFrame = (timestamp) => {
      const progress = timestamp - startTime;
      if (progress > speedFactor) {
        startTime = timestamp;
        filter.forEach(({ id }) => fn(id, !1));
        filter = features.filter(({ distance }) => distance < radius && distance > radius - 0.1);
        filter.forEach(({ id }) => fn(id, !0));
        radius = radius >= 10.0 ? 0.0 : radius + 0.2;
      }
      animation = requestAnimationFrame(updateFrame);
    };
    animation = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animation);
      filter.forEach(({ id }) => fn(id, !1));
    };
  }, [map, features, isScan]);

  return (
    <Tooltip title={`${!isScan ? '开启' : '关闭'}建筑扫描`} placement="left">
      <Button
        loading={loading}
        shape="circle"
        type="primary"
        onClick={() => {
          typeof onClick === 'function' && onClick(!isScan);
        }}
      >
        {!loading && <IconFont type="icon-saomiao" spin={isScan} />}
      </Button>
    </Tooltip>
  );
}

ScanControlView.propTypes = {
  loading: PropTypes.bool.isRequired,
  isScan: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onChange: PropTypes.func,
};

ScanControlView.defaultProps = {
  loading: !1,
  isScan: !1,
};

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useList } from 'react-use';
import { Button, Tooltip } from 'antd';
import * as turf from '@turf/turf';
import { IconFont } from '@/components';

export default function ScanControlView({ loading, isScan, map, onClick }) {
  const [scanFeatures, { set }] = useList([]);

  React.useLayoutEffect(() => {
    if (!map || !isScan) return;

    const center = turf.point([114.0213, 22.5523]);
    const features = map.querySourceFeatures('buildings', { sourceLayer: 'buildings' }).map((feature) => ({
      id: feature['id'],
      distance: turf.distance(center, turf.center(feature)),
    }));
    const speedFactor = 30;
    let animation;
    let startTime = 0;
    let radius = 0.0;

    const startAnimation = (timestamp) => {
      const progress = timestamp - startTime;
      if (progress > speedFactor) {
        startTime = timestamp;
        set(features.filter(({ distance }) => distance < radius && distance > radius - 0.1));
        radius = radius >= 10.0 ? 0.0 : radius + 0.2;
      }
      animation = requestAnimationFrame(startAnimation);
    };
    startTime = performance.now();
    startAnimation(startTime);

    return () => {
      cancelAnimationFrame(animation);
      set([]);
    };
  }, [isScan, map]);

  React.useEffect(() => {
    if (!map) return;
    scanFeatures.forEach(({ id }) => {
      map.setFeatureState({ id, source: 'buildings', sourceLayer: 'buildings' }, { highlighted: !0 });
    });
    return () => {
      scanFeatures.forEach(({ id }) => {
        map.setFeatureState({ id, source: 'buildings', sourceLayer: 'buildings' }, { highlighted: !1 });
      });
    };
  }, [scanFeatures, map]);

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

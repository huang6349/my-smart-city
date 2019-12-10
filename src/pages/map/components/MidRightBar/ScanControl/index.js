import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useMap } from 'react-use';
import { Button, Tooltip } from 'antd';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import reduce from 'lodash/reduce';
import * as turf from '@turf/turf';
import { IconFont } from '@/components';

export default function ScanControlView({ loading, isScan, map, onClick }) {
  const [{ features }, { set }] = useMap({});

  React.useEffect(() => {
    if (!map) return;
    const center = turf.point([114.0213, 22.5523]);
    const features = map.querySourceFeatures('buildings', { sourceLayer: 'buildings' }).map((feature) => ({
      id: feature['id'],
      distance: Number(turf.distance(center, turf.center(feature)).toFixed(2)),
    }));
    const fn = (result, feature, distance) => {
      result.push({ distance: Number(distance), ids: feature.map(({ id }) => id) });
    };
    set('features', transform(groupBy(features, 'distance'), fn, []));
    return () => set('features', []);
  }, [map]);

  React.useLayoutEffect(() => {
    if (!map || !features || !isScan) return;
    const fn = (id, highlighted) => {
      map.setFeatureState({ id, source: 'buildings', sourceLayer: 'buildings' }, { highlighted });
    };

    const speedFactor = 30;
    let animation;
    let startTime = 0;
    let radius = 0.0;
    let objs = {};

    const updateFrame = (timestamp) => {
      const progress = timestamp - startTime;
      if (progress > speedFactor) {
        startTime = timestamp;
        objs[radius] && objs[radius].forEach((id) => fn(id, !1));
        radius = Number((radius >= 10.0 ? 0.0 : radius + 0.2).toFixed(2));
        if (!objs[radius]) {
          const filter = features.filter(({ distance }) => distance < radius && distance > radius - 0.1);
          objs[radius] = reduce(filter, (result, { ids }) => [...result, ...ids], []);
        }
        objs[radius].forEach((id) => fn(id, !0));
      }
      animation = requestAnimationFrame(updateFrame);
    };
    animation = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animation);
      objs[radius] && objs[radius].forEach((id) => fn(id, !1));
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

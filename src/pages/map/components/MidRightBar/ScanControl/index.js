import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useMap, useGetSetState } from 'react-use';
import { Button, Tooltip } from 'antd';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import reduce from 'lodash/reduce';
import * as turf from '@turf/turf';
import { Tween } from 'es6-tween';
import { IconFont } from '@/components';

export default function ScanControlView({ loading, isScan, map, onClick }) {
  const [state, setState] = useGetSetState({ objs: {} });
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

    const objs = state()['objs'] || {};
    let prevRadius = 0.0;

    const tween = new Tween({ radius: 0.0 });
    tween.to({ radius: 10.0 }, 1200);
    tween.repeat(Infinity);
    tween.yoyo(!1);
    tween.on('update', ({ radius }) => {
      const currRadius = radius.toFixed(2);
      objs[prevRadius] && objs[prevRadius].forEach((id) => fn(id, !1));
      prevRadius = currRadius;
      if (!objs[currRadius]) {
        const filter = features.filter(({ distance }) => distance < currRadius && distance > currRadius - 0.1);
        objs[currRadius] = reduce(filter, (result, { ids }) => [...result, ...ids], []);
      }
      objs[currRadius].forEach((id) => fn(id, !0));
    });
    tween.restart();

    return () => {
      tween.stop();
      setState({ objs });
      objs[prevRadius] && objs[prevRadius].forEach((id) => fn(id, !1));
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

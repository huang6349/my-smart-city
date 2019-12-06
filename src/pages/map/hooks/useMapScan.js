import * as React from 'react';
import { useList } from 'react-use';
import * as turf from '@turf/turf';

const useMapScan = function({ map }) {
  const [center] = React.useState([114.0213, 22.5523]);

  const [scanFeatures, { set }] = useList([]);

  React.useLayoutEffect(() => {
    if (!map) return;

    const features = map.querySourceFeatures('buildings', { sourceLayer: 'buildings' }).map((feature) => ({
      id: feature['id'],
      distance: turf.distance(turf.point(center), turf.center(feature)),
    }));
    const speedFactor = 20;
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
  }, [map]);

  React.useEffect(() => {
    if (!map) return;

    scanFeatures.forEach(({ id }) => {
      map.setFeatureState(
        {
          id: id,
          source: 'buildings',
          sourceLayer: 'buildings',
        },
        { highlighted: true }
      );
    });
    return () => {
      scanFeatures.forEach(({ id }) => {
        map.setFeatureState(
          {
            id: id,
            source: 'buildings',
            sourceLayer: 'buildings',
          },
          { highlighted: false }
        );
      });
    };
  }, [scanFeatures, map]);
};

export default useMapScan;

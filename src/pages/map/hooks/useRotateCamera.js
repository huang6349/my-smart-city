import * as React from 'react';
import { useGetSet } from 'react-use';

const useRotateCamera = function({ viewState, speed = 5, mode = 'default', disable }) {
  const [rotateViewState, setRotateViewState] = React.useState({});
  const [getDirection, setDirection] = useGetSet(!0);

  React.useEffect(() => {
    if (!disable) return;

    const speedFactor = 15;
    let animation;
    let startTime = 0;

    let { bearing = 0 } = viewState;

    const rotateCamera = (timestamp) => {
      const progress = timestamp - startTime;
      if (progress > speedFactor) {
        startTime = timestamp;

        setRotateViewState((rotateViewState) => ({
          ...rotateViewState,
          bearing: bearing,
          transitionDuration: 0,
        }));

        if (mode === 'spiral') {
          bearing = (bearing >= 360 ? 0 : bearing) + speed / 100;
        } else {
          bearing >= 180 && setDirection(!1);
          bearing <= 0 && setDirection(!0);
          bearing = getDirection() ? bearing + speed / 100 : bearing - speed / 100;
        }
      }

      animation = requestAnimationFrame(rotateCamera);
    };

    startTime = performance.now();
    rotateCamera(startTime);

    return () => {
      cancelAnimationFrame(animation);
    };
  }, [speed, mode, disable]);

  return [rotateViewState];
};

export default useRotateCamera;

import * as React from 'react';
import * as Stats from 'stats.js';

const usePerformanceMonitor = function(type = 0) {
  const ref = React.useRef(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (el === null) return;
    const stats = new Stats();
    stats.showPanel(type);
    el.appendChild(stats.dom);
    const animate = function() {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
  }, [ref, type]);

  const element = React.createElement('div', { ref });

  return [element, ref];
};

export default usePerformanceMonitor;

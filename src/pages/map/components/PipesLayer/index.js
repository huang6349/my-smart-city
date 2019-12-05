import { CompositeLayer } from '@deck.gl/core';
import { PathLayer } from '@deck.gl/layers';
import chroma from 'chroma-js';
import styles from './index.css';

export default class PipesLayer extends CompositeLayer {
  static layerName = 'PipesLayer';

  initializeState() {
    const el = document.createElement('div');
    el.setAttribute('class', styles['tooltip']);
    el.style.display = 'none';
    document.body.appendChild(el);
    this.state = { el, keyframes: !1 };
  }

  finalizeState() {
    const { el } = this.state;
    el && document.body.removeChild(el);
  }

  getPickingInfo({ info, mode }) {
    const { object, x, y } = info;
    const { el } = this.state;

    if (object && mode === 'hover') {
      el.innerHTML = `${object.name}`;
      el.style.display = 'block';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    } else {
      el.style.display = 'none';
    }
    return info;
  }

  _getPath({ path }) {
    return path;
  }

  _getColor({ color }) {
    return chroma(color || '#ffffff').rgb();
  }

  _getWidth() {
    return 1;
  }

  renderLayers() {
    const { data = [], pickable, ...otherProps } = this.props;

    return [
      new PathLayer(
        this.getSubLayerProps({
          ...otherProps,
          pickable: pickable || !0,
          data: data,
          widthUnits: 'pixels',
          widthScale: 1.5,
          rounded: !0,
          billboard: !0,
          getPath: this._getPath,
          getColor: this._getColor,
          getWidth: this._getWidth,
        })
      ),
    ];
  }
}

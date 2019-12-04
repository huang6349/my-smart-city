import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import * as d3 from 'd3-ease';
import chroma from 'chroma-js';
import keyBy from 'lodash/keyBy';
import styles from './index.css';

const MANHOLE_COVER_STATE_C = keyBy(process.env.MANHOLE_COVER_STATE, 'state');

export default class ManholeCoverLayer extends CompositeLayer {
  static layerName = 'ManholeCoverLayer';

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
      el.innerHTML = `${object.name} （${MANHOLE_COVER_STATE_C[object.status]['text']}）`;
      el.style.display = 'block';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    } else {
      el.style.display = 'none';
    }
    return info;
  }

  _getPosition({ lng, lat }) {
    return [lng, lat];
  }

  _getIcon() {
    return require('@/assets/icons/icons.json')['manhole-cover'];
  }

  _getColor(d) {
    const MANHOLE_COVER = MANHOLE_COVER_STATE_C[d.status];
    return chroma(MANHOLE_COVER ? MANHOLE_COVER['color'] : '#ffffff').rgb();
  }

  renderLayers() {
    const { keyframes } = this.state;
    const { id, data = [], pickable, updateTriggers, transitions, ...otherProps } = this.props;

    return [
      new IconLayer(
        this.getSubLayerProps({
          ...otherProps,
          id: `${id}-still`,
          pickable: pickable || !0,
          data: data.filter(({ status }) => status !== 3),
          sizeScale: 1,
          sizeUnits: 'meters',
          sizeMinPixels: 7,
          billboard: !1,
          getPosition: this._getPosition,
          getIcon: this._getIcon,
          getSize: () => 5,
          getColor: this._getColor,
          updateTriggers: updateTriggers,
          transitions: transitions,
        })
      ),
      new IconLayer(
        this.getSubLayerProps({
          ...otherProps,
          id: `${id}-flicker`,
          pickable: pickable || !0,
          data: data.filter(({ status }) => status === 3),
          sizeScale: 1,
          sizeUnits: 'pixels',
          sizeMinPixels: 5,
          billboard: !1,
          getPosition: this._getPosition,
          getIcon: this._getIcon,
          getSize: () => (keyframes ? 20 : 5),
          getColor: this._getColor,
          updateTriggers: {
            ...updateTriggers,
            getSize: [keyframes],
          },
          transitions: {
            ...transitions,
            getSize: {
              type: 'interpolation',
              duration: 1000,
              easing: d3.easeQuadInOut,
              onEnd: () => this.setState({ keyframes: !keyframes }),
            },
          },
        })
      ),
    ];
  }
}

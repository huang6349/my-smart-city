import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import chroma from 'chroma-js';
import keyBy from 'lodash/keyBy';
import { Tween, Easing } from 'es6-tween';
import styles from './index.css';

const MANHOLE_COVER_STATE_C = keyBy(process.env.MANHOLE_COVER_STATE, 'state');

export default class ManholeCoverLayer extends CompositeLayer {
  static layerName = 'ManholeCoverLayer';

  initializeState() {
    const el = document.createElement('div');
    el.setAttribute('class', styles['tooltip']);
    el.style.display = 'none';
    document.body.appendChild(el);
    const tween = new Tween({ size: 5 });
    tween.to({ size: 18 }, 1000);
    tween.easing(Easing.Quadratic.InOut);
    tween.repeat(Infinity);
    tween.yoyo(!0);
    tween.on('update', ({ size }) => {
      this.setState({ size });
    });
    this.state = { el, tween, size: 5 };
  }

  updateState({ props: { visible }, oldProps: { visible: oldVisible } }) {
    if (visible !== oldVisible) {
      const { tween } = this.state;
      visible ? tween.restart() : tween.stop();
    }
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
    const { size } = this.state;
    const { id, data = [], pickable, updateTriggers, ...otherProps } = this.props;

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
          updateTriggers: {
            ...updateTriggers,
            getSize: [size],
          },
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
          getSize: () => size,
          getColor: this._getColor,
          updateTriggers: {
            ...updateTriggers,
            getSize: [size],
          },
        })
      ),
    ];
  }
}

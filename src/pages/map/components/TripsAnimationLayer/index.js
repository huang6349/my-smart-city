import { CompositeLayer } from '@deck.gl/core';
import { TripsLayer } from '@deck.gl/geo-layers';

export default class TripsAnimationLayer extends CompositeLayer {
  static layerName = 'TripsAnimationLayer';

  static defaultProps = {
    loopLength: 1800,
    animationSpeed: 30,
  };

  initializeState() {
    this.state = { keyframes: 0 };
    this._startAnimation();
  }

  finalizeState() {
    const { raf } = this.state;
    raf && cancelAnimationFrame(raf);
  }

  _startAnimation() {
    const { loopLength, animationSpeed } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;
    const keyframes = ((timestamp % loopTime) / loopTime) * loopLength;
    const raf = requestAnimationFrame(this._startAnimation.bind(this));
    this.setState({ keyframes, raf });
  }

  _getPath({ path }) {
    return path;
  }

  _getTimestamps({ timestamps }) {
    return timestamps;
  }

  _getColor({ vender }) {
    return vender === 0 ? [253, 128, 93] : [23, 184, 190];
  }

  renderLayers() {
    const { keyframes } = this.state;
    const { data, ...otherProps } = this.props;

    return [
      new TripsLayer(
        this.getSubLayerProps({
          ...otherProps,
          data: data,
          currentTime: keyframes,
          getPath: this._getPath,
          getTimestamps: this._getTimestamps,
          getColor: this._getColor,
        })
      ),
    ];
  }
}

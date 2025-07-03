import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { OrthographicCamera } from '@react-three/drei';

const AdjustableCamera = memo(function AdjustableCamera({
  zoom,
  position,
  near,
  far,
  ...props
}) {
  return (
    <OrthographicCamera
      makeDefault
      position={position}
      zoom={zoom}
      near={near}
      far={far}
      onUpdate={(cam) => cam.updateProjectionMatrix()}
      {...props}
    />
  );
});

AdjustableCamera.propTypes = {
  zoom: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  near: PropTypes.number,
  far: PropTypes.number,
};

AdjustableCamera.defaultProps = {
  zoom: 1,
  position: [0, 0.35, 2],
  near: 0.1,
  far: 100,
};

export default AdjustableCamera;

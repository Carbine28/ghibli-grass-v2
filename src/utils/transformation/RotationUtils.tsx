import { Matrix3 } from "three";
import * as THREE from 'three';

export const getDegToRad = (degrees:number) => {
  return THREE.MathUtils.DEG2RAD * degrees;
}

export const getYRotationMatrix = (degrees: number) => {
  const radians = THREE.MathUtils.DEG2RAD * degrees
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return new Matrix3().set(
    cos, 0, sin,
    0, 1, 0,
    -sin, 0, cos
  );
};

export const getZRotationMatrix = (degrees: number) => {
  const radians = THREE.MathUtils.DEG2RAD * degrees
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return new Matrix3().set(
    cos, -sin, 0,
    sin, cos, 0,
    0, 0, 1
  )
}

export const getXRotationMatrix = (degrees: number) => {
  const radians = THREE.MathUtils.DEG2RAD * degrees
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return new Matrix3().set(
    1, 0, 0,
    0, cos, -sin,
    0, sin, cos
  )
}
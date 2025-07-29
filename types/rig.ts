/**
 * Represents the transformation of a single bone in a character rig.
 */
export interface BoneTransform {
  /**
   * Rotation expressed as a quaternion [w, x, y, z].
   * Quaternions are preferred for 3D rotation to avoid gimbal lock.
   */
  rotation: [number, number, number, number];

  /**
   * Optional location [x, y, z] relative to the parent bone.
   */
  location?: [number, number, number];
}

/**
 * Represents the entire pose of a character rig for a single frame.
 * It's a dictionary mapping bone names (e.g., "upper_arm.L") to their transformations.
 */
export type RigPose = Record<string, BoneTransform>;
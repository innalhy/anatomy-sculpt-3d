import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

function restoreNames(root) {
  root.traverse((obj) => {
    if (obj.userData?.name) obj.name = obj.userData.name;
  });
}

function mirrorGroup(source) {
  const clone = source.clone(true);
  clone.scale.x = -1;
  clone.name = source.name.replace("_right", "_left");
  clone.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.name = obj.name.replace(/\.r\.?$/, ".l");
  });
  source.parent.add(clone);
}

export function surfaceToward(mesh, worldDir) {
  const pos = mesh.geometry.attributes.position;
  if (!pos) return mesh.getWorldPosition(new THREE.Vector3());
  mesh.updateWorldMatrix(true, false);
  const inverse = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
  const localDir = worldDir.clone().transformDirection(inverse).normalize();
  const v = new THREE.Vector3();
  let best = -Infinity;
  const winner = new THREE.Vector3();
  const step = Math.max(1, Math.floor(pos.count / 4000));
  for (let i = 0; i < pos.count; i += step) {
    v.fromBufferAttribute(pos, i);
    const score = v.dot(localDir);
    if (score > best) {
      best = score;
      winner.copy(v);
    }
  }
  return winner.applyMatrix4(mesh.matrixWorld);
}

export function pointAlong(mesh, t, outward = new THREE.Vector3(0, 0.15, 1)) {
  mesh.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const axis = size.x >= size.y && size.x >= size.z ? "x" : size.z >= size.y ? "z" : "y";
  const target = box.min[axis] + size[axis] * t;
  const pos = mesh.geometry.attributes.position;
  const v = new THREE.Vector3();
  const world = new THREE.Vector3();
  let best = -Infinity;
  const winner = new THREE.Vector3();
  const step = Math.max(1, Math.floor(pos.count / 5000));
  for (let i = 0; i < pos.count; i += step) {
    v.fromBufferAttribute(pos, i);
    world.copy(v).applyMatrix4(mesh.matrixWorld);
    const score = -Math.abs(world[axis] - target) * 6 + world.dot(outward);
    if (score > best) {
      best = score;
      winner.copy(world);
    }
  }
  return winner;
}

export async function loadSkeleton(url) {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  const gltf = await loader.loadAsync(url);
  draco.dispose();

  const root = gltf.scene;
  restoreNames(root);
  const rightBones = root.getObjectByName("Bones_right");
  const rightCartilage = root.getObjectByName("Cartilages_right");
  if (rightBones) mirrorGroup(rightBones);
  if (rightCartilage) mirrorGroup(rightCartilage);

  const meshes = new Map();
  const pickables = [];
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.material = obj.material.clone();
    obj.material.side = THREE.DoubleSide;
    meshes.set(obj.name, obj);
    pickables.push(obj);
  });

  return { root, meshes, pickables };
}

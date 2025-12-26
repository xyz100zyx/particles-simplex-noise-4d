import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ParticlesModel } from "./features/particles-model";

import * as THREE from "three";
import './style.css'

async function bootstrap() {
  const ROOT_CONTAINER_ID = "app";

  const rootContainer = document.getElementById(ROOT_CONTAINER_ID);

  if (!rootContainer) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x3d3d3d);
  rootContainer.appendChild(renderer.domElement);

  camera.position.z = 260;
  camera.position.y = 20;

  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  const beyonceModel = new ParticlesModel(scene, camera);
  await beyonceModel.loadModelToScene();

  function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();

    renderer.render(scene, camera);
  }

  animate();
}

document.addEventListener("DOMContentLoaded", bootstrap);

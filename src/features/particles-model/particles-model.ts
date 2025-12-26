import { type GLTF } from "three/examples/jsm/Addons.js";
import { GLTFLoaderApi } from "../../shared/loaders/gltf";
import * as THREE from "three";

import fragmentShader from "./_lib/shaders/fragment.glsl?raw";
import vertexShader from "./_lib/shaders/vertex.glsl?raw";
import simplexNoiseShader from "./_lib/shaders/simplex-noise.glsl?raw";
import { createRayCaster } from "./_lib/helpers";

export class ParticlesModel {
  private gltfLoader = GLTFLoaderApi.create();
  private threeScene!: THREE.Scene;
  private threeCamera!: THREE.Camera;

  private loadedGLTF!: GLTF | null;
  private positionBufferAttribute!: THREE.BufferAttribute | null;
  private bufferGeometry!: THREE.BufferGeometry | null;

  private meshToHandleMouseIntersection!: THREE.Mesh | null;

  private mousePosition!: THREE.Vector3 | null;

  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Points;

  private rayCaster!: THREE.Raycaster | null;

  private time: number = 0;

  constructor(threeScene: THREE.Scene, threeCamera: THREE.Camera) {
    this.threeScene = threeScene;
    this.threeCamera = threeCamera;
    window.addEventListener("mousemove", this._handleDOMMouseMove.bind(this));
    this.rayCaster = createRayCaster();

    this.createMeshForHandleMouseIntersection();
  }

  async loadModelToScene() {
    try {
      const res = await this.gltfLoader.loadAsync("beyonce.glb");
      this.loadedGLTF = res;

      this.positionBufferAttribute =
        // @ts-ignore
        res.scene.children[0].geometry.attributes.position;

      await this.createCustomGeometry();
      this.createMesh();
      this.updateFrame();
    } catch (e: unknown) {
      console.log("e", e);
      this.dispose();
    }
  }

  private async createCustomGeometry() {
    try {
      const customBufferGeometry = new THREE.BufferGeometry();

      customBufferGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(this.positionBufferAttribute!.array, 3)
      );

      this.bufferGeometry = customBufferGeometry;
    } catch (e: unknown) {
      console.log("e", e);
      this.dispose();
    }
  }

  private createMesh() {
    try {
      this.material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader: simplexNoiseShader + '\n' + vertexShader,
        uniforms: {
          time: { value: this.time },
          mouse: { value: this.mousePosition ?? new THREE.Vector3(0, 0) },
        },
      });
      this.mesh = new THREE.Points(this.bufferGeometry!, this.material);
      this.threeScene.add(this.mesh);
    } catch (e: unknown) {
      this.dispose();
    }
  }

  private _handleDOMMouseMove(e: MouseEvent) {
    this.mousePosition = new THREE.Vector3(
      (e.clientX / window.innerWidth) * 2 - 1,
      1 - (e.clientY / window.innerHeight) * 2,
      0
    );
  }

  updateFrame() {
    requestAnimationFrame((time) => {
      // this.time++;
      this.mesh.rotation.y += 0.01;

      this.material.uniforms.time.value = time;

      if (this.mousePosition && this.rayCaster) {
        this.rayCaster.setFromCamera(
          new THREE.Vector2(this.mousePosition.x, this.mousePosition.y),
          this.threeCamera
        );

        const intersects = this.rayCaster.intersectObjects(
          this.threeScene.children
        );
        if (intersects.length) {
          this.material.uniforms.mouse.value = intersects[0].point;
        }
      }
      this.updateFrame();
    });
  }

  private createMeshForHandleMouseIntersection() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      visible: false,
      // wireframe: true,
    });
    const geom = new THREE.BoxGeometry(200, 600, 100);

    this.meshToHandleMouseIntersection = new THREE.Mesh(geom, material);
    this.threeScene.add(this.meshToHandleMouseIntersection);
  }

  private dispose() {
    this.positionBufferAttribute = null;
    this.loadedGLTF = null;

    window.removeEventListener("mousemove", this._handleDOMMouseMove);
  }
}

import { GLTFLoader } from "three/examples/jsm/Addons.js";

const globalGLTFLoader = new GLTFLoader();

const createGLTFLoader = () => {
  return new GLTFLoader();
};

export const GLTFLoaderApi = {
  create: createGLTFLoader,
  globalGLTFLoader: globalGLTFLoader,
};

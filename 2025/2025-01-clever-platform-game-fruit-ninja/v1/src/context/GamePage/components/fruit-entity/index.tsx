import * as THREE from "three";
import { loadOBJModel } from "../../../../utility/ModelLoader";

const fruitlist = [
  {
    modelPath: "/fruits/Strawberry/Strawberry_obj.obj",
    texturePath: "/fruits/Strawberry/Strawberry_obj.mtl"
  },
  {
    modelPath: "/fruits/Banana/banana_hiPoly.obj",
    texturePath: "/fruits/Banana/banana_hiPoly.mtl"
  }
]

const CreateNewFruit = (
  //sceneRef: THREE.Scene
  //PlacePosition: THREE.Vector3
) => {
 
  // Create an image element
  const debugEnabled = false
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  const material = new THREE.MeshBasicMaterial({ 
    transparent: true, 
    opacity: debugEnabled? 1 : 0,
    color: new THREE.Color(0, 255, 0),
    side: THREE.DoubleSide
  });

  let plane = new THREE.Mesh(geometry, material);
  let fruitmodel: any | null = null;
  let group = new THREE.Object3D()
  group.add(plane);

  const random = Math.random()
  const selectedFruitModel = "/fruits/Orange/12204_Fruit_v1_L3.obj" //random * 1 > 0.5 ? "/fruits/Strawberry/Strawberry_obj.obj" : 
  const selectedFruitTexture = "/fruits/Orange/12204_Fruit_v1_L3.mtl" //random * 1 > 0.5 ? "/fruits/Strawberry/Strawberry_obj.mtl" : 

  loadOBJModel(selectedFruitModel, selectedFruitTexture)
    .then((loadedModel: any) => {
      const modelScale = 0.5
      loadedModel.scale.set( modelScale, modelScale, modelScale);
      loadedModel.position.set(0,0,-2)
      fruitmodel = loadedModel
      group.add(loadedModel)
    })
    .catch((error) => console.log(error));

  return group;
};

export default CreateNewFruit;

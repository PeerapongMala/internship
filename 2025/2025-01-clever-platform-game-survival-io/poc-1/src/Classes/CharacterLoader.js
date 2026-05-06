import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export function loadFBXCharacter(url, scene, onLoad, onError) {
    const loader = new FBXLoader();
    loader.load(url, (object) => {

        if (onLoad) onLoad(object);
    }, undefined, (error) => {
        console.error(`Error loading model: ${url}`, error);
        if (onError) onError(error);
    });
}

export function loadCharacter(selectedCharacter, scene, callback) {

    const characterURL = selectedCharacter; // ใช้ URL ของ A ถ้าไม่พบตัวที่เลือก

    loadFBXCharacter(characterURL, scene, (character) => {
        character.scale.set(0.025, 0.025, 0.025); // Adjust the scale of the character if needed
        character.position.set(0, 0, 0); // Set the initial position of the character
        character.rotation.set(-3.14/2,0,0)

        window.PlayerCharacter = character; // Set PlayerCharacter in the window
        scene.add(character);
        callback(character);
    });
}
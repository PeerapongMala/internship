export const PUBLIC_ASSETS_LOCATION = {
  config: {
    waveConfig: '/config/waveConfig.json',
  },
  image: {
    ref: {
      background: {
        mainMenu: '/image/ref/background/main-menu-bg.png',
        gameplay: '/image/ref/background/gameplay-bg.png',
        score: '/image/ref/background/score-bg.png',
      },
      lastwarCameraAngle: '/image/ref/lastwarCameraAngle.jpg',
      scoreModal: '/image/ref/scoreModal.png',
    },

    background: {
      mainMenu: '/image/background/main-menu-bg.png',
      gameplay: '/image/background/gameplay-bg.png',
      score: '/image/background/score-bg.png',
    },

    texture: {
      road: '/image/texture/road.png',
      wall: {
        green: '/image/texture/greenWall.png',
        red: '/image/texture/redWall.png',
      },
    },

    title: '/image/ui/title.png',
    loading: '/image/ui/loading.png',
    playBtn: '/image/ui/playBtn.png',
    pauseBtn: '/image/ui/pauseBtn.png',
    resumeBtn: '/image/ui/resumeBtn.png',
    carrot: '/image/ui/carrot.png',
    scoreModal: '/image/ui/scoreModal.png',
    playAgainBtn: '/image/ui/playAgainBtn.png',
    returnBtn: '/image/ui/returnBtn.png',
    mainMenuBtn: '/image/ui/mainMenuBtn.png',
    scoreBadge: '/image/ui/scoreBadge.png',
  },
  // TODO: rename model to object to avoid confusion
  model: {
    character: {
      animation: {
        default: '/Animations/Running_Test.fbx',
        test: '/model/character/animation/set1_character1_level1_level1_StandingTorchRunForward.fbx',
        // test: '/model/character/animation/Character1.fbx',
      },
      model: {
        default: '/character/set2/character1/level1.fbx',
        // default: '/model/character/default_avatar_model.fbx',
        test: '/model/character/model/level1.fbx',
      },
    },
    obstacle: {
      animalAnimation_typeA: '/model/obstacle/Animal_Animation_TypeA.fbx',
      animalAnimation_typeB: '/model/obstacle/Animal_Animation_TypeB.fbx',
      animalModel: {
        Bear: '/model/obstacle/animal-model/Bear.fbx',
        Deer: '/model/obstacle/animal-model/Deer.fbx',
        Elephant: '/model/obstacle/animal-model/Elephant.fbx',
        Giraffe: '/model/obstacle/animal-model/Giraffe.fbx',
        Hippo: '/model/obstacle/animal-model/Hippo.fbx',
        Zebra: '/model/obstacle/animal-model/Zebra.fbx',

        // Bear: '/model/obstacle/animal-model/Bear.glb',
        // Deer: '/model/obstacle/animal-model/Deer.glb',
        // Elephant: '/model/obstacle/animal-model/Elephant.glb',
        // Giraffe: '/model/obstacle/animal-model/Giraffe.glb',
        // Hippo: '/model/obstacle/animal-model/Hippo.glb',
        // Zebra: '/model/obstacle/animal-model/Zebra.glb',

        // Bear: '/model/obstacle/animal-model/gltf/Bear.gltf',
        // Deer: '/model/obstacle/animal-model/gltf/Deer.gltf',
        // Elephant: '/model/obstacle/animal-model/gltf/Elephant.gltf',
        // Giraffe: '/model/obstacle/animal-model/gltf/Giraffe.gltf',
        // Hippo: '/model/obstacle/animal-model/gltf/Hippo.gltf',
        // Zebra: '/model/obstacle/animal-model/gltf/Zebra.gltf',
      },
    },
  },
};

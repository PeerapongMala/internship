import ImageSprite8x8 from '../../../../assets/8x8to128x128.png';

const Buttton8x8 = {
  image: ImageSprite8x8,
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
};

const Buttton16x16 = {
  image: ImageSprite8x8,
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

const Background16x16 = {
  image: ImageSprite8x8,
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

const CCASpriteEnum = Object.freeze({
  Button: {
    Buttton8x8: Buttton8x8,
    Buttton16x16: Buttton16x16,
  },
  Background: {
    Background16x16: Background16x16,
  },
});

export default CCASpriteEnum;

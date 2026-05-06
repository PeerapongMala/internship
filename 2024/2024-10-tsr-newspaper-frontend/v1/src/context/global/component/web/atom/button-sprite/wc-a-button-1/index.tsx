import CCASpriteEnum from '../../../../../gameloop/cc-a-sprite-enum';
import WCIButtonSprite from '../../wc-i-button-sprite';

const WCAButton1 = () => {
  return (
    <WCIButtonSprite
      sprite={CCASpriteEnum.Button.Button8x8}
      text={'text'}
      callbackOnClick={() => {
        console.log('callbackOnClick');
      }}
    />
  );
};

export default WCAButton1;

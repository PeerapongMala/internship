import CCASpriteEnum from '../../../code/atom/cc-a-sprite-enum';
import WCIButtonSprite from '../../interface/wc-i-button-sprite';

const WCAButton1 = () => {
  return (
    <WCIButtonSprite
      sprite={CCASpriteEnum.Button.Buttton8x8}
      text={'text'}
      callbackOnClick={() => {
        console.log('callbackOnClick');
      }}
    />
  );
};

export default WCAButton1;

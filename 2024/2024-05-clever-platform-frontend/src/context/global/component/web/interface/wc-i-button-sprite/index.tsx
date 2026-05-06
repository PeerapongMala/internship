const WCIButtonSprite = (props: {
  sprite: {
    image: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  text: string;
  callbackOnClick: () => void;
}) => {
  const { sprite } = props;

  console.log('sprite', sprite);
  const style: React.CSSProperties = {
    width: '300px',
    height: '100px',
    backgroundImage: `url(${sprite.image})`,
    borderImage: `url(${sprite.image})`,
    borderStyle: 'solid',
    borderWidth: '30px',
    borderImageRepeat: 'round',
    textAlign: 'center',

    /* top | right | bottom | left */
    borderImageSlice: `${sprite.top} ${sprite.right} ${sprite.bottom} ${sprite.left}`,
  };

  return (
    <div onClick={props.callbackOnClick} style={style}>
      {props.text}
    </div>
  );
};

export default WCIButtonSprite;

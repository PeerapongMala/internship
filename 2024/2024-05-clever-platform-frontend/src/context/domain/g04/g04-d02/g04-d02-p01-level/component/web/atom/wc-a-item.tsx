interface Item {
  image: string;
  count: number;
  remaining: number;
  style?: React.CSSProperties;
}

const ItemGame = ({ image, count, remaining, style }: Item) => {
  return (
    <div
      className="flex flex-col min-w-32 min-h-36 p-2 bg-white rounded-3xl cursor-pointer transition active:translate-y-0.5 hover:translate-y-[-0.125rem]"
      style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="h-24 w-full bg-red-300 rounded-t-[1.2rem]" style={style}>
        <img src={image} alt="item" className="w-full h-full" />
      </div>
      <div className="w-full text-center font-bold text-xl">
        {remaining}/{count}
      </div>
    </div>
  );
};

export default ItemGame;

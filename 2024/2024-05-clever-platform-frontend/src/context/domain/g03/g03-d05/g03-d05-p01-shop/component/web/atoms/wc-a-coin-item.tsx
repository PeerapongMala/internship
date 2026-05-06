const CoinItem = ({ iconSrc, value }: { iconSrc: string; value: string }) => {
  return (
    <div className="flex gap-2 text-2xl font-semibold items-center">
      <img className="h-8" src={iconSrc} />
      <div className="pt-1">{value}</div>
    </div>
  );
};

export default CoinItem;

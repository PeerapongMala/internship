import ImageItemGift from '../atoms/wc-a-image-item-gift';

const ShopMenuBodyGift = ({ imageList }: { imageList: any[] }) => {
  return (
    <div className="row-span-6 flex flex-col gap-1 w-full h-full bg-secondary/10 p-4 rounded-br-[70px] overflow-y-auto pb-36 pr-6">
      <div className="grid grid-cols-1 gap-1 w-full bg-slate-100 p-1">
        {imageList.map((image, index) => (
          <ImageItemGift key={index} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ShopMenuBodyGift;

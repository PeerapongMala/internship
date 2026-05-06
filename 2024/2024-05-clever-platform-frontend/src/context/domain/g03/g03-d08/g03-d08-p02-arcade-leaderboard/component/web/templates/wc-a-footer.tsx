import Avatar from '../../../assets/admin.svg';
import { TextSubtitle } from '../atoms/wc-a-text';

export function DialogFooter() {
  return (
    <div
      id="waiting-list"
      className="flex flex-col justify-center min-w-[620px] gap-4 h-fit"
    >
      <div className="grid grid-cols-[64px_64px_400px_70px_200px] items-center gap-3 bg-[#ace4f2] p-2 rounded-[32px] shadow-lg border-t-8 border-[#0066ff]">
        <div className="bg-[#0066ff] rounded-3xl border-4 border-white w-[64px] h-[64px] shadow-red-500 flex items-center justify-center text-xl noto-sans-thai1200 text-white">
          12
        </div>

        <div>
          <img
            src={Avatar}
            alt="User Avatar"
            className="rounded-full border-2 border-white w-[64px] h-[64px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <TextSubtitle className="text-lg !font-bold">มัวิยา ไกรภาพ (You)</TextSubtitle>
        </div>

        <TextSubtitle className=" text-right text-xl !font-bold">100</TextSubtitle>
        <TextSubtitle className="text-right text-gray-500 !font-bold">
          20:30.456
        </TextSubtitle>
      </div>
    </div>
  );
}

export default DialogFooter;

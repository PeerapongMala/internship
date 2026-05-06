import ImageIconCorrecticon from '../../../../assets/icon-correct.svg';
import ImageIconInCorrecticon from '../../../../assets/icon-incorrect.svg';

export const IconCorrect = () => {
    return (
        <div
            className="relative flex justify-center items-center text-xl font-bold rounded-full select-none border-[3px] border-white
      bg-[#26D93B] text-black
      w-10 h-10
      "
            style={{
                boxShadow:
                    '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 #4BD45A, inset 0 -8px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            <img src={ImageIconCorrecticon} alt="correcticon" width="16px" />
        </div>
    );
};

export const IconInCorrect = () => {
    return (
        <div
            className="relative flex justify-center items-center text-xl font-bold rounded-full select-none border-[3px] border-white
      bg-[#FF6B00] text-black
      w-10 h-10
      "
            style={{
                boxShadow:
                    '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 #C10100, inset 0 -8px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
            <img src={ImageIconInCorrecticon} alt="correcticon" width="16px" />
        </div>
    );
};

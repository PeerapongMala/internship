import { UserData } from '@domain/g02/g02-d01/local/type';
import InputPin from '../molecules/wc-a-input-pin';
import SelectUser from '../molecules/wc-a-select-user';

const Body = ({
  pin,
  currentUser,
  handleClickSwap,
  warningText,
}: {
  pin: string;
  currentUser?: UserData;
  handleClickSwap: () => void;
  warningText: string;
}) => {
  return (
    <div className="relative flex flex-col w-full py-8 border-b-4 border-dashed border-secondary">
      <div className="">
        {currentUser && (
          <SelectUser
            onClick={handleClickSwap}
            title={currentUser.first_name + ' ' + currentUser.last_name}
            uuid={currentUser.student_id}
            imageSrc={currentUser.image_url}
            tempImageSrc={currentUser.temp_image}
          />
        )}
      </div>
      <div className="pt-[14px]">
        <InputPin pin={pin} warning={!!warningText} />
        {warningText && (
          <div className="absolute right-20 text-red-500 text-xl">{warningText}</div>
        )}
      </div>
    </div>
  );
};

export default Body;

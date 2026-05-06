import { UserData } from '@domain/g02/g02-d01/local/type';
import ToggleInternet from '@global/component/web/molecule/wc-m-toggle-internet';
import SelectUser from '../molecules/wc-a-select-user';
const Body = ({
  offLineMode,
  handleToggleInternet,
  selectedUser,
  handleClickSwap,
}: {
  offLineMode: boolean;
  handleToggleInternet: any;
  selectedUser?: UserData;
  handleClickSwap: any;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full py-7 border-b-4 border-dashed border-secondary items-center">
      {selectedUser && (
        <SelectUser
          onClick={handleClickSwap}
          title={selectedUser.first_name + ' ' + selectedUser.last_name}
          uuid={selectedUser.student_id}
          imageSrc={selectedUser.image_url}
          tempImageSrc={selectedUser.temp_image}
        />
      )}
      {!selectedUser && <div className="text-4xl font-bold">ไม่พบ User</div>}
      <ToggleInternet value={offLineMode} onClick={handleToggleInternet} />
    </div>
  );
};

export default Body;

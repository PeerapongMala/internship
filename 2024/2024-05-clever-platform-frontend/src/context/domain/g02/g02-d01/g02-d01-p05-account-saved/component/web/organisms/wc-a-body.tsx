import { UserData } from '@domain/g02/g02-d01/local/type';
import SavedUser from '../molecules/wc-a-saved-user';

const Body = ({
  userList,
  handleClickHiddenUser,
  handleSelectUser,
}: {
  userList: UserData[];
  handleClickHiddenUser: (student_id: string) => void;
  handleSelectUser: (student_id: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 w-full py-5 border-b-4 border-dashed border-secondary overflow-y-auto h-[23rem]">
      {userList.map((user) => (
        <SavedUser
          key={`${user.school_code}-${user.student_id}`}
          onClick={() => handleClickHiddenUser(user.student_id)}
          title={user.first_name + ' ' + user.last_name}
          uuid={user.student_id}
          imageSrc={user.image_url}
          tempImageSrc={user.temp_image}
          onSelect={() => handleSelectUser(user.student_id)}
        />
      ))}
    </div>
  );
};

export default Body;

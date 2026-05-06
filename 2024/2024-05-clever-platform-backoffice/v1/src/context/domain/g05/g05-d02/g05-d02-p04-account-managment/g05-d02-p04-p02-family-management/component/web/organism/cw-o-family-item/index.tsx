import { TFamilyMember } from '@domain/g05/g05-d02/local/types/family';
import FamilyProfile from '../../atom/cw-a-family-profile';
import { useFamilyStore } from '@domain/g05/g05-d02/local/stores/family-store';
import { EFamilyType } from '@domain/g05/g05-d02/local/enums/family';
import { useNavigate } from '@tanstack/react-router';
import Swal from 'sweetalert2';
import DropdownMenu from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/molecule/cw-c-dropdown-menu';

type FamilyItemProps = {
  member: TFamilyMember;
};

const FamilyItem = ({ member }: FamilyItemProps) => {
  const navigate = useNavigate();
  const store = useFamilyStore((state) => state);

  const confirmRemoveFamily = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this family? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('remove fam');
        Swal.fire('Deleted!', 'The family has been deleted.', 'success').then(() => {
          navigate({ to: '/line/parent' });
        });
      }
    });
  };

  const confirmRemoveMember = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to remove ${member.first_name} from the family?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove them!',
    }).then((result) => {
      if (result.isConfirmed) {
        store.removeMember(member.user_id);
        Swal.fire(
          'Removed!',
          `${member.first_name} has been removed from the family.`,
          'success',
        );
      }
    });
  };

  return (
    <div className="flex w-full flex-row gap-2 px-1">
      <FamilyProfile src={member.img_url} />
      <div className="flex flex-1 flex-col justify-center">
        <span>{member.first_name}</span>
      </div>

      <DropdownMenu
        menus={[
          {
            isShow: member.role === EFamilyType.OWNER,
            label: 'เพิ่มสมาชิก',
            onClick: () => navigate({ to: '/line/parent/management' }),
          },
          {
            isShow: member.role === EFamilyType.OWNER,
            label: 'ลบครอบครัว',
            onClick: confirmRemoveFamily,
          },
          {
            isShow: member.role === EFamilyType.PARENT,
            label: 'โอนเป็นเจ้าของ',
          },
          {
            isShow: member.role !== EFamilyType.OWNER,
            label: 'ลบออกจากครอบครัว',
            onClick: confirmRemoveMember,
          },
        ]}
      />
    </div>
  );
};

export default FamilyItem;

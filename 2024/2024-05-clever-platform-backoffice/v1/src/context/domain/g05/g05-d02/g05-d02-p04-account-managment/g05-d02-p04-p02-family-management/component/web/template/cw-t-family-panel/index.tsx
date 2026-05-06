import { EFamilyType } from '@domain/g05/g05-d02/local/enums/family';
import { TFamilyMember } from '@domain/g05/g05-d02/local/types/family';
import FamilyItem from '../../organism/cw-o-family-item';

type FamilyPanelProps = {
  familyType: EFamilyType;
  members: TFamilyMember[];
  isLastType?: boolean;
};

const FamilyList = ({ familyType, members, isLastType = false }: FamilyPanelProps) => {
  return (
    <div className={`flex w-full flex-col gap-2 ${!isLastType ? 'mb-6' : ''}`}>
      <span className="font-noto-sans-thai font-bold">{familyType}</span>
      {members &&
        members.map((member, index) => (
          <FamilyItem key={member.user_id || index} member={member} />
        ))}
    </div>
  );
};

export default FamilyList;

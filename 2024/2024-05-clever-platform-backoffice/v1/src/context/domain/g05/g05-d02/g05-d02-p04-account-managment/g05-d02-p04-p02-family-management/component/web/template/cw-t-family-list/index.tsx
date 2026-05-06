import { EFamilyType } from '@domain/g05/g05-d02/local/enums/family';
import { TFamily } from '@domain/g05/g05-d02/local/types/family';
import FamilyList from '../cw-t-family-panel';
import FamilyDetailsPanel from '../../organism/cw-o-detail-panel';

type FamilyListTemplateProps = {
  family: TFamily | undefined;
  onAddMemberSuccess?: () => void;
};

const FamilyListTemplate = ({ family, onAddMemberSuccess }: FamilyListTemplateProps) => {
  return (
    <>
      <FamilyDetailsPanel
        family={family}
        ownerName={
          family ? family.members.filter((member) => member.is_owner)[0]?.first_name : ''
        }
        onAddMemberSuccess={onAddMemberSuccess}
      />
      {/* // TODO_BELL: refactor FamilyList to modal */}
      {family && (
        <>
          <FamilyList
            familyType={EFamilyType.OWNER}
            members={family.members.filter((member) => member.is_owner)}
          />

          <FamilyList
            familyType={EFamilyType.PARENT}
            members={family.members.filter(
              (member) => member.role === EFamilyType.PARENT && !member.is_owner,
            )}
          />

          <FamilyList
            familyType={EFamilyType.STUDENT}
            members={family.members.filter(
              (member) => member.role === EFamilyType.STUDENT && !member.is_owner,
            )}
          />
        </>
      )}
    </>
  );
};

export default FamilyListTemplate;

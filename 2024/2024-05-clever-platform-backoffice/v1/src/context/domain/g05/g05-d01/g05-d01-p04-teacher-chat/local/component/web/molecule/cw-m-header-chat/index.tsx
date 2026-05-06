import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

const TeacherChatHeader = ({
  isMobileView,
  showChatList,
  onBack,
}: {
  isMobileView: boolean;
  showChatList: boolean;
  onBack?: () => void;
}) => {
  return (
    <>
      <div className="relative flex items-center justify-center">
        {isMobileView && !showChatList && (
          <button onClick={onBack} className="absolute left-0 p-2">
            <IconArrowBackward />
          </button>
        )}
        <p className="text-[26px] font-bold">แชท</p>
      </div>
    </>
  );
};

export default TeacherChatHeader;

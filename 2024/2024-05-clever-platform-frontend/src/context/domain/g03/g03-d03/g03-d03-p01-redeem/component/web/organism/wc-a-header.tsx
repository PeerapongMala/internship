import HeaderSuccess from '../molecule/wc-a-header-success';

const HeaderJSX = ({
  handleBack = () => {},
  title = 'Title',
}: {
  handleBack: () => void;
  title: string;
}) => {
  return (
    <div className="flex justify-start items-center self-stretch h-24 px-4 border-b-2 border-dashed border-secondary relative">
      <HeaderSuccess handleBack={handleBack} title={title} />
    </div>
  );
};

export default HeaderJSX;

import CWButton from '@component/web/cw-button';
import useModalErrorInfos from '@global/hooks/useModalErrorInfos';

const ExampleModalErrorInfos = () => {
  const modal = useModalErrorInfos();

  return (
    <div>
      <CWButton
        className="h-full"
        title="Modal Error Infos"
        onClick={() => {
          modal.setErrorInfos([
            {
              context: 'Context',
              message: 'description about error',
            },
            {
              context: 'Context2',
              message: 'description about error',
            },
            {
              context: 'Context3',
              message: 'description about error',
            },
            {
              context: 'Context4',
              message: 'description about error',
            },
            {
              context: 'Context5',
              message: 'description about error',
            },
          ]);
        }}
      />
      {modal.isOpen && modal.render()}
    </div>
  );
};
export default ExampleModalErrorInfos;

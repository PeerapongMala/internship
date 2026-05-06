import ProgressBar from '../atoms/wc-a-progress-bar';

const LoadingScreen = ({ characterData }: { characterData: { src: string } }) => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center h-full w-full relative">
      <div className="grow mt-[9rem]"></div>
      <div className="w-full flex justify-center px-24 h-20 mb-3">
        <ProgressBar progress={50} />
      </div>
      <div className="h-20 w-full flex justify-center px-16 text-2xl items-center">
        uuid: 0000001, version 1.0
      </div>
    </div>
  );
};

export default LoadingScreen;

const ModalBackgroudB = () => {
  return (
    <div className="absolute h-full w-full -z-50">
      <div className="relative h-full w-full">
        <div
          className="ContainerOuter h-full w-full left-0 top-0 absolute rounded-[64px] shadow border-8 border-white"
          style={{
            boxShadow:
              // '0px 8px 16px 0px rgba(0, 0, 0, 0.30), 0px 16px 64px 0px rgba(0, 0, 0, 0.15)',
              '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 16px 16px 0px rgba(0, 0, 0, 0.05)',
          }}
        />
        <div className="Container h-full w-full left-0 top-0 absolute bg-white/80 rounded-[64px] flex-col justify-center items-center inline-flex"></div>
      </div>
    </div>
  );
};

export default ModalBackgroudB;

const ModalBackgroudA = () => {
  return (
    <div className="absolute h-full w-full -z-50">
      <div className="relative h-full w-full">
        <div
          className="absolute h-full w-full bg-white/80 rounded-[70px]"
          style={{
            boxShadow:
              '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -8px 0 rgba(0, 0, 0, 0.05)',
          }}
        ></div>
      </div>
    </div>
  );
};

export default ModalBackgroudA;

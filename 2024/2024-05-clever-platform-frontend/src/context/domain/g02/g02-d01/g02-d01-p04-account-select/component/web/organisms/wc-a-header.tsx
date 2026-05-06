const Header = ({ title = 'เข้าสู่ระบบ' }: { title?: string }) => {
  return (
    <div className="flex relative justify-center w-full border-b-2 border-dashed border-secondary">
      {/* <ButtonBack className="absolute h-[92px] pt-4 pl-1" /> */}
      <div className="text-3xl font-semibold pt-8 pb-4">{title}</div>
    </div>
  );
};

export default Header;

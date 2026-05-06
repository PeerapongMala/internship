import LogoBritania1 from '@asset/logo-britania-1.png';
import { Link } from '@tanstack/react-router';

const CWMHeaderResponsiveFreesize = (props: {
  menuList: { name: string; path: string }[];
}) => {
  return (
    <header className="text-text-main-414143 flex min-h-[88px] flex-row justify-between bg-white px-[40px] py-[10px]">
      <img
        className="my-auto"
        src={LogoBritania1}
        width={232}
        height={40}
        alt="Logo Britania 1"
      />
      <div className="my-auto flex items-center justify-end gap-x-[40px]">
        {props.menuList.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className="[&.active]:text-bg-primary-D36B61 [&.active]:font-bold"
          >
            {menu.name}
          </Link>
        ))}
        <button className="bg-bg-primary-D36B61 h-[40px] w-[116px] text-white">
          Login
        </button>
      </div>
    </header>
  );
};
export default CWMHeaderResponsiveFreesize;

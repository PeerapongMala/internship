import { useEffect, useState } from "react";

const ThemeToggle = () => {
  // อ่านค่า theme จาก Local Storage (ถ้าไม่มีให้ตั้งเป็น light theme)
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "light" : true;
  });

  const themeToggleHandler = () => {
    setIsLightTheme((prevState) => {
      const newTheme = !prevState;
      if (newTheme) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
      return newTheme;
    });
  };

  useEffect(() => {
    // ตั้งค่า theme ตามค่าใน state เมื่อ component mount
    if (isLightTheme) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightTheme]);

  return (
    <div className="flex items-center gap-4">
      <span className="text-text">Light</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={!isLightTheme}
          onChange={themeToggleHandler}
          className="sr-only peer"
        />
        <div className="absolute left-[2px] top-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
        <div className="w-10 h-5 peer-checked:bg-gray-300 rounded-full bg-[#D9A84E] transition-colors duration-300"></div>
      </label>
      <span className="text-[#989898] peer-checked:text-black">Dark</span>
    </div>
  );
};

export default ThemeToggle;

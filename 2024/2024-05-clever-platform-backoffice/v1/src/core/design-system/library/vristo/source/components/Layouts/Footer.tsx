const Footer = () => {
  return (
    <div className="mt-auto p-6 pt-10 text-center ltr:sm:text-left rtl:sm:text-right dark:text-white-dark">
      © {new Date().getFullYear()}. NextGen Education rights reserved.
    </div>
  );
};

export default Footer;


const DevNavBar = () => {
  
  const allRoutes = [
    { path: '/sign-in', label: 'Sign In' },
    { path: '/sign-up', label: 'Sign Up' },
    { path: '/', label: 'Home' },
    { path: '/post/non-member', label: 'Post(Non-memeber)' },
    { path: '/download', label: 'Download' },
    { path: '/about-us', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'คำถามที่พบบ่อย' },
    { path: '/guide', label: 'Guide' },
    // Profile dropdown
    {
      path: '/profile',
      label: 'Profile',
      isDropdown: true,
      subRoutes: [
        { path: '/profile', label: 'Profile' },
        { path: '/profile/password', label: 'Change Password' },
        { path: '/profile/payment-history', label: 'Payment History' },
        { path: '/profile/post-history', label: 'Post History' },
      ],
    },
    { path: '/post', label: 'Post(member)' },

    // Admin dropdown
    {
      path: '/admin',
      label: 'Admin',
      isDropdown: true,
      subRoutes: [
        { path: '/admin/announcement', label: 'Admin Announcement' },
        { path: '/admin/banner', label: 'Admin Banner Ads' },
        { path: '/admin/faq', label: 'Admin FAQ' },
        { path: '/admin/cover', label: 'Admin Cover' },
        { path: '/admin/approve', label: 'Admin Approve' },
        { path: '/admin/download', label: 'Admin Download' },
      ],
    },
  ];


  
  const changeUserRole = (role: string) => {
    localStorage.setItem('userRole', role); 
    window.location.reload();

  };
  
  
  return (
    <div className='absolute z-[1001] w-fit '>
      {/* <nav className="h-fit">
        <ul className="flex gap-5 bg-[#000000] shadow-lg">
          {allRoutes.map((route, index) => (
            <li
              key={index}
              className="relative group" // Added group for hover effects
            >
              {route.isDropdown ? (
                <>
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    {route.label}
                  </button>

                  {route.label === 'Profile' && (
                    <ul className="absolute bg-white text-black shadow-lg rounded-lg top-0 z-10 mt-1 invisible group-hover:visible">
                      {route.subRoutes.map((subRoute, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subRoute.path}
                            className="block px-4 py-2 text-sm text-blue-500 hover:text-blue-700"
                          >
                            {subRoute.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {route.label === 'Admin' && (
                    <ul className="absolute bg-white text-black shadow-lg rounded-lg top-0 z-10 mt-1 invisible group-hover:visible">
                      {route.subRoutes.map((subRoute, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subRoute.path}
                            className="block px-4 py-2 text-sm text-blue-500 hover:text-blue-700"
                          >
                            {subRoute.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={route.path}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  {route.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav> */}
      <div className='w-fit absolute  flex flex-col text-black top-[500px] left-8 gap-2 text-sm'>
        <button  className='bg-[#F6C945] p-1 rounded-full'
                  onClick={() => changeUserRole('guest')}
>
          non-member
        </button>
        <button className='bg-[#F6C945] p-1 rounded-full'
                  onClick={() => changeUserRole('member')}
>
          member
        </button>
        <button className='bg-[#F6C945] p-1 rounded-full'
                  onClick={() => changeUserRole('admin')}
>
          admin
        </button>
      </div>
    </div>
  );
};

export default DevNavBar;

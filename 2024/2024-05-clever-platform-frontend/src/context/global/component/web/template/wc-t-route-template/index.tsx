import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import GameCanvas from '../../../../../../core/helper/game-canvas/index.tsx';

const WCTRouteTemplate = (props: { children?: React.ReactNode }) => {
  const sideMenuStyle: React.CSSProperties = {
    width: `400px`,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: '3rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)',
    overflowY: 'auto',
    padding: '15px',
    boxSizing: 'border-box',
    zIndex: 10,
  };

  const [shownModuleList, setShownModuleList] = useState(false);

  const [showDevUI, setShowDevUI] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const debugMode = localStorage.getItem('debugMode');
      if (debugMode === 'true') {
        if (event.shiftKey) {
          setShowDevUI((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDevUI]);

  const handleClick = () => {
    // toggle shown state
    setShownModuleList((current) => !current);
  };

  const NavMenuItem = (props: { children?: React.ReactNode; to: string }) => {
    return (
      <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
        <Link to={props.to} className="[&.active]:font-bold [&.active]:underline">
          {props.children}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex flex-col min-h-screen uh-notch-p-x">
      {showDevUI && (
        <header className="bg-blue-500 text-white p-4 flex gap-x-2 h-24">
          <button className="flex" onClick={handleClick}>
            <h3 className="text-white text-lg font-bold">Module</h3>
          </button>

          <p>|</p>
          <p>{'Demo>>'}</p>
          <Link to="/" className="[&.active]:font-bold [&.active]:underline">
            Demo1
          </Link>
          <p>/</p>
          <Link to="/demo2" className="[&.active]:font-bold [&.active]:underline">
            Demo2:CanvasGame
          </Link>
          <p>/</p>
          <Link to="/demo3" className="[&.active]:font-bold [&.active]:underline">
            Demo3:ReactGameDemo1
          </Link>
          <p>/</p>
          <Link to="/demo4" className="[&.active]:font-bold [&.active]:underline">
            Demo4:ReactGameDemo2
          </Link>
          <p>/</p>
          <Link to="/demo5" className="[&.active]:font-bold [&.active]:underline">
            Demo5:NonCanvas
          </Link>
          <p>/</p>
          <Link to="/xxx" className="[&.active]:font-bold [&.active]:underline">
            Unknown
          </Link>
        </header>
      )}

      {/* show/hide sideMenu on click */}
      {shownModuleList && (
        <nav style={sideMenuStyle}>
          <div>
            <button onClick={handleClick}>
              <h3 className="text-white text-lg mb-3 font-bold">
                v Module // Group.Domain.Module
              </h3>
            </button>
          </div>

          <ul className="text-white space-y-2">
            <br />
            <p className="text-gray-200 text-lg mb-3 font-bold">G01 : game initial</p>
            <NavMenuItem to="/game-init">01.03.01 - game initial</NavMenuItem>
            <NavMenuItem to="/terms">01.02.03 - terms</NavMenuItem>
            <NavMenuItem to="/version-update">01.03.02 - version update</NavMenuItem>
            <br />
            <p className="text-gray-200 text-lg mb-3 font-bold">G02 : arrivings</p>
            <NavMenuItem to="/login-id">02.01.01 - login id</NavMenuItem>
            <NavMenuItem to="/pin">02.01.02 - pin</NavMenuItem>
            <NavMenuItem to="/initial">02.01.03 - initial</NavMenuItem>
            <NavMenuItem to="/account-select">02.01.04 - account select</NavMenuItem>
            <NavMenuItem to="/accounts-saved">02.01.05 - saved accounts</NavMenuItem>
            <NavMenuItem to="/account-connect">02.01.06 - connect account</NavMenuItem>
            <NavMenuItem to="/offline-history">02.01.08 - offline history</NavMenuItem>
            <NavMenuItem to="/annoucement">02.02.01 - annoucement</NavMenuItem>
            <NavMenuItem to="/subject-select">02.02.02 - select subject</NavMenuItem>
            <NavMenuItem to="/preloading">02.02.03 - preloading</NavMenuItem>
            <NavMenuItem to="/streak-login">02.03 - streak login</NavMenuItem>
            <br />
            <p className="text-gray-200 text-lg mb-3 font-bold">G03 : main menu</p>
            <NavMenuItem to="/main-menu">03.01.01 - main menu</NavMenuItem>
            <NavMenuItem to="/account">03.01.02 - account</NavMenuItem>
            <NavMenuItem to="/profile-share">03.01.04 - share profile</NavMenuItem>
            <NavMenuItem to="/main-menu-leaderboard">
              03.01.05 - main menu leaderboard
            </NavMenuItem>
            <NavMenuItem to="/homework-level">03.01.06 - homework level</NavMenuItem>
            <NavMenuItem to="/achievement-level">
              03.01.07 - achievement level
            </NavMenuItem>
            <NavMenuItem to="/redeem">03.03 - redeem</NavMenuItem>
            <NavMenuItem to="/avatar-custom">03.04 - custom avatar</NavMenuItem>
            <NavMenuItem to="/shop">03.05 - shop</NavMenuItem>
            <NavMenuItem to="/mailbox">03.06 - mail box</NavMenuItem>
            <NavMenuItem to="/arcade-game">03.08 - arcade game</NavMenuItem>
            <NavMenuItem to="/arcade-leaderboard/1">
              03.08.02 - arcade leaderboard
            </NavMenuItem>
            <NavMenuItem to="/report-bug">03.09 - report bug</NavMenuItem>
            <NavMenuItem to="/setting">03.10 - setting</NavMenuItem>

            <br />
            <p className="text-gray-200 text-lg mb-3 font-bold">G04 : lerning</p>
            <NavMenuItem to="/level/1">04.02.01 - level</NavMenuItem>

            <NavMenuItem to="/lesson">04.01.01 - lesson</NavMenuItem>
            <NavMenuItem to="/lesson-state/1">04.01.02 - lesson state*</NavMenuItem>
            <NavMenuItem to="/lesson-info/1">04.01.03 - lesson info*</NavMenuItem>
            <NavMenuItem to="/sublesson/1">04.01.04 - sub lesson*</NavMenuItem>
            {/* <NavMenuItem to="/sublesson-info/12/12a/1">
              04.01.05 - sub lesson info*
            </NavMenuItem> */}
            <NavMenuItem to="/homework">04.02.02 - homework</NavMenuItem>
            <NavMenuItem to="/achievement">04.02.03 - achievement</NavMenuItem>
            <NavMenuItem to="/lesson-leaderboard/1">
              04.02.04 - lesson leaderboard
            </NavMenuItem>
            <NavMenuItem to="/level-leaderboard/1">
              04.02.05 - level leaderboard
            </NavMenuItem>

            <NavMenuItem to="/quiz">04.03.01 - quiz*</NavMenuItem>
            <NavMenuItem to="/answer">04.03.02 - answer</NavMenuItem>

            {/* debugging purpose */}
            <NavMenuItem to="/model-renderer">01.00.07 - gameplay model</NavMenuItem>
            <br />
            <br />
          </ul>
        </nav>
      )}
      <main className="flex flex-1 flex-col">
        <GameCanvas>{props.children}</GameCanvas>
      </main>

      {/* {showDebug && (
        <footer className="bg-blue-800 text-white p-4">
          <p>Footer</p>
        </footer>
      )} */}
    </div>
  );
};

export default WCTRouteTemplate;

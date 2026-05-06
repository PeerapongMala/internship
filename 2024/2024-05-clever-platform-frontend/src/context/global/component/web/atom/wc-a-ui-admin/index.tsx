import Modal from '@component/web/molecule/wc-m-modal-overlay';
import { calculateScale } from '@global/helper/scaler';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DraggableCore } from 'react-draggable';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ButtonWithIcon from '../wc-a-button-with-icon';

import ImageAdminSwitchAccount from '@global/assets/admin-switch-account.svg';
import ImageArrowRight from '@global/assets/arrow-glyph-right.svg';
import HighlightSVG from '@global/assets/btn-top-hightlight.svg';
import { handleLogout } from '@global/helper/auth.ts';
import { cn } from '@global/helper/cn';
import StoreGlobalPersist from '@store/global/persist';
import { useTranslation } from 'react-i18next';

const WCAUIAdmin = ({ children }: any) => {
  const { t, i18n } = useTranslation(['global']);
  const [currentScale, setCurrentScale] = useState<number>(1);
  const [currentPosition, setCurrentPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [boundingRect, setBoundingRect] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  // set default of button size
  const defaultButtonSize = 48;
  // set default size of the scenario
  const scenarioSize: { width: number; height: number } = {
    width: 1280,
    height: 720,
  };

  const { adminId, adminFullname, userData } = StoreGlobalPersist.StateGet([
    'adminId',
    'adminFullname',
    'userData',
  ]);
  const isAdminMode = useMemo(() => {
    return adminId !== null && adminId.length > 0;
  }, [adminId]);

  useEffect(() => {
    const handleResize = () => {
      // calculate new bounding rect and scale
      calculateBoundingRect();

      // If the button is not in the bounding rect (safe area)
      // snap to closest edge
      if (buttonRef.current) {
        const buttonElement = buttonRef.current;
        const buttonRect = buttonElement.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        // Apply a smooth transition for repositioning
        buttonElement.style.transition = 'transform 0.2s ease-in-out';
        const safePosition = {
          x: Math.max(
            boundingRect.left,
            Math.min(
              buttonCenterX - buttonRect.width / 2,
              boundingRect.left + scenarioSize.width * currentScale - buttonRect.width,
            ),
          ),
          y: Math.max(
            boundingRect.top,
            Math.min(
              buttonCenterY - buttonRect.height / 2,
              boundingRect.top + scenarioSize.height * currentScale - buttonRect.height,
            ),
          ),
        };
        setCurrentPosition(safePosition);
      }
    };

    if (isAdminMode) {
      // enter admin mode, reset modal state
      setModalVisible(false);
    }

    // Initial calculation and resize listener
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isAdminMode]);

  // update the button size and position when the scale or position changes
  useEffect(() => {
    if (buttonRef.current) {
      const buttonElement = buttonRef.current;
      const buttonSize = `${defaultButtonSize * currentScale}px`;
      buttonElement.style.width = buttonSize;
      buttonElement.style.height = buttonSize;
      buttonElement.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px)`;
    }
  }, [currentPosition, currentScale]);

  // update the position of the button when the bounding rect changes
  useEffect(() => {
    if (buttonRef.current) {
      const buttonElement = buttonRef.current;
      const buttonRect = buttonElement.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      // Calculate the new position
      const newX = Math.max(
        boundingRect.left,
        Math.min(
          buttonCenterX - buttonRect.width / 2,
          boundingRect.left + scenarioSize.width * currentScale - buttonRect.width,
        ),
      );
      const newY = Math.max(
        boundingRect.top,
        Math.min(
          buttonCenterY - buttonRect.height / 2,
          boundingRect.top + scenarioSize.height * currentScale - buttonRect.height,
        ),
      );
      setCurrentPosition({ x: newX, y: newY });
    }
  }, [boundingRect]);

  const calculateBoundingRect = () => {
    const { offsetWidth: width, offsetHeight: height } = document.body;
    const newScale = calculateScale({ width, height }, scenarioSize);
    setCurrentScale(newScale);

    const paddingTop = Math.max(0, (height - 720 * newScale) / 2);
    const paddingLeft = Math.max(0, (width - 1280 * newScale) / 2);
    setBoundingRect({
      left: paddingLeft,
      top: paddingTop,
    });

    return {
      scale: newScale,
      boundingRect: {
        left: paddingLeft,
        top: paddingTop,
      },
    };
  };

  // Update the position of the button to (x, y) of screen
  const handleButtonDrag = (x: number, y: number) => {
    if (buttonRef.current) {
      // Get the button element
      const buttonElement = buttonRef.current;

      // clear the transition
      buttonElement.style.transition = '';

      // Get the bounding rect of the button element
      // the button element should be inside the bounding rect
      const bounding = {
        width: scenarioSize.width * currentScale,
        height: scenarioSize.height * currentScale,
      };
      const buttonRect = buttonElement.getBoundingClientRect();

      // Calculate the new position
      const newX = Math.max(
        boundingRect.left,
        Math.min(
          x - buttonRect.width / 2,
          boundingRect.left + bounding.width - buttonRect.width,
        ),
      );
      const newY = Math.max(
        boundingRect.top,
        Math.min(
          y - buttonRect.height / 2,
          boundingRect.top + bounding.height - buttonRect.height,
        ),
      );
      // Update the button position
      setCurrentPosition({ x: newX, y: newY });
    }
  };

  const handleButtonDragStop = () => {
    // If the position hasn't changed, do on click action
    if (
      isAdminMode &&
      currentPosition.x === prevPosition.x &&
      currentPosition.y === prevPosition.y
    ) {
      setModalVisible(true);
    } else {
      // otherwise, snap the button to the closest edge
      handleSnapEdge();
    }
  };

  const handleSnapEdge = () => {
    if (!buttonRef.current) return;

    const buttonElement = buttonRef.current;
    const buttonRect = buttonElement.getBoundingClientRect();

    // Apply a smooth transition for repositioning
    buttonElement.style.transition = 'transform 0.2s ease-in-out';

    // Calculate the center of the button
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Calculate distances to each edge
    const distanceToLeftEdge = buttonCenterX - boundingRect.left;
    const distanceToRightEdge =
      boundingRect.left + scenarioSize.width * currentScale - buttonCenterX;
    const distanceToTopEdge = buttonCenterY - boundingRect.top;
    const distanceToBottomEdge =
      boundingRect.top + scenarioSize.height * currentScale - buttonCenterY;

    // Find the closest edge
    const minDistance = Math.min(
      distanceToLeftEdge,
      distanceToRightEdge,
      distanceToTopEdge,
      distanceToBottomEdge,
    );

    // Determine the new position based on the closest edge
    let newPosition;
    if (minDistance === distanceToLeftEdge) {
      // Snap to the left edge
      newPosition = { x: boundingRect.left, y: currentPosition.y };
    } else if (minDistance === distanceToRightEdge) {
      // Snap to the right edge
      newPosition = {
        x: boundingRect.left + scenarioSize.width * currentScale - buttonRect.width,
        y: currentPosition.y,
      };
    } else if (minDistance === distanceToTopEdge) {
      // Snap to the top edge
      newPosition = { x: currentPosition.x, y: boundingRect.top };
    } else {
      // Snap to the bottom edge
      newPosition = {
        x: currentPosition.x,
        y: boundingRect.top + scenarioSize.height * currentScale - buttonRect.height,
      };
    }

    // Update the button position
    setCurrentPosition(newPosition);
  };

  if (!isAdminMode) return <></>;

  return (
    <>
      <div className="absolute top-0 left-0 w-0 h-0">
        <DraggableCore
          nodeRef={buttonRef}
          grid={[5, 5]}
          onStart={(e, data) => {
            setPrevPosition({ ...currentPosition });
          }}
          onDrag={(e, data) => {
            handleButtonDrag(data.x, data.y);
          }}
          onStop={(e, data) => {
            handleButtonDragStop();
          }}
        >
          <div
            ref={buttonRef}
            id="admin-ui-handle"
            className={cn(
              'relative cursor-move select-none',
              'border-box border-b-4 rounded-full',
              'bg-ghost/80 border-ghost-border',
            )}
            style={{
              boxShadow:
                '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
            }}
            onFocus={() => {}}
          >
            <img
              src={HighlightSVG}
              className="absolute top-0 left-0 h-full w-auto select-none pointer-events-none"
            />
            <img
              title="admin switch icon"
              src={ImageAdminSwitchAccount}
              className="w-full h-auto p-2 select-none pointer-events-none"
            />
          </div>
        </DraggableCore>
      </div>
      {isModalVisible && (
        <ResponsiveScaler
          scenarioSize={{ width: 1280, height: 720 }}
          className="!absolute flex-1 w-full h-full top-0 left-0"
        >
          <Modal
            title={t('admin_panel.title')}
            overlay={true}
            zIndex={1000}
            isVisible={isModalVisible}
            setVisibleModal={setModalVisible}
            className="bg-white/85 !w-2/5"
            headerClassName="bg-transparent border-b-2 border-dashed border-secondary"
            customBody={
              <div className="flex-1 flex flex-col p-4 text-xl gap-4 p-12">
                <div className="flex justify-between items-center gap-8">
                  <div>{t('admin_panel.login_by_admin')}</div>
                  <div>{adminFullname}</div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <div>{t('admin_panel.uuid')}</div>
                  <div>{adminId}</div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <div>{t('admin_panel.school_id')}</div>
                  <div>{userData?.school_code}</div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <div>{t('admin_panel.student_id')}</div>
                  <div>{userData?.student_id}</div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <div>{t('admin_panel.student_account')}</div>
                  <div>{`${userData?.title} ${userData?.first_name} ${userData?.last_name}`}</div>
                </div>
              </div>
            }
            customFooter={
              <div className="flex items-center justify-center w-full">
                <ButtonWithIcon
                  icon={ImageArrowRight}
                  className="w-2/3"
                  textClassName="text-2xl"
                  variant="danger"
                  onClick={handleLogout}
                >
                  {t('admin_panel.logout')}
                </ButtonWithIcon>
              </div>
            }
          />
        </ResponsiveScaler>
      )}
    </>
  );
};

export default WCAUIAdmin;

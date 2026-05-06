import React, { CSSProperties } from 'react';

import ButtonWithIcon from '@component/web/atom/wc-a-button-with-icon';
import IconButtonWithNotification from '@component/web/atom/wc-a-icon-button-with-notification';
import { useTranslation } from 'react-i18next';
import FooterButton1 from '../../../../assets/chat-read.svg';
import FooterButton2 from '../../../../assets/trash.svg';

export interface AnnouncementFooterProps {
  t: ReturnType<typeof useTranslation>['t'];
  currentTabSelected: number;
  onAllReadClicked?: () => void | undefined;
  onDeleteReadClicked?: () => void | undefined;
  onDeleteClick?: () => void | undefined;
}

interface FooterActionProps {
  BackgroundImage?: string;
  TextToDisplay?: string;
  Icon?: string;
  OnClickEvent?: () => void;
  iconPosition?: 'right' | 'left';
  style?: CSSProperties;
  separatorStyle?: CSSProperties;
  className?: string;
  disabled?: boolean;
}

const ContainerProperties: React.CSSProperties = {
  width: 'stretch',
  display: 'flex',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  background: `var(--white, #ffffff)`,
  position: 'relative',
  borderTop: '1px dashed var(--rainbow-yellow, #FCD401)',
  // padding: '12px 0',
};

const SlotsContainerProperties: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  width: 144 * 2,
  height: 'auto',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flex: '0 0 auto',
  gap: '16px',
};

const AnnounceActionContainer: React.CSSProperties = {
  width: 404 * 2,
  height: '100%',
  position: 'relative',
  listStyleType: 'none',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  padding: '8px 0',
};

const ActionIconProperties: React.CSSProperties = {
  width: 175 * 2,
  height: 68,
  //top: '50%',
};

class WCTAnnouncementFooter<
  T extends AnnouncementFooterProps,
> extends React.Component<T> {
  FixedContainerSize = 48 * 2;
  SmallActionDisplay = [
    {
      BackgroundImage: FooterButton1,
      backgroundColor: 'hsla(209, 100%, 53%, 1)',
      borderBottomColor: 'hsla(209, 100%, 80%, 1)',
      OnClickEvent: () => {
        if (this.props.onAllReadClicked) this.props.onAllReadClicked();
      },
    },
    {
      BackgroundImage: FooterButton2,
      backgroundColor: '#F9060F',
      borderBottomColor: '#F2888C',
      OnClickEvent: () => {
        if (this.props.onDeleteReadClicked) this.props.onDeleteReadClicked();
      },
    },
  ];
  ActionDisplay = Array<FooterActionProps>();
  currentTabSelected = 0;
  DoNotShowDelete = false;
  slotsContainerRef: React.RefObject<HTMLDivElement> = React.createRef(); // Create a ref object

  constructor(props: T) {
    super(props);
  }

  render() {
    return (
      <div
        className="absolute inset-0"
        style={{ ...ContainerProperties, height: this.FixedContainerSize }}
      >
        {/* Action Small Button Container */}
        <div className="absolute inset-0" style={SlotsContainerProperties}>
          {this.SmallActionDisplay.map((action, index) => {
            if (index === 1 && this.DoNotShowDelete) {
              return null;
            }

            return (
              <IconButtonWithNotification
                key={index}
                width={64}
                height={64}
                buttonStyle={{
                  backgroundColor: action.backgroundColor,
                  borderBottomColor: action.borderBottomColor,
                }}
                iconSrc={action.BackgroundImage}
                onClick={() => {
                  action.OnClickEvent();
                }}
              />
            );
          })}
        </div>
        {/* Action Container */}
        <div className="relative inset-0" style={AnnounceActionContainer}>
          {this.ActionDisplay.map((action, index) => (
            <div
              key={index}
              style={{
                ...ActionIconProperties,
              }}
            >
              <ButtonWithIcon
                icon={action.Icon || ''}
                className="w-full"
                onClick={action.OnClickEvent}
                iconPosition={action.iconPosition}
                style={action.style}
                seperatorStyle={action.separatorStyle}
                disabled={action.disabled}
              >
                {action.TextToDisplay || ''}
              </ButtonWithIcon>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default WCTAnnouncementFooter;

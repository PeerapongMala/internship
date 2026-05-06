import React from 'react';

import WCATabbarSlot from '../../molecule/infodialog-tabslot';

interface AnnounceMenuState {
  selectedAnnounce: number;
  selectedTab: number;
}

export interface AnnounceSlotsProps {
  interfaceState?: AnnounceMenuState;
  onTabClick: (stateflow: number) => void;
  onTabClose?: () => void;
  // Add other props here
}

class SuperWCTAnnouncementTab extends React.Component<AnnounceSlotsProps> {
  TabBarToDisplay: Array<{ key: number; backgroundImage: string }> = [];

  constructor(props: AnnounceSlotsProps) {
    super(props);
  }

  // Component implementation
  render() {
    return (
      <div className="absolute inset-0" style={AnnouncementTopBar}>
        {this.TabBarToDisplay.map(
          (
            _,
            index, // Generate 2 list elements
          ) => (
            <WCATabbarSlot
              fixedwitdh={100 / this.TabBarToDisplay.length + '%'}
              key={_.key}
              KeyZIndex={_.key}
              selectedTab={_.key == this.props.interfaceState?.selectedTab}
              backgroundImage={_.backgroundImage}
              onTabClick={this.props.onTabClick}
            />
          ),
        )}
      </div>
    );
  }
}

const AnnouncementTopBar: React.CSSProperties = {
  width: 'stretch',
  height: 36 * 2,
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  background: `var(--white, #ffffff)`,
  position: 'relative',
};

class WCTAnnouncementTab extends SuperWCTAnnouncementTab {
  constructor(props: AnnounceSlotsProps) {
    super(props);
  }
}

export default WCTAnnouncementTab;

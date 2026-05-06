import React from 'react';

import WCTAnnounceListSlot from '../../molecule/infodialog-selectslot';

import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

export interface AnnouncementBodyProps<T> {
  t: ReturnType<typeof useTranslation>['t'];
  onSlotsClick: (announceKey: number) => void;
  announcements: Announcement<T>[];
  noAnnouncementText?: string;
  selectedIndex: number;
  showDate?: boolean;
}

export interface Announcement<T> {
  announcement_id: number;
  title: string;
  started_at?: string;
  ended_at?: string;
  date?: string; // final date format
  announceContent: T;
  is_read?: boolean;
  is_deleted?: boolean;
}

export function announcementDataResponseHelper<T>(announcement: any): Announcement<T> {
  const {
    announcement_id,
    title,
    started_at,
    ended_at,
    is_read: is_read,
    ...announceContent
  } = announcement;
  return {
    announcement_id,
    title,
    started_at,
    ended_at,
    announceContent,
    is_read,
    is_deleted: false,
  };
}

abstract class WCTAnnouncementBody<
  P extends AnnouncementBodyProps<T>,
  T,
> extends React.Component<P> {
  FixedContainerSize = 203 * 2;

  render() {
    const {
      t,
      noAnnouncementText = '',
      announcements = [],
      selectedIndex = -1,
      showDate = true,
    } = this.props;

    const ContainerProperties: React.CSSProperties = {
      width: 'stretch',
      height: this.FixedContainerSize,
      display: 'flex',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      background: `rgba(255, 255, 255, 0.8)`, // Added alpha channel value (0.8) for transparency
      position: 'relative',
    };

    return (
      <div className="absolute inset-0" style={ContainerProperties}>
        {announcements.length === 0 ? (
          <div
            style={{
              ...ContainerProperties,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              background: `rgba(255, 255, 255, 0.8)`, // Added alpha channel value (0.8) for transparency
              minHeight: '437px',
            }}
            className="absolute inset-0 text-2xl font-bold tracking-wide leading-6	h-full"
          >
            {noAnnouncementText}
          </div>
        ) : (
          <>
            {this.renderAnnouncementList()}
            {this.renderAnnouncementContent()}
          </>
        )}
      </div>
    );
  }

  renderAnnouncementList() {
    const { announcements = [] } = this.props;

    const SlotsContainerProperties: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      flex: '0 0 auto',
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: '437px',
    };

    return (
      <div className="absolute inset-0 h-full" style={SlotsContainerProperties}>
        {announcements.map(
          (item, index) => !item.is_deleted && this.renderTabSlot(item, index),
        )}
      </div>
    );
  }

  renderTabSlot(announcement: Announcement<T>, index: number): React.ReactNode {
    const { t, onSlotsClick, selectedIndex = -1, showDate = true } = this.props;
    return (
      <WCTAnnounceListSlot
        t={t}
        key={index}
        index={index}
        announceTitle={announcement.title}
        announceDate={announcement.date}
        showDate={showDate}
        IsRead={announcement.is_read}
        IsSelected={index === selectedIndex}
        onSlotsClick={onSlotsClick}
      />
    );
  }

  renderHeader(announcement: Announcement<T>): React.ReactNode {
    const { t, showDate = true } = this.props;
    const { is_deleted, is_read } = announcement;

    const HeaderTitleProperties: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 1,
      alignSelf: 'stretch',
      color: 'var(--text-gray-20, #333)', // Fixed the variable reference
      textOverflow: 'ellipsis', // Fixed the property name
      /* 14B */
      fontFamily: 'Noto Sans Thai', // Fixed the property name
      fontSize: 14 * 2, // Fixed the type
      fontStyle: 'normal', // Fixed the property name
      fontWeight: 700, // Fixed the property name
      lineHeight: 'normal', // Fixed the property name
      letterSpacing: '-0.42px', // Fixed the property name
    };

    const HeaderDateProperties: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 1,
      alignSelf: 'stretch',
      color: '#333', // Fixed the variable reference
      /* 12R */
      fontFamily: 'Noto Sans Thai', // Fixed the property name
      fontSize: 18, // Fixed the type
      fontStyle: 'normal', // Fixed the property name
      fontWeight: 400, // Fixed the property name
      lineHeight: 'normal', // Fixed the property name
      letterSpacing: '-0.36px', // Fixed the property name
    };

    return (
      <>
        {!is_deleted ? (
          <div style={HeaderTitleProperties}>{announcement.title}</div>
        ) : null}

        {showDate && !is_deleted && (
          <div style={HeaderDateProperties}>
            {t('header_announce_date', { date: announcement.date })}
          </div>
        )}
      </>
    );
  }

  abstract renderContent(announcement: Announcement<T>): React.ReactNode;

  renderAnnouncementContent() {
    const { announcements = [], selectedIndex = -1, showDate = true } = this.props;
    // If the selected index is out of range, return an empty fragment
    if (selectedIndex >= announcements.length || selectedIndex < 0) return <></>;

    const selectedIndexment = announcements[selectedIndex];
    const { is_deleted, is_read } = selectedIndexment;

    const AnnounceDisplayContainer: React.CSSProperties = {
      // ...
      width: 404 * 2,
      height: 'stretch',
      flex: '1 0 0',
      position: 'relative',
      padding: '1px', // Add padding
      listStyleType: 'none', // Add list style type
      display: 'flex', // Add Flexbox display
      flexDirection: 'column', // Stack items vertically
    };

    const BodyDisplayProperties: React.CSSProperties = {
      width: 'stretch',
      height: 300,
      alignItems: 'flex-start',
      flexDirection: 'column',
      alignSelf: 'stretch',
      position: 'relative',
      overflowY: 'auto', // Added this property
    };

    const HeaderDisplayProperties: React.CSSProperties = {
      // ...
      width: 'stretch',
      borderBottom: is_deleted ? '0px' : '1px dashed var(--rainbow-yellow, #FCD401)',
      display: 'flex',
      height: 56 * 2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    };

    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={AnnounceDisplayContainer}
      >
        {/* header */}
        <div style={{ ...HeaderDisplayProperties, padding: '12px 15px' }}>
          {this.renderHeader(selectedIndexment)}
        </div>
        {/* content */}
        <div
          style={{
            ...BodyDisplayProperties,
            overflowY: 'auto',
            padding: '12px 15px',
          }}
        >
          {this.renderContent(selectedIndexment)}
        </div>
      </div>
    );
  }
}

export default WCTAnnouncementBody;

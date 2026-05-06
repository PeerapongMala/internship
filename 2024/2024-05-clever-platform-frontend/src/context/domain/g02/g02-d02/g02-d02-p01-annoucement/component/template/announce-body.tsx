import WCTAnnouncementBody, {
  Announcement,
  AnnouncementBodyProps,
} from '@global/component/web/organism/infodialog-body';
import sanitize from 'sanitize-html';
import { AnnounceContent } from '../../type';

export default class AnnounceBody extends WCTAnnouncementBody<
  AnnouncementBodyProps<AnnounceContent>,
  AnnounceContent
> {
  constructor(props: AnnouncementBodyProps<AnnounceContent>) {
    super(props);
    this.FixedContainerSize = 211 * 2;
  }

  renderTabSlot(announcement: Announcement<any>, index: number) {
    let date = '';
    if (announcement.started_at) {
      const startedAt = new Date(announcement.started_at);
      date += startedAt.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }

    if (announcement.ended_at) {
      const startedAt = new Date(announcement.ended_at);
      date +=
        (date && ' - ') +
        startedAt.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
    }
    return super.renderTabSlot({ ...announcement, date }, index);
  }

  renderHeader(announcement: Announcement<AnnounceContent>): React.ReactNode {
    const { t, showDate = true } = this.props;

    let date = '';
    if (announcement.started_at) {
      const startedAt = new Date(announcement.started_at);
      date += startedAt.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }

    if (announcement.ended_at) {
      const startedAt = new Date(announcement.ended_at);
      date +=
        (date && ' - ') +
        startedAt.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
    }

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
          <div style={HeaderDateProperties}>{t('header_announce_date', { date })}</div>
        )}
      </>
    );
  }

  renderContent(announcement: Announcement<AnnounceContent>): React.ReactNode {
    const { announceContent } = announcement;

    const ContentTextProp: React.CSSProperties = {
      width: '100%',
      position: 'relative',
      height: 'auto',
    };

    const ContentBodyProp: React.CSSProperties = {
      width: '100%',
      position: 'relative',
      aspectRatio: '16/9',
      maxHeight: '650px',
      backgroundImage: this.props.announcements[this.props.selectedIndex].announceContent?.image_url
        ? `url(${this.props.announcements[this.props.selectedIndex].announceContent.image_url})`
        : 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      margin: '0 auto',
      borderRadius: '8px',
      overflow: 'hidden',
    };

    return (
      <>
        {announceContent?.image_url && announceContent?.image_url !== 'nil' && (
          <div style={ContentBodyProp} />
        )}
        {announceContent?.description && (
          <div
            style={ContentTextProp}
            className="ql-editor text-lg !p-0 mt-5"
            dangerouslySetInnerHTML={{
              __html: sanitize(announceContent?.description, {
                allowedTags: sanitize.defaults.allowedTags.concat(['img']),
              }),
            }}
          />
        )}
      </>
    );
  }
}

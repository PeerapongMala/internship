import { GiftContent } from '@domain/g03/g03-d06/local/type';
import WCTAnnouncementBody, {
  Announcement,
  AnnouncementBodyProps,
} from '@global/component/web/organism/infodialog-body';
import sanitize from 'sanitize-html';

interface ExtendedAnnouncementBodyProps extends AnnouncementBodyProps<any> {
  currentTabSelected: number;
}

class AnnounceBody extends WCTAnnouncementBody<ExtendedAnnouncementBodyProps, any> {
  constructor(props: ExtendedAnnouncementBodyProps) {
    super(props);
    this.FixedContainerSize = 211 * 2;
  }

  renderTabSlot(announcement: Announcement<any>, index: number) {
    const { t, currentTabSelected } = this.props;

    // if the current tab is activity tab
    if (currentTabSelected === 0) {
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

    // if the current tab is teacher gift tab
    if (currentTabSelected === 2) {
      const content = announcement as Announcement<GiftContent>;

      if (content.announceContent.sended_at) {
        const sendedAt = new Date(content.announceContent.sended_at);
        content.date = sendedAt.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return super.renderTabSlot(
        {
          ...content,
          title: t('teacher_gift_title', {
            reward_name: content.announceContent.name,
            teacher_name: content.announceContent.sended_from,
          }),
          is_read: content.announceContent.status === 'received',
        },
        index,
      );
    }

    // if announcement has started_at, convert it to local date time
    if (announcement.started_at) {
      const startedAt = new Date(announcement.started_at);
      announcement.date = startedAt.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return super.renderTabSlot(announcement, index);
  }

  renderHeader(announcement: Announcement<any>): React.ReactNode {
    const { t, currentTabSelected } = this.props;
    const { announceContent } = announcement;

    // if the current tab is activites
    if (currentTabSelected === 0) {
      const { t, showDate = true } = this.props;
      const { is_deleted } = announcement;

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
              {t('header_announce_activity_date', { date })}
            </div>
          )}
        </>
      );
    }

    // if the current tab is teacher gift
    if (currentTabSelected === 2) {
      const content = announceContent as GiftContent;
      content.description = t('teacher_gift_description', {
        reward_name: content.name,
        reward_amount: content.amount,
        teacher_name: content.sended_from,
      });
      return super.renderHeader({
        ...announcement,
        announceContent: content,
        title: t('teacher_gift_title', {
          reward_name: content.name,
          teacher_name: content.sended_from,
        }),
      });
    }

    // if announcement has started_at, convert it to local date time
    if (announcement.started_at) {
      const startedAt = new Date(announcement.started_at);
      announcement.date = startedAt.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return super.renderHeader(announcement);
  }

  renderContent(announcement: Announcement<any>): React.ReactNode {
    const { announceContent } = announcement;

    const ContentTextProp: React.CSSProperties = {
      width: '100%',
      position: 'relative',
      height: 'auto',
    };

    const ContentBodyProp: React.CSSProperties = {
      // ...
      width: '100%',
      position: 'relative',
      height: 350,
      backgroundImage: this.props.announcements[this.props.selectedIndex].announceContent
        ? `url(${this.props.announcements[this.props.selectedIndex].announceContent?.image_url})`
        : '',
      backgroundRepeat: 'no-repeat',
    };

    return (
      <>
        {announceContent?.image_url && announceContent?.image_url !== 'nil' && (
          <div style={ContentBodyProp} />
        )}
        {announceContent?.description && (
          <div
            style={ContentTextProp}
            className="ql-editor text-lg !p-0"
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

export default AnnounceBody;

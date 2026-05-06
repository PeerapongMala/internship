import React from 'react';
import WCTAnnounceListSlot from '../infodialog-selectslot';
interface AnnouncementBodyProps {
  onSlotsClick: (announceKey: number) => void;
  t: (key: string) => string;
  announcedata: Announcement[];
  selectedannounce: number;
}

export interface AnnounceContent {
  Report?: string;
}

export interface Announcement {
  id?: number | string;
  header: string;
  announceDate?: string;
  content?: string;
  shortTitle?: string;
  showDate?: boolean | true;
  announceContent?: AnnounceContent;
  IsRead?: boolean;
  IsDeleted?: boolean;
  status: number;
  translatedHeader?: string;
}

class WCTAnnouncementBody extends React.Component<AnnouncementBodyProps> {
  FixedContainerSize = 203 * 4;

  render() {
    const { onSlotsClick, t, announcedata, selectedannounce } = this.props;
    const selectannouncement = announcedata[selectedannounce];
    selectannouncement.IsRead = true;

    const ContainerProperties: React.CSSProperties = {
      width: '100%',
      height: this.FixedContainerSize,
      display: 'flex',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      background: `rgba(255, 255, 255, 0.8)`,
      position: 'relative',
    };

    const SlotsContainerProperties: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      width: 144 * 2,
      height: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      flex: '0 0 auto',
    };

    const AnnounceDisplayContainer: React.CSSProperties = {
      width: 404 * 2,
      height: '100%',
      flex: '1 0 0',
      position: 'relative',
      padding: '1px',
      listStyleType: 'none',
      display: 'flex',
      flexDirection: 'column',
    };

    const HeaderDisplayProperties: React.CSSProperties = {
      //width: '100%',
      borderBottom: selectannouncement.IsDeleted
        ? '0px'
        : '1px dashed var(--rainbow-yellow, #FCD401)',
      display: 'flex',
      height: 56 * 2,
      padding: '8px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    };

    const HeaderTitleProperties: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 1,
      alignSelf: 'stretch',
      color: 'var(--text-gray-20, #333)',
      textOverflow: 'ellipsis',
      fontFamily: 'Noto Sans Thai',
      fontSize: 14 * 2,
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal',
      letterSpacing: '-0.42px',
    };

    const HeaderDateProperties: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 1,
      alignSelf: 'stretch',
      color: '#333',
      fontFamily: 'Noto Sans Thai',
      fontSize: 12 * 2,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: '-0.36px',
    };

    const BodyDisplayProperties: React.CSSProperties = {
      width: '100%',
      height: 350,
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'start',
      textAlign: 'start',
      fontSize: 18,
      fontWeight: 700,
      color: '#333',
      padding: '16px',
      // backgroundColor: '#f18973',
    };

    const ReportContent =
      selectannouncement.announceContent?.Report || 'No content available';

    return (
      <div className="absolute inset-0" style={ContainerProperties}>
        <div className="absolute inset-0" style={SlotsContainerProperties}>
          {announcedata.map(
            (MappedData, index) =>
              !MappedData.IsDeleted && (
                <WCTAnnounceListSlot
                  key={index}
                  onSlotsClick={onSlotsClick}
                  t={t}
                  index={index}
                  announceTitle={MappedData.shortTitle || MappedData.header}
                  IsRead={MappedData.IsRead}
                  IsSelected={index === selectedannounce}
                  showDate={MappedData.showDate}
                  dateCreate={MappedData.announceDate}
                />
              ),
          )}
        </div>

        {/*Announcement Display*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={AnnounceDisplayContainer}
        >
          <div className="flex justify-between">
            <div key={1} style={HeaderDisplayProperties}>
              {!selectannouncement.IsDeleted ? (
                <div style={HeaderTitleProperties}>
                  {selectannouncement.translatedHeader || selectannouncement.header}
                </div>
              ) : (
                <div />
              )}

              {selectannouncement.showDate && !selectannouncement.IsDeleted && (
                <div style={HeaderDateProperties}>
                  {t('bugReport.date_title')}: {selectannouncement.announceDate}
                </div>
              )}
            </div>
            <div className="my-auto">
              <span
                className="mr-5 inline-flex items-center justify-center w-[165px] h-[46px] text-black text-2xl mx-2 font-medium rounded-[18px]"
                style={{
                  background:
                    selectannouncement.status === 1
                      ? 'linear-gradient(180deg, #36ADFD 0%, #1E88E5 50%, #0D47A1 100%)'
                      : selectannouncement.status === 2
                        ? 'linear-gradient(180deg, #FFD54F 0%, #FFC107 50%, #FF8F00 100%)'
                        : selectannouncement.status === 3
                          ? 'linear-gradient(180deg, #FDEB36 0%, #78EC00 50%, #079017 100%)'
                          : 'linear-gradient(180deg, #B0BEC5 0%, #78909C 50%, #546E7A 100%)',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}
              >
                {selectannouncement.status === 1
                  ? t('bugReport.pending')
                  : selectannouncement.status === 2
                    ? t('bugReport.inProgress')
                    : selectannouncement.status === 3
                      ? t('bugReport.fixedSuccessfully')
                      : t('bugReport.closed')}
              </span>
            </div>
          </div>
          <div key={2} style={BodyDisplayProperties}>
            {ReportContent}
          </div>
        </div>
      </div>
    );
  }
}

export default WCTAnnouncementBody;

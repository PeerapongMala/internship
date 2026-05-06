import WCTAnnouncementBody, { Announcement } from './infodialog-body';

interface AnnouncementBodyProps {
  onSlotsClick: (announceKey: number) => void;
  t: (key: string) => string;
  announcedata: AnnouncementData[];
  selectedannounce: number;
  header: string;
}

interface AnnouncementData extends Announcement {
  shortTitle: string;
  title: string;
  announceData: string;
  showDate: boolean;
  announceDisplay: Array<any>;
  announceContent?: {
    Report: string;
  };
  status: number;
}

class ReportAnnounceBody extends WCTAnnouncementBody {
  constructor(props: AnnouncementBodyProps) {
    super(props);

    const updatedAnnouncedata = [...props.announcedata];

    if (updatedAnnouncedata[0]?.announceContent) {
      updatedAnnouncedata[0].announceContent = {
        Report: updatedAnnouncedata[0].announceContent.Report || '',
      };
    }

    this.state = {
      announcedata: updatedAnnouncedata,
    };
    this.FixedContainerSize = 211 * 4;
  }
}

export default ReportAnnounceBody;

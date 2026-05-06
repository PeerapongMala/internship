import WCTAnnouncementFooter, {
  AnnouncementFooterProps,
} from '@global/component/web/organism/infodialog-footer';

class AnnounceFooter extends WCTAnnouncementFooter<AnnouncementFooterProps> {
  constructor(props: AnnouncementFooterProps) {
    super(props);

    this.FixedContainerSize = 80;
    this.DoNotShowDelete = true;
  }
}

export default AnnounceFooter;

import WCTAnnouncementFooter, {
  AnnouncementFooterProps,
} from '@global/component/web/organism/infodialog-footer';
import DeleteAction from '../../../assets/DeleteAction.png';
import iconarrowright from '../../../assets/icon-arrow-right.svg';
import claimButton from '../../../assets/receive.svg';
import deleteButton from '../../../assets/trash.svg';

interface ExtendedAnnouncementFooterProps extends AnnouncementFooterProps {
  isItemReceived?: boolean;
  onReceiveClick?: () => void;
  onJoinActivityClick?: () => void;
}

class AnnounceFooter extends WCTAnnouncementFooter<ExtendedAnnouncementFooterProps> {
  constructor(props: ExtendedAnnouncementFooterProps) {
    super(props);
    this.FixedContainerSize = 80;
  }

  render() {
    const {
      t,
      isItemReceived,
      currentTabSelected,
      onDeleteClick,
      onReceiveClick,
      onJoinActivityClick,
    } = this.props;

    this.ActionDisplay = [];
    this.DoNotShowDelete = false;
    // activity tab
    if (currentTabSelected === 0) {
      this.DoNotShowDelete = true;
      this.ActionDisplay.push({
        TextToDisplay: t('btn_footer_join_activity'),
        OnClickEvent: onJoinActivityClick,
        Icon: iconarrowright,
        style: { backgroundColor: '#1762f3' },
      });
    }

    // mailbox tab
    if (currentTabSelected === 1) {
      this.ActionDisplay = [
        {
          BackgroundImage: DeleteAction,
          TextToDisplay: t('btn_footer_delete_message'),
          iconPosition: 'left',
          Icon: deleteButton,
          OnClickEvent: onDeleteClick,
          style: { backgroundColor: 'red', borderBottom: '4px solid red' },
          separatorStyle: { borderColor: '#ff5050' },
          disabled: !isItemReceived,
        },
        {
          TextToDisplay: isItemReceived
            ? t('btn_footer_open_inventory')
            : t('btn_footer_receive_item'),
          iconPosition: 'left',
          OnClickEvent: onReceiveClick,
          Icon: claimButton,
          style: { backgroundColor: '#1762f3' },
        },
      ];
    }

    // gift tab
    if (currentTabSelected === 2) {
      this.ActionDisplay = [
        {
          BackgroundImage: DeleteAction,
          TextToDisplay: t('btn_footer_delete_message'),
          iconPosition: 'left',
          Icon: deleteButton,
          OnClickEvent: onDeleteClick,
          style: { backgroundColor: 'red', borderBottom: '4px solid red' },
          separatorStyle: { borderColor: '#ff5050' },
          disabled: !isItemReceived,
        },
        {
          TextToDisplay: isItemReceived
            ? t('btn_footer_open_inventory')
            : t('btn_footer_receive_item'),
          iconPosition: 'left',
          OnClickEvent: onReceiveClick,
          Icon: claimButton,
          style: { backgroundColor: '#1762f3' },
        },
      ];
    }

    // notification tab
    if (currentTabSelected === 3) {
      this.ActionDisplay = [
        {
          BackgroundImage: DeleteAction,
          TextToDisplay: t('btn_footer_delete_message'),
          iconPosition: 'left',
          Icon: deleteButton,
          OnClickEvent: onDeleteClick,
          style: { backgroundColor: 'red', borderBottom: '4px solid red' },
          separatorStyle: { borderColor: '#ff5050' },
        },
      ];
    }

    return super.render();
  }
}

export default AnnounceFooter;

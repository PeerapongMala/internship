import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

//** Icon */}
import Icon20 from '@core/design-system/library/component/icon/Icon20';
import IconActivity from '@core/design-system/library/component/icon/IconActivity';
import IconAlignJustify from '@core/design-system/library/component/icon/IconAlignJustify';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconArrowCircleLeft from '@core/design-system/library/component/icon/IconArrowCircleLeft';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconArrowDownward from '@core/design-system/library/component/icon/IconArrowDownward';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import IconArrowUp from '@core/design-system/library/component/icon/IconArrowUp';
import IconArrowUpward from '@core/design-system/library/component/icon/IconArrowUpward';
import IconAssign from '@core/design-system/library/component/icon/IconAssign';
import IconBag from '@core/design-system/library/component/icon/IconBag';
import IconBarChart from '@core/design-system/library/component/icon/IconBarChart';
import IconBell from '@core/design-system/library/component/icon/IconBell';
import IconBook from '@core/design-system/library/component/icon/IconBook';
import IconBookmark from '@core/design-system/library/component/icon/IconBookmark';
import IconCalendar from '@core/design-system/library/component/icon/IconCalendar';
import IconCamera from '@core/design-system/library/component/icon/IconCamera';
import IconClock from '@core/design-system/library/component/icon/IconClock';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import IconCopy from '@core/design-system/library/component/icon/IconCopy';
import IconCopyItem from '@core/design-system/library/component/icon/IconCopyItem';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconDatabase from '@core/design-system/library/component/icon/IconDatabase';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEdit from '@core/design-system/library/component/icon/IconEdit';
import IconError from '@core/design-system/library/component/icon/IconError';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconFile from '@core/design-system/library/component/icon/IconFile';
import IconFileText1 from '@core/design-system/library/component/icon/IconFileText1';
import IconFlag from '@core/design-system/library/component/icon/IconFlag';
import IconFolder from '@core/design-system/library/component/icon/IconFolder';
import IconForward from '@core/design-system/library/component/icon/IconForward';
import IconGraphicEq from '@core/design-system/library/component/icon/IconGraphicEq';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconHome from '@core/design-system/library/component/icon/IconHome';
import IconImage from '@core/design-system/library/component/icon/IconImage';
import IconImportContacts from '@core/design-system/library/component/icon/IconImportContacts';
import IconKey from '@core/design-system/library/component/icon/IconKey';
import IconLink from '@core/design-system/library/component/icon/IconLink';
import IconMail from '@core/design-system/library/component/icon/IconMail';
import IconMessageSquare from '@core/design-system/library/component/icon/IconMessageSquare';
import IconMicrophone from '@core/design-system/library/component/icon/IconMicrophone';
import IconMonitor from '@core/design-system/library/component/icon/IconMonitor';
import IconMoreHorizontal from '@core/design-system/library/component/icon/IconMoreHorizontal';
import IconMoreVertical from '@core/design-system/library/component/icon/IconMoreVertical';
import IconMove from '@core/design-system/library/component/icon/IconMove';
import IconNumber from '@core/design-system/library/component/icon/IconNumber';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconPieChart from '@core/design-system/library/component/icon/IconPieChart';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconReward from '@core/design-system/library/component/icon/IconReward';
import IconRewardItem from '@core/design-system/library/component/icon/IconRewardItem';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import IconServer from '@core/design-system/library/component/icon/IconServer';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';
import IconSpeaker from '@core/design-system/library/component/icon/IconSpeaker';
import IconStar from '@core/design-system/library/component/icon/IconStar';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import IconText from '@core/design-system/library/component/icon/IconText';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import IconUnarchive from '@core/design-system/library/component/icon/IconUnarchive';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import IconUserPlus from '@core/design-system/library/component/icon/IconUserPlus';
import IconVdo from '@core/design-system/library/component/icon/IconVdo';
import IconVolume from '@core/design-system/library/component/icon/IconVolume';
import IconFullscreen from '@core/design-system/library/component/icon/IconFullscreen';
import IconBackspace from '@core/design-system/library/component/icon/IconBackspace';
import IconSorted from '@core/design-system/library/component/icon/IconSorted';
import IconUnSorted from '@core/design-system/library/component/icon/IconUnSorted';
//** Icon */

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="bg-bg-F1F2F2 font-hx freesize:text-2xl text-m grid w-full grid-cols-6 gap-4 bg-white">
      {/* Display icons in rows of 6 */}
      <div className="m-2 flex flex-col items-center">
        <IconActivity />
        <span>IconActivity</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconAlignJustify />
        <span>IconAlignJustify</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArchive />
        <span>IconArchive</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowCircleLeft />
        <span>IconArrowCircleLeft</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowDown />
        <span>IconArrowDown</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowDownward />
        <span>IconArrowDownward</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowLeft />
        <span>IconArrowLeft</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowRight />
        <span>IconArrowRight</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowUp />
        <span>IconArrowUp</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconArrowUpward />
        <span>IconArrowUpward</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconAssign />
        <span>IconAssign</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBag />
        <span>IconBag</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBarChart />
        <span>IconBarChart</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBell />
        <span>IconBell</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBook />
        <span>IconBook</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBookmark />
        <span>IconBookmark</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconCamera />
        <span>IconCamera</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconCalendar />
        <span>IconCalendar</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconClock />
        <span>IconClock</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconClose />
        <span>IconClose</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconCopy />
        <span>IconCopy</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconCopyItem />
        <span>IconCopyItem</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconCornerUpLeft />
        <span>IconCornerUpLeft</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconDatabase />
        <span>IconDatabase</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconEdit />
        <span>IconEdit</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconError />
        <span>IconError</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconEye />
        <span>IconEye</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconFileText1 />
        <span>IconFileText1</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconFile />
        <span>IconFile</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconFlag />
        <span>IconFlag</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconFolder />
        <span>IconFolder</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconForward />
        <span>IconForward</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconGraphicEq />
        <span>IconGraphicEQ</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconGroup />
        <span>IconGroup</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconHome />
        <span>IconHome</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <Icon20 />
        <span>Icon20</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconImage />
        <span>IconImage</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconDownload />
        <span>IconDownload</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconKey />
        <span>IconKey</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconLink />
        <span>IconLink</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMail />
        <span>IconMail</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMessageSquare />
        <span>IconMessageSquare</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMicrophone />
        <span>IconMicrophone</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMonitor />
        <span>IconMonitor</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMoreHorizontal />
        <span>IconMoreHorizontal</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMoreVertical />
        <span>IconMoreVertical</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconImportContacts />
        <span>IconImportContacts</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconMove />
        <span>IconMove</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconNumber />
        <span>IconNumber</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconPen />
        <span>IconPen</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconPieChart />
        <span>IconPieChart</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconPlus />
        <span>IconPlus</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconReward />
        <span>IconReward</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconRewardItem />
        <span>IconRewardItem</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconSearch />
        <span>IconSearch</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconServer />
        <span>IconServer</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconSettings />
        <span>IconSettings</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconSpeaker />
        <span>IconSpeaker</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconStar />
        <span>IconStar</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconTask />
        <span>IconTask</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconText />
        <span>IconText</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconTrash />
        <span>IconTrash</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconUnarchive />
        <span>IconUnarchive</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconUpload />
        <span>IconUpload</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconUserPlus />
        <span>IconUserPlus</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconUser />
        <span>IconUser</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconVdo />
        <span>IconVideo</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconVolume />
        <span>IconVolume</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconFullscreen />
        <span>IconFullscreen</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconBackspace />
        <span>IconBackspace</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconSorted />
        <span>Icon Sorted</span>
      </div>
      <div className="m-2 flex flex-col items-center">
        <IconUnSorted />
        <span>Icon UnSorted</span>
      </div>
    </div>
  );
};

export default DomainJSX;

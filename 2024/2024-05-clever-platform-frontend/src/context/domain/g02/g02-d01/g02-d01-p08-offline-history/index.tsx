/* eslint-disable check-file/folder-naming-convention */
import './style.module.css';

import { useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
import StoreLevel from '@store/global/level';
import ImageBGLogin from './assets/background-login.jpg';
import Dialog from './component/web/atoms/wc-a-dialog';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import { DialogContent } from './component/web/templates/wc-a-content';
import DialogFooter from './component/web/templates/wc-a-footer';
import { DialogHeader } from './component/web/templates/wc-a-header';
import { StateTab, UploadHistoryData } from './types';

const DomainJSX = () => {
  const [record, setRecord] = useState<UploadHistoryData[]>([]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateTab.WaitingTab);

    // fetch uploaded level history data
    const levelSubmitResults = StoreLevel.MethodGet().getLevelSubmitResults();
    const records: UploadHistoryData[] = [];

    for (const key in levelSubmitResults) {
      const isUpload = levelSubmitResults[key].isUpload;
      const data: UploadHistoryData = {
        status: isUpload ? 'Complete' : 'Waiting',
        avatarImage: levelSubmitResults[key].user.image_url || undefined,
        username:
          levelSubmitResults[key].user.first_name +
          ' ' +
          levelSubmitResults[key].user.last_name,
        lastLogin: levelSubmitResults[key].lastestLogin,
        school_code: levelSubmitResults[key].user.school_code,
        student_id: levelSubmitResults[key].user.student_id,
        pin: levelSubmitResults[key].user.pin,
      };
      records.push(data);
    }
    setRecord(records);
  }, []);

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      />
      {/* Safezone */}
      <SafezonePanel className="flex items-center inset-0">
        <Dialog>
          {/* dialog header section */}
          <DialogHeader />
          {/* content section */}
          <DialogContent records={record} />
          {/* dialog footer */}
          <DialogFooter />
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;

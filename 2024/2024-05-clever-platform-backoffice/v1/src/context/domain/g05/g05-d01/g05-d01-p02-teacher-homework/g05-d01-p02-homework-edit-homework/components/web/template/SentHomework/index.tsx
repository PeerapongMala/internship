import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';

import ModalQuestion from '../../../../../local/components/modal/ModalQuestion';
import ProgressBar from '../../../../../local/components/organisms/Progressbar';

import ModalChat from '../../../../../local/components/modal/ModalChat';
import Gethomework from '../Get/GetHomework';
import GetByIdHomework from '../Get/GetByIdHomework';
import {
  StatusStudent,
  StudentSent,
  Status,
  HomeworkStatus,
  HomeworkSubmitDetail,
} from '@domain/g03/g03-d06/local/type';

type SentHomeworkProps = { schoolID: string };

const SentHomework = ({ schoolID }: SentHomeworkProps) => {
  // const { subjectId } = useParams();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTablist, setActiveTablist] = useState('0');

  const [selectedId, setSelectedId] = useState<HomeworkSubmitDetail>(
    {} as HomeworkSubmitDetail,
  );

  const handleChangeOptions = (key: string, value: string) => {
    if (/^answer_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[1]);
    } else {
      switch (key) {
        case 'position':
          setSelectedSubject(value);
          break;
        default:
          break;
      }
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      sendLocalStorageToIframe();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedSubject]);
  const sendLocalStorageToIframe = () => {
    console.log('sendLocalStorageToIframe');

    const gameConfig = JSON.stringify({
      patternGroup: selectedSubject,
    });
    localStorage.setItem('game-config', gameConfig);
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      const localStorageData = JSON.stringify({ 'game-config': gameConfig });
      iframe.contentWindow.postMessage(localStorageData, '*');
    }
  };

  return (
    <div className="w-full">
      <div className="mt-5 h-auto w-full">
        <div className="mt-5 w-full">
          {activeTablist === '0' ? (
            <Gethomework
              schoolID={schoolID}
              active={setActiveTablist}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <GetByIdHomework
              active={setActiveTablist}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SentHomework;

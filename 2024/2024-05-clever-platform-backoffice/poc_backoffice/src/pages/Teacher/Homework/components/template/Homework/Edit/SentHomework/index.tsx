import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import subjectData from '../../subject.json';
import ProgressBar from '../../../../web/Progressbar';
import people from '../../people.json';
import ModalChat from '../../../../modal/ModalChat';
import Gethomework from '../../Get/GetHomework';
import GetByIdHomework from '../../Get/GetByIdHomework';

const SentHomework = () => {
    let timenow = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const { subjectId } = useParams();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeTablist, setActiveTablist] = useState('0');


    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

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
        <div className='w-full'>
            <div className='w-full h-auto mt-5 bg-white rounded-xl shadow-md'>
                <div className="w-full mt-5 ">
                    {activeTablist === '0' ? (
                        <Gethomework active={setActiveTablist} />
                    ) : (
                        <GetByIdHomework active={setActiveTablist} />
                    )}
                </div>
            </div>
        </div>
    );
}


export default SentHomework;

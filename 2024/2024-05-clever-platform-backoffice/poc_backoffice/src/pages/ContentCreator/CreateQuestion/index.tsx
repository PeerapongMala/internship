import { useEffect, useState } from 'react';
import FormLayout from './components/template/FormLayout';
import FormAnswerSelect from './components/template/FormAnswerSelect';
import Box from '../components/atom/Box';
import BaseInformation from '../components/template/BaseInformation';
import DemoRender from './components/template/DemoRender';
import WizardBar from '../components/organism/WizardBar';
import { tabs } from '../CreateSetting/mock';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import { Divider } from '../../../components/Divider';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Select } from '../../../components/Input';
import FormQuiz from './components/template/FormQuiz';
import FormAnswer from './components/template/FormAnswer';
import FooterForm from '../components/organism/FooterForm';
import HeaderForm from '../components/organism/HeaderForm';
import ModalConfirmDelete from './components/molecule/ModalConfirmDelete';
import ModalTranslate from './components/organism/ModalTranslate';

interface Answer {
    choice?: string;
    answer: string;
}

interface Image {
    dataURL: string;
}

const answerPosition = [
    {
        id: 'horizontal',
        imgSrc: '/assets/images/create-quiz/game-layout-horizontal.png',
        title: '',
    },
    {
        id: 'vertical',
        imgSrc: '/assets/images/create-quiz/game-layout-vertical.png',
        title: '',
    },
];

const layoutPosition = [
    {
        id: '1:1',
        imgSrc: '/assets/images/create-quiz/layout-5-5.png',
        title: '1 : 1 (ค่าเริ่มต้น)',
    },
    {
        id: '3:7',
        imgSrc: '/assets/images/create-quiz/layout-3-7.png',
        title: '3 : 7',
    },
    {
        id: '7:3',
        imgSrc: '/assets/images/create-quiz/layout-7-3.png',
        title: '7 : 3',
    },
];

const optionsColumn = [
    { value: '1-col', label: '1 คอลัมน์' },
    { value: '2-col', label: '2 คอลัมน์' },
    { value: '3-col', label: '3 คอลัมน์' },
    { value: '4-col', label: '4 คอลัมน์' },
    { value: '1-row', label: '1 แถว' },
    { value: '2-row', label: '2 แถว' },
    { value: '3-row', label: '3 แถว' },
    { value: '4-row', label: '4 แถว' },
];

const optionsAnswerSelect = [
    { value: 'text', label: 'ข้อความ' },
    { value: 'image', label: 'รูปภาพ' },
    { value: 'voice', label: 'เสียง' },
];

const optionsAnswerSelectCount = [
    { value: '1', label: '1 ตัวเลือก' },
    { value: '2', label: '2 ตัวเลือก' },
    { value: '3', label: '3 ตัวเลือก' },
    { value: '4', label: '4 ตัวเลือก' },
    { value: '5', label: '5 ตัวเลือก' },
    { value: '6', label: '6 ตัวเลือก' },
    { value: '7', label: '7 ตัวเลือก' },
    { value: '8', label: '8 ตัวเลือก' },
];

const optionsAnswerSelectFakeCount = [
    { value: '1', label: '1 ตัวเลือก' },
    { value: '2', label: '2 ตัวเลือก' },
    { value: '3', label: '3 ตัวเลือก' },
    { value: '4', label: '4 ตัวเลือก' },
];

const optionQuestionType = [
    { value: 'multiple-choice', label: 'ค่าเริ่มต้น - คำถามปรนัย (Multiple Choices)' },
    { value: 'pairing', label: 'คำถามแบบจับคู่ (Pairing)' },
    { value: 'sorting', label: 'คำถามแบบเรียงลำดับ (Sorting)' },
    { value: 'placeholder', label: 'คำถามแบบเติมคำ (Placeholder)' },
    { value: 'input', label: 'คำถามแบบเติมคำ (Input)' },
];

const optionTimerSeconds = [
    { value: '30', label: 'ค่าเรื่องต้น' },
    { value: '60', label: '1 นาที' },
];

const optionGroupCount = [
    { value: '2', label: '2 กลุ่ม' },
    { value: '3', label: '3 กลุ่ม' },
    { value: '4', label: '4 กลุ่ม' },
    { value: '5', label: '5 กลุ่ม' },
    { value: '6', label: '6 กลุ่ม' },
    { value: '7', label: '7 กลุ่ม' },
]

const optionAnswerCount = [
    { value: '1', label: 'คำตอบถูกได้ 1 ข้อ' },
    { value: '2', label: 'คำตอบถูกได้มากกว่า 1 ข้อ' },
]

const CreateQuestion = () => {
    const [selectedQuestionType, setSelectedQuestionType] = useState(optionQuestionType[0]);
    const [selectedLayoutRatio, setSelectedLayoutRatio] = useState('1:1');
    const [selectedLayoutPattern, setSelectedLayoutPattern] = useState('horizontal');
    const [selectedPatternAnswer, setSelectedPatternAnswer] = useState('2-col');
    const [selectedPatternGroup, setSelectedPatternGroup] = useState('2-col');
    const [selectedAnswerType, setSelectedAnswerType] = useState('text');
    const [selectedAnswerOptionCount, setSelectedAnswerOptionCount] = useState(5);
    const [selectedAnswerOptionFakeCount, setSelectedAnswerOptionFakeCount] = useState(2);
    const [selectedAnswerCount, setSelectedAnswerCount] = useState('1');
    const [selectedAnswerCorrect, setSelectedAnswerCorrect] = useState('1');
    const [inputTopic, setInputTopic] = useState('');
    const [inputQustionImage, setInputQustionImage] = useState<Image[]>([]);
    const [inputQustion, setInputQustion] = useState('');
    const [inputHint, setInputHint] = useState('');
    const [inputHintImage, setInputHintImage] = useState<Image[]>([]);
    const [inputAnswerList, setInputAnswerList] = useState<Answer[]>([]);
    const [inputAnswerListFake, setInputAnswerListFake] = useState<Answer[]>([]);
    const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);

    const [modalTranslateConfig, setModalTranslateConfig] = useState<{ show: boolean; callback: (value: string) => void; } | undefined>(undefined);

    const handleChangeOptions = (key: string, value: string) => {
        if (/^answer_\d+$/.test(key)) {
            const index = parseInt(key.split('_')[1]);
            setInputAnswerList((prev) => {
                const newList = [...prev];
                newList[index] = { ...newList[index], answer: value };
                return newList;
            });
        } else if (/^answer_fake_\d+$/.test(key)) {
            const index = parseInt(key.split('_')[2]);
            setInputAnswerListFake((prev) => {
                const newList = [...prev];
                newList[index] = { ...newList[index], answer: value };
                return newList;
            });
        } else {
            switch (key) {
                case 'position':
                    setSelectedLayoutPattern(value);
                    break;
                case 'layout':
                    setSelectedLayoutRatio(value);
                    break;
                case 'answerColumn':
                    setSelectedPatternAnswer(value);
                    break;
                case 'groupColumn':
                    setSelectedPatternGroup(value);
                    break;
                case 'answerType':
                    setSelectedAnswerType(value);
                    break;
                case 'answerSelectCount':
                    const count = parseInt(value);
                    setSelectedAnswerOptionCount(count);
                    setInputAnswerList((prev) => {
                        const newList = [...prev];
                        return newList.filter((_, index) => index < count);
                    });
                    break;
                case 'answerSelectFakeCount':
                    const countFake = parseInt(value);
                    setSelectedAnswerOptionFakeCount(countFake);
                    setInputAnswerListFake((prev) => {
                        const newList = [...prev];
                        return newList.filter((_, index) => index < countFake);
                    });
                    break;
                default:
                    break;
            }
        }
    };

    const handleShowModalTranslate = (config: { show: boolean; callback: (value: string) => void; }) => {
        setModalTranslateConfig(config);
    };

    const handleCloseModalTranslate = () => {
        setModalTranslateConfig(undefined);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            sendLocalStorageToIframe();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [
        selectedLayoutRatio,
        selectedLayoutPattern,
        selectedPatternAnswer,
        selectedPatternGroup,
        inputQustion,
        inputTopic,
        inputHint,
        inputAnswerList,
        inputQustionImage,
        inputHintImage,
        selectedQuestionType,
    ]);

    useEffect(() => {
        const initialAnswers = Array.from({ length: selectedAnswerOptionCount }, () => ({ answer: '' }));
        setInputAnswerList(initialAnswers);
    }, [selectedAnswerOptionCount]);

    useEffect(() => {
        const initialAnswers = Array.from({ length: selectedAnswerOptionFakeCount }, () => ({ answer: '' }));
        setInputAnswerListFake(initialAnswers);
    }, [selectedAnswerOptionFakeCount]);

    const sendLocalStorageToIframe = () => {
        console.log('sendLocalStorageToIframe');

        const gameConfig = JSON.stringify({
            questionType: selectedQuestionType.value,
            layout: selectedLayoutRatio,
            position: selectedLayoutPattern,
            patternAnswer: selectedPatternAnswer,
            patternGroup: selectedPatternGroup,
            question: inputQustion,
            questionImage: inputQustionImage[0]?.dataURL,
            topic: inputTopic,
            hint: inputHint,
            hintImage: inputHintImage[0]?.dataURL,
            answerList: inputAnswerList,
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
            <ModalTranslate
                openWithCallback={modalTranslateConfig}
                onClose={handleCloseModalTranslate}
            />
            <ModalConfirmDelete
                isOpen={isOpenModalConfirmDelete}
                onClose={() => setIsOpenModalConfirmDelete(false)}
                onOk={() => setIsOpenModalConfirmDelete(false)}
            />
            <Box className="bg-white shadow-md p-5 rounded-lg w-full">
                <WizardBar tabs={tabs} />
            </Box>
            <div className="flex gap-4 pt-5">
                <div className="flex flex-col gap-6 w-2/3">
                    <Box className='flex gap-4'>
                        <HeaderForm />
                    </Box>
                    <Box>
                        <div className='flex gap-4 font-bold text-lg justify-center items-center bg-gray-100 rounded-md py-4'>
                            <div>คำถามข้อที่</div>
                            <button className="btn btn-primary p-0 w-11 h-11">
                                <IconCaretDown className='rotate-90 w-6 h-6' />
                            </button>
                            <div className='flex items-center gap-4'>
                                <input type="text" className="form-input w-11 text-lg" value={1} />
                                <div>/ 3</div>
                            </div>
                            <button className="btn btn-primary p-0 w-11 h-11">
                                <IconCaretDown className='-rotate-90 w-6 h-6' />
                            </button>
                        </div>
                        <Divider />
                        <div className='flex justify-between items-center my-4 font-bold'>
                            <div className='text-xl'>ตั้งค่าคำถาม</div>
                            <button className="flex gap-2 btn btn-outline-danger" onClick={() => setIsOpenModalConfirmDelete(true)}>
                                <IconTrashLines /> ลบคำถาม
                            </button>
                        </div>
                        <Divider />
                        <div className='grid grid-cols-2 gap-4 items-end'>
                            <Select
                                label="รูปแบบคำถาม"
                                defaultValue={optionQuestionType[0]}
                                options={optionQuestionType}
                                value={selectedQuestionType}
                                onChange={(e) => setSelectedQuestionType(e)}
                                required
                            />
                            <div className='mb-2'>
                                {selectedQuestionType.label}
                            </div>
                            <Select
                                label="การจับเวลาระหว่างเล่น"
                                defaultValue={optionTimerSeconds[0]}
                                options={optionTimerSeconds}
                                required
                            />
                            <div className='mb-2'>
                                จับเวลา / ไม่สามารถเล่นต่อได้ถ้าหมดเวลา 30 วินาที
                            </div>
                        </div>
                    </Box>
                    <Box>
                        <FormLayout
                            selectedLayoutRatio={selectedLayoutRatio}
                            selectedLayoutPattern={selectedLayoutPattern}
                            answerPosition={answerPosition}
                            layoutPosition={layoutPosition}
                            optionsColumn={optionsColumn}
                            handleChangeOptions={handleChangeOptions}
                        />
                    </Box>
                    <Box>
                        <FormQuiz
                            setInputQustion={setInputQustion}
                            setInputTopic={setInputTopic}
                            setInputHint={setInputHint}
                            setInputQustionImage={setInputQustionImage}
                            setInputHintImage={setInputHintImage}
                            questionType={selectedQuestionType.value}
                            inputTopic={inputTopic}
                            handleShowModalTranslate={handleShowModalTranslate}
                        />
                    </Box>
                    {selectedQuestionType.value !== 'input' && (
                        <Box>
                            <FormAnswerSelect
                                inputAnswerList={inputAnswerList}
                                inputAnswerListFake={inputAnswerListFake}
                                optionsAnswerSelect={optionsAnswerSelect}
                                optionsAnswerSelectCount={optionsAnswerSelectCount}
                                optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
                                optionGroupCount={optionGroupCount}
                                handleChangeOptions={handleChangeOptions}
                                selectedAnswerOptionCount={selectedAnswerOptionCount}
                                selectedAnswerOptionFakeCount={selectedAnswerOptionFakeCount}
                                questionType={selectedQuestionType.value}
                                handleShowModalTranslate={handleShowModalTranslate}
                            />
                        </Box>
                    )}
                    <Box>
                        <FormAnswer
                            inputAnswerList={inputAnswerList}
                            selectedAnswerCorrect={selectedAnswerCorrect}
                            selectedAnswerCount={selectedAnswerCount}
                            setSelectedAnswerCount={setSelectedAnswerCount}
                            setSelectedAnswerCorrect={setSelectedAnswerCorrect}
                            questionType={selectedQuestionType.value}
                            optionAnswerCount={optionAnswerCount}
                        />
                    </Box>
                    <Box className="flex justify-between bg-[#F5F5F5] shadow-md p-5 rounded-lg w-full">
                        <FooterForm />
                    </Box>
                </div>
                <div className="flex flex-col gap-6 w-1/3 h-fit">
                    <Box>
                        <BaseInformation />
                    </Box>
                    <Box>
                        <DemoRender />
                    </Box>
                </div>

            </div>

        </div>
    );
};

export default CreateQuestion;

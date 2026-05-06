import TabPanelComponent from "../../molecule/TabPanelComponent";

const TabPanelQuiz = ({ setInputQustion, setInputQustionImage }: {
    setInputQustion: (value: string) => void
    setInputQustionImage: (images: any) => void
}) => {
    return <TabPanelComponent setInput={setInputQustion} isTextarea={true} multipleUpload={false} onUploadChange={setInputQustionImage} />;
};

export default TabPanelQuiz;

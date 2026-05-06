import TabPanelComponent from "../../molecule/TabPanelComponent";

const TabPanelHint = ({ setInputHint, setInputHintImage }: {
    setInputHint: (value: string) => void
    setInputHintImage: (images: any) => void
}) => {
    return <TabPanelComponent setInput={setInputHint} multipleUpload={false} onUploadChange={setInputHintImage} />;
};

export default TabPanelHint;

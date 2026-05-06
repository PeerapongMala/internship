import { useState } from "react";

const DemoRender = () => {
    const [iframeKey, setIframeKey] = useState(0);
    const [height, setHeight] = useState("299rem");
    const [url, setUrl] = useState("http://localhost:6101/quiz/quiz-demo");

    const refreshIframe = () => {
        setIframeKey(prevKey => prevKey + 1);
    };

    const handleRefreshIframe = () => {
        setHeight("299rem");
        refreshIframe();
    }

    const handleIframeLoad = () => {
        setHeight("300rem");
    }

    return (
        <div className="min-h-[20rem]" key={iframeKey}>
            <button type="button" className="btn btn-outline-primary mt-6" onClick={handleRefreshIframe}>
                อัพเดทข้อมูล
            </button>
            <iframe
                src={url}
                title="quiz"
                height={height}
                width={"100%"}
                onLoad={handleIframeLoad}
            />
        </div>
    );
};

export default DemoRender;

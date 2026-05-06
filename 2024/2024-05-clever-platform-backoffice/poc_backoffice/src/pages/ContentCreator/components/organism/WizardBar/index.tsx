import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Tab {
    id: number;
    label: string;
    icon: React.ReactNode;
    path?: string;
}

interface WizardBarProps {
    tabs: Tab[];
}

const WizardBar = ({ tabs }: WizardBarProps) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

    const getWidth = (id: number) => {
        const index = tabs.findIndex(tab => tab.id === id);
        const width = ((index / (tabs.length - 1)) * 96) + '%';

        return width;
    };

    useEffect(() => {
        const index = tabs.findIndex(tab => tab.path === location.pathname);
        if (index > -1) {
            setActiveTab(tabs[index].id);
        }
    }, [location]);

    return (
        <div className="inline-block w-full">
            <div className="relative z-[1]">
                <div
                    className={`bg-white-light h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width] ml-4`}
                    style={{ width: "95%" }}
                ></div>
                <div
                    className={`bg-primary h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width] ml-4`}
                    style={{ width: getWidth(activeTab) }}
                ></div>
                <div className={`mb-2 flex justify-between`}>
                    {tabs.map((tab) => (
                        <div key={tab.id} className="flex flex-col items-center">
                            <Link
                                to={tab.path || '#'}
                                className={`${activeTab >= tab.id ? '!border-primary !bg-primary text-white' : ''}
                                border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                            </Link>
                            <span className={`${activeTab >= tab.id ? 'text-primary ' : ''}text-center block mt-2 font-bold`}>
                                {tab.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WizardBar;

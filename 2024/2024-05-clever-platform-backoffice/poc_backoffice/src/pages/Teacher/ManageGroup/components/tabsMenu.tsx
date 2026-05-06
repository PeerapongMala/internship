import { useState } from 'react';
import { Tab } from '../interfaces/interface';

const TabsMenu = ({ tabs }: { tabs: Tab[] }) => {
    const [activeTab, setActiveTab] = useState(tabs[tabs.length - 1].id); // start from end

    return (
        <div>
            {tabs.map((tab) => (
                <button key={tab.id} className={`hover:text-primary ${activeTab === tab.id ? 'px-6 py-[10px] text-primary border-b border-primary' : 'p-[10px] text-neutral-500'}`} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabsMenu;

import CWTabItem from '@component/web/atom/cw-tab-item';
import CWTabList from '@component/web/molecule/cw-tab-list';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../types';

export type TabConfig = {
    key: string | StateFlow;
    labelI18nKey: string;
    isActive: boolean;
    onClick: () => void;
    icon?: ReactNode;
};

export type CWTabBarProps = {
    tabs: TabConfig[];
    className?: string;
};

/**
 * CWTabBar - Tab navigation bar component
 *
 * Displays a list of tabs using CWTabList and CWTabItem.
 * Does NOT render tab content - parent component should handle that.
 *
 * @example
 * <CWTabBar
 *   tabs={[
 *     {
 *       key: 'sublesson',
 *       labelI18nKey: 'menu-header-sublesson-tab',
 *       isActive: true,
 *       onClick: () => setActiveTab('sublesson')
 *     },
 *     {
 *       key: 'model',
 *       labelI18nKey: 'menu-header-model-tab',
 *       isActive: false,
 *       onClick: () => setActiveTab('model')
 *     }
 *   ]}
 * />
 */
const CWTabBar = ({ tabs, className = '' }: CWTabBarProps) => {
    const { t } = useTranslation([ConfigJson.key]);

    return (
        <div className={`bg-white w-full ${className}`}>
            <CWTabList className="w-full h-[64px]">
                {tabs.map((tab) => (
                    <CWTabItem
                        key={tab.key}
                        onClick={tab.onClick}
                        isActive={tab.isActive}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{t(tab.labelI18nKey)}</span>
                        </div>
                    </CWTabItem>
                ))}
            </CWTabList>
        </div>
    );
};

export default CWTabBar;

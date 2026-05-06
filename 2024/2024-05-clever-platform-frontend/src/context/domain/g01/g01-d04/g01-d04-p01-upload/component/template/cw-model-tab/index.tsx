import CWListItem from "@component/web/atom/cw-list-item";
import IconButton from "@component/web/atom/wc-a-icon-button";
import ImageIconTrashWhite from '@global/assets/icon-trash.svg';
import { IModelRecordSchema, StoreModelFileMethods } from "@store/global/avatar-models";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from "react-i18next";
import ConfigJson from '../../../config/index.json';

interface CWModelTabProps {
    onDeleteClick: (model: IModelRecordSchema) => void;
}

export interface CWModelTabRef {
    refreshModels: () => Promise<void>;
}

const CWModelTab = forwardRef<CWModelTabRef, CWModelTabProps>(({ onDeleteClick }, ref) => {
    const { t } = useTranslation([ConfigJson.key]);
    const [models, setModels] = useState<IModelRecordSchema[]>([]);
    const [loading, setLoading] = useState(true);

    const loadModels = async () => {
        try {
            // Use getAllMetadata() to avoid loading all blobs into memory
            const models = await StoreModelFileMethods.getAllMetadata();
            setModels(models as any); // Cast needed since metadata doesn't include 'value'
        } catch (error) {
            console.error("Failed to load models:", error);
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshModels: loadModels,
    }));

    useEffect(() => {
        loadModels();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <p className="text-xl">{t("model.loading")}</p>
            </div>
        );
    }

    if (models.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500 mt-10">
                <p className="text-xl">{t("model.empty")}</p>
            </div>
        );
    }

    return (
        <div className="pt-0">
            <div className="w-full flex justify-center items-center p-3 gap-2">
                <h1 className="text-[20px] font-bold">
                    {t("model.total")}:
                </h1>
                <p className="text-[20px]"> {models.length}/179</p>
            </div>
            {models.map((item) => (
                <CWListItem
                    key={item.modelKey}
                    title={item.modelKey}
                    actions={
                        <>
                            <IconButton
                                variant="danger"
                                iconSrc={ImageIconTrashWhite}
                                onClick={() => onDeleteClick(item)}
                            />
                        </>
                    }
                />
            ))}
        </div>
    );
});

CWModelTab.displayName = 'CWModelTab';

export default CWModelTab;
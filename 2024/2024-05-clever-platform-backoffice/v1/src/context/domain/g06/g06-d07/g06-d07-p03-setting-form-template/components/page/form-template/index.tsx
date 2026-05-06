
import CWWhiteBox from '@component/web/cw-white-box';
import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { TDocumentTemplate, ColorSettings, TTemplateFilter } from '@domain/g06/g06-d07/local/types/template';
import CWColorPicker from '@component/web/cw-color-picker';
import API from '@domain/g06/g06-d07/local/api';
import CWImageUploadPreview from '@component/web/cw-image-upload-preview';
import { colorGroups, colorShades, defaultColorSettings, mockData, templateImage, templateOptions } from '../../options';
import CWTemplatePreview from '../../template/cw-template-preview';
import showMessage from '@global/utils/showMessage';


export type CWTemplateSettingProps = {
    mode?: 'create' | 'edit';
    school_id: string
    idEdit?: string // id template
    setInitiateIsDefault?: (value: boolean) => void
    isDefault?: boolean
    setIsDefault?: (value: boolean) => void
    onLoadingChange?: (loading: boolean) => void;
};
export type CWTemplateSettingRef = {
    handleSave: () => void;
};
export const safeJsonParse = (str: string | object): ColorSettings => {
    //  object return
    if (typeof str === 'object' && str !== null) return str as ColorSettings;

    //  undefined & string "undefined" return default
    if (str === undefined || str === "undefined") {
        return defaultColorSettings;
    }

    try {
        return JSON.parse(str as string) as ColorSettings;
    } catch (error) {
        console.error('Failed to parse colour_setting:', error);
        return defaultColorSettings;
    }
};
const CWFromTemplate = forwardRef<CWTemplateSettingRef, CWTemplateSettingProps>(
    ({ mode, school_id, idEdit, setInitiateIsDefault, isDefault, setIsDefault, onLoadingChange }, ref) => {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(false);
        const [templateData, setTemplateData] = useState<Omit<TDocumentTemplate, 'id' | 'school_id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by' | 'is_default'>>({
            format_id: undefined,
            name: '',
            logo_image: null,
            background_image: null,
            colour_setting: defaultColorSettings,
        });

        useEffect(() => {
            if (mode === 'create') {
                setTemplateData((prev) => (
                    {
                        ...prev,
                        format_id: '1'
                    })
                )
            }
        }, [mode])

        useEffect(() => {
            onLoadingChange?.(isLoading);
        }, [isLoading, onLoadingChange]);

        useEffect(() => {
            if (mode === 'edit' && idEdit) {
                const loadTemplate = async () => {
                    setIsLoading(true);
                    try {
                        const res = await API.GradeSetting.GetListDocumentTemplate({ school_id: school_id, id: idEdit })
                        if (res.status === 200 && res.data.data[0]) {
                            const template = res.data.data[0];

                            const colourSetting = safeJsonParse(template.colour_setting);
                            setTemplateData({
                                format_id: template.format_id,
                                name: template.name ?? '',
                                logo_image: template.logo_image ?? '',
                                background_image: template.background_image ?? '',
                                colour_setting: colourSetting ?? defaultColorSettings,
                            });
                            if (setIsDefault) {
                                setIsDefault(template.is_default);
                            }
                            if (setInitiateIsDefault) {
                                setInitiateIsDefault(template.is_default);
                            }
                        }

                    } catch (error) {
                        console.error('Failed to load template:', error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                loadTemplate();
            }
        }, [mode, idEdit]);

        useImperativeHandle(ref, () => ({
            handleSave
        }));

        const handleInputChange = (name: string, value: string) => {
            setTemplateData(prev => ({ ...prev, [name]: value }));
        };
        const handleTemplateSelect = (formatId: string) => {
            setTemplateData(prev => ({ ...prev, format_id: formatId }));
        };

        const handleColorSelect = (colorType: string, colorValue: string) => {
            setTemplateData(prev => ({
                ...prev,
                colour_setting: {
                    ...prev.colour_setting,
                    [colorType]: colorValue,
                },
            }));
        };
        const handleResetColor = (colorType: string) => {
            setTemplateData(prev => ({
                ...prev,
                colour_setting: {
                    ...prev.colour_setting,
                    [colorType]: '',
                },
            }));
        };
        const handleLogoUpload = (imageFile: File[] | undefined) => {
            setTemplateData(prev => ({ ...prev, logo_image: imageFile && imageFile.length > 0 ? imageFile[0] : null }));
        };

        const handleBackgroundUpload = (imageFile: File[] | undefined) => {
            setTemplateData(prev => ({ ...prev, background_image: imageFile && imageFile.length > 0 ? imageFile[0] : null }));
        };

        const handleDeleteLogo = () => {
            setTemplateData(prev => ({
                ...prev,
                logo_image: null,
                delete_logo_image: true
            }));
        };

        const handleDeleteBackground = () => {
            setTemplateData(prev => ({
                ...prev,
                background_image: null,
                delete_background_image: true
            }));
        };

        const handleSave = async () => {
            setIsLoading(true);
            try {
                if (!school_id) {
                    showMessage('ไม่พบโรงเรียน', 'warning')
                    return
                }
                if (!templateData.name) {
                    showMessage('โปรดกรอกชื่อเอกสาร', 'warning')
                    return
                }
                if (!templateData.format_id) {
                    showMessage('โปรดเลือกรูปแบบเอกสาร', 'warning')
                    return
                }
                const payload = {
                    school_id: Number(school_id),
                    ...templateData,
                    is_default: isDefault
                };
                if (mode === 'create') {

                    const res = await API.GradeSetting.PostDocumentTemplate(payload)
                    if (res.status === 200) {
                        showMessage('สร้างเอกสารสำเร็จ')
                        navigate({ to: '../../?tab=template' })
                    }

                } else if (mode === 'edit') {
                    if (!idEdit) return
                    const res = await API.GradeSetting.PatchDocumentTemplateUpdate(
                        idEdit,
                        payload);
                    if (res.status === 200) {
                        showMessage('แก้ไขเอกสารสำเร็จ')
                        navigate({ to: '../../../?tab=template' })
                    }
                }
            } catch (error) {
                showMessage(`เกิดข้อผิดพลาดในการ${mode === 'create' ? 'สร้าง' : 'แก้ไข'}`, 'error')
                console.error('Failed to save template:', error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
        const isTemplate1 = templateData.format_id === '1';

        return (
            <CWWhiteBox>
                <div className="flex flex-col md:flex-col lg:flex-row lg:gap-8">
                    {/* Left Column - Form */}
                    <div className="flex flex-col gap-5 w-full lg:w-2/5 xl:w-2/5">
                        <h2 className="text-xl font-bold">
                            {mode === 'create' ? 'สร้างเอกสารใหม่' : 'แก้ไขเอกสาร'}
                        </h2>

                        <div className="flex flex-col gap-5">
                            <CWInput
                                label="ชื่อเอกสาร"
                                name="name"
                                value={templateData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <div className='flex flex-col'>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="text-red-500">*</span>รูปแบบเอกสาร ( สำหรับขนาด A4)
                                </label>

                                <div className="flex gap-4 ">
                                    {templateImage.map((template) => (
                                        <div
                                            key={template.id}

                                            onClick={() => handleTemplateSelect(template.value)}
                                        >
                                            <img
                                                src={template.image}
                                                alt={template.name}
                                                className={`w-[150px] h-[230px] border-2 cursor-pointer transition-all duration-200 ${templateData.format_id === template.value
                                                    ? 'border-primary ring-2 ring-blue-200 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            />
                                            <p className="flex justify-center items-center text-center mt-2 text-sm font-medium">
                                                {template.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!isTemplate1 && (
                                <div className="w-full max-w-full md:max-w-[350px]">
                                    <CWImageUploadPreview
                                        label='โลโก้'
                                        labelFontBold={true}
                                        value={typeof templateData.logo_image === 'string' ? templateData.logo_image : undefined}
                                        onChange={handleLogoUpload}
                                        onDelete={handleDeleteLogo}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            <div className="w-full mt-5">
                                <h3 className="text-base font-bold">ปรับแต่งเอกสาร</h3>
                                <div className="flex flex-row md:flex-col">
                                    {colorGroups.map((colorGroup) => (
                                        <CWColorPicker
                                            key={colorGroup.name}
                                            title={colorGroup.label}
                                            colorType={colorGroup.name}
                                            selectedColor={templateData.colour_setting[colorGroup.name]}
                                            colorShade={colorShades}
                                            onSelect={handleColorSelect}
                                            onReset={handleResetColor}

                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="w-full max-w-full md:max-w-[350px]">
                                <CWImageUploadPreview
                                    label='ภาพพื้นหลัง'
                                    labelFontBold={true}
                                    value={typeof templateData.background_image === 'string' ? templateData.background_image : undefined}
                                    onChange={handleBackgroundUpload}
                                    onDelete={handleDeleteBackground}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="w-full lg:w-3/5 xl:w-3/5 mt-8 lg:mt-0">
                        <div className="">
                            <CWTemplatePreview
                                templateData={{
                                    id: mode === 'edit' ? Number(idEdit) : 0,
                                    school_id: 0,
                                    is_default: false,
                                    created_at: new Date().toISOString(),
                                    created_by: '',
                                    updated_at: new Date().toISOString(),
                                    updated_by: '',
                                    ...templateData,
                                }}

                            />
                        </div>
                    </div>
                </div>
            </CWWhiteBox>
        );
    });

export default CWFromTemplate;
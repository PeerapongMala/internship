import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import CWMReverseNavigate from '@domain/g01/g01-d05/local/component/web/molecule/cw-m-reverse-navigate';
import { Fragment } from 'react/jsx-runtime';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import CWASelect from '@domain/g01/g01-d05/local/component/web/atom/cw-a-select';
import CWAInputLabel from '@domain/g01/g01-d05/local/component/web/atom/cw-a-input-label';
import { useNavigate } from '@tanstack/react-router';
import CWMInputFileButton from '../../molecule/cw-m-input-file-button';
import CWInput from '@component/web/cw-input';
import { useEffect, useState } from 'react';
import CWAPolaroid from '../../atom/cw-a-polaroid';
import { Modal } from '@component/web/cw-modal';
import CWTCreateLayout from '../cw-t-create-layout';

interface CWTItemCreateProps {
  statusOptions: { label: any; value: any }[];
  item: {
    id: string;
    status: string;
    modifiedDate?: Date;
    modifiedBy?: string;
  };
  type: string;
  imageSize?: number;
  onSubmit?: (data: Record<string, any>) => void;
  onStatusChange?: (status: string) => void;
  badgeConfig?: {
    backgroundURLs: string[];
    iconURLs: string[];
  };
}

const CWTItemCreate: React.FC<CWTItemCreateProps> = function ({
  imageSize = 50,
  ...props
}) {
  const { t } = useTranslation(ConfigJson.key);
  const navigate = useNavigate();

  const itemType = props.type;
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const [text, setText] = useState('');
  const [backgroundIndex, setBackgroundURLIndex] = useState<number | undefined>();
  const [iconIndex, setIconURLIndex] = useState<number | undefined>();

  const [backgroundURL, setBackgroundURL] = useState<string>('');
  const [iconURL, setIconURL] = useState<string>('');

  const [status, setStatus] = useState(props.statusOptions[0]?.value ?? '');
  const [formData, setFormData] = useState({} as Record<string, any>);

  useEffect(inputFormData, [
    itemType,
    itemName,
    description,
    imageFile,
    text,
    backgroundIndex,
    iconIndex,
    status,
  ]);

  function inputFormData() {
    setFormData({
      itemType,
      itemName,
      description,
      imageFile,
      status,
    });
    if (itemType == 'badge') {
      setFormData((data) => ({
        ...data,
        text,
        backgroundURL,
        iconURL,
      }));
    }
  }

  function onSubmit() {
    props.onSubmit?.(formData);
  }

  function getBadgeBackground(url: string) {
    return (
      <div
        className="h-12 w-60 rounded-full bg-cover bg-center p-3 shadow-lg"
        style={{ backgroundImage: `url(${url})` }}
      ></div>
    );
  }

  return (
    <CWTCreateLayout
      breadcrumbs={[
        { text: t('breadcrumb.game'), href: '' },
        { text: t('breadcrumb.item'), href: '' },
        { text: t('breadcrumb.itemCreate'), href: '' },
      ]}
      {...props.item}
      navigateLabel={t('breadcrumb.itemCreate')}
      navigateTo="/gamemaster/item"
      statusOptions={props.statusOptions}
      onStatusChange={setStatus}
      buttonLabel={t('button.save')}
      onSubmit={onSubmit}
    >
      <div className="flex gap-4 *:flex-1">
        <div>
          <CWAInputLabel className="font-normal" required>
            {t('itemType.name')}:
          </CWAInputLabel>
          <CWASelect
            name="type"
            options={[
              { label: t('itemType.frame'), value: 'frame' },
              { label: t('itemType.badge'), value: 'badge' },
              { label: t('itemType.coupon'), value: 'coupon' },
            ]}
            value={props.type}
            onChange={(e) => {
              navigate({
                to: `/gamemaster/item/${e.currentTarget.value}/create`,
              });
            }}
          />
        </div>
        <div className="flex items-end"></div>
      </div>
      <hr />

      <div className="flex flex-col gap-4 *:gap-2">
        <div className="flex-1 font-bold">{t('word.description')}</div>
        <div className="flex">
          <CWInput
            className="flex-1"
            required
            label={t('field.item.name')}
            onChange={(e) => setItemName(e.currentTarget.value)}
          />
          <div className="flex-1">
            {itemType == 'badge' && (
              <div>
                <CWInput
                  className="flex-1"
                  required
                  label={`${t('field.item.text')} (${t('field.textSize')})`}
                  onChange={(e) => setText(e.currentTarget.value)}
                />
              </div>
            )}
          </div>
        </div>

        <CWInput
          className="flex-1"
          placeholder={t('word.optional')}
          label={t('field.item.description')}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </div>

      {itemType == 'badge' ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CWAInputLabel required>{t('field.badgeBackground')}:</CWAInputLabel>
              <div className="flex w-full gap-6 overflow-y-auto">
                {props.badgeConfig?.backgroundURLs.map((bgURL, index) => (
                  <button
                    className={`mb-2 ${backgroundIndex == index ? 'border-2 border-primary shadow-lg' : ''}`}
                    key={`bg-${index}`}
                    onClick={() => {
                      setBackgroundURLIndex(index);
                      setBackgroundURL(bgURL);
                    }}
                  >
                    <CWAPolaroid header={getBadgeBackground(bgURL)} />
                  </button>
                )) ?? <div className="w-full py-8 text-center">{t('word.empty')}</div>}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <CWAInputLabel required>{t('field.item.imageURLs.1')}:</CWAInputLabel>
              <div className="flex w-full gap-6 overflow-y-auto">
                {props.badgeConfig?.iconURLs.map((iconURL, index) => (
                  <button
                    className={`mb-2 ${iconIndex == index ? 'border-2 border-primary shadow-lg' : ''}`}
                    key={`icon-${index}`}
                    onClick={() => {
                      setIconURLIndex(index);
                      setIconURL(iconURL);
                    }}
                  >
                    <CWAPolaroid header={<img src={iconURL} className="size-16" />} />
                  </button>
                )) ?? <div className="w-full py-8 text-center">{t('word.empty')}</div>}
              </div>
              <div className="text-sm text-dark">
                format: .jpg, .png | {t('field.within')} {imageSize} MB
              </div>
            </div>
            <CWMInputFileButton
              label={t('button.upload')}
              onFileChange={(file) => {
                if (file) {
                  setImageFile(file);
                  setIconURLIndex(undefined);
                  setIconURL(URL.createObjectURL(file));
                }
              }}
              accept="image/jpeg, image/png"
              size={imageSize}
            />
          </div>
          <hr />
          <CWAPolaroid
            body={`${t('field.example')}: ${itemName}`}
            headerClassName="!h-36"
            header={
              iconURL &&
              backgroundURL && (
                <>
                  <div className="relative flex items-center justify-center">
                    {getBadgeBackground(backgroundURL)}
                    <div className="absolute flex w-full flex-grow items-center justify-center">
                      <div className="flex w-full flex-nowrap gap-2 overflow-hidden">
                        <img src={iconURL} className="!size-16 object-cover" />
                        <div className="flex w-full flex-[1_1_auto] items-center overflow-hidden">
                          <div className="w-full truncate pe-2 text-center text-lg font-bold">
                            {text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
          />
        </>
      ) : (
        <div className="flex">
          <div className="flex flex-col gap-2">
            <div>
              <CWAInputLabel required>{t('field.imageURL')}:</CWAInputLabel>
              <div className="text-sm text-dark">
                format: .jpg, .png | {t('field.within')} {imageSize} MB
              </div>
            </div>
            <CWMInputFileButton
              label={t('button.upload')}
              onFileChange={setImageFile}
              accept="image/jpeg, image/png"
              size={imageSize}
            />
          </div>
        </div>
      )}
    </CWTCreateLayout>
  );
};

export default CWTItemCreate;

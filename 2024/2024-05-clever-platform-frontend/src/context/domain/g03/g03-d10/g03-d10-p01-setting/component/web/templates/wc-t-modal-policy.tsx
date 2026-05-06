import { Trans, useTranslation } from 'react-i18next';

import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import Button from '@global/component/web/atom/wc-a-button';
import styles from '@global/component/web/molecule/wc-m-termcondition-modal/index.module.css';
import { toDateTimeTH } from '@global/helper/date';
import { useEffect, useState } from 'react';
import ConfigJson from '../../../config/index.json';

const ModalPrivacyPolicy = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const date = toDateTimeTH(new Date());

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [showModal]);

  const handleConfirm = () => {
    setIsVisible(false);
    setIsBouncing(false);
    setTimeout(() => {
      setShowModal(false);
    }, 300);
  };
  return (
    <>
      {showModal ? (
        <div
          id="modal-root"
          className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${styles['modal-transition']} ${
            isVisible
              ? styles['transition-top-to-center-loaded']
              : styles['transition-top-to-center']
          } ${isBouncing ? styles['bounce-animation'] : ''}`}
          onTransitionEnd={() => setIsBouncing(true)}
        >
          <div className="font-[Noto Sans Thai] w-[732px] h-[550px] border-8 border-white bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[64px] flex flex-col items-start gap-5 shadow-[0px_4px_0px0px#dfdede,0px_8px_4px_0px_rgba(0,0,0,0.15)] inset-0 bg-cover bg-center">
            <div className="pt-3 flex flex-col items-center justify-center w-full text-gray-800 text-center text-4xl font-bold px-4 pb-2 border-b border-dashed border-yellow-400">
              {t('privacy_policy')}
            </div>

            <ScrollableContainer className="pl-3">
              {date && (
                <div className="text-gray-600 flex justify-center w-full py-5">
                  {t('date', { date })}
                </div>
              )}
              <div className="text-xl leading-relaxed space-y-1 px-5">
                <div className="pb-5 space-y-10 font-light">
                  <div className="text-xl leading-relaxed space-y-1">
                    <div className="text-xl font-bold pb-5">
                      {t('privacy_policy_content.title')}
                    </div>
                    <span className="font-bold">
                      <Trans t={t} i18nKey="privacy_policy_content.summary_title" />
                    </span>
                    <span className="font-light">
                      <Trans t={t} i18nKey="privacy_policy_content.summary_content" />
                    </span>
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={`paragraph-${index}`} className="pt-3">
                        <div className="font-bold">
                          <Trans
                            t={t}
                            i18nKey={`privacy_policy_content.${index + 1}_title`}
                          />
                        </div>
                        {index == 1 ? (
                          <ul key={`list-${index}`} className="list-disc ms-5">
                            {Array.from({ length: 4 }).map((_, subindex) => (
                              <li key={`sublist-${subindex}`}>
                                <Trans
                                  t={t}
                                  i18nKey={`privacy_policy_content.${index + 1}_${subindex + 1}_content`}
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Trans
                            t={t}
                            i18nKey={`privacy_policy_content.${index + 1}_content`}
                            className="font-light"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollableContainer>

            <div className="flex w-full p-5 border-t border-dashed border-[#fcd401]">
              <Button onClick={handleConfirm} className="w-full mx-10" variant="success">
                {t('confirm')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const Body = ({ setShowModal }: { setShowModal: (isShow: boolean) => void }) => {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="font-[Noto Sans Thai] w-[732px] h-[550px] border-8 border-white bg-white/80 rounded-[64px] flex flex-col items-start gap-5 shadow-[0px_4px_0px0px#dfdede,0px_8px_4px_0px_rgba(0,0,0,0.15)] inset-0 bg-cover bg-center">
      <ScrollableContainer>
        <div className="text-xl leading-relaxed space-y-1 pl-5">
          <div className="text-xl font-bold pb-5">
            {t('privacy_policy_content.title')}
          </div>
          <span className="font-bold">
            <Trans t={t} i18nKey="privacy_policy_content.summary_title" />
          </span>
          <span className="font-light">
            <Trans t={t} i18nKey="privacy_policy_content.summary_content" />
          </span>
          {Array.from({ length: 9 }).map((_, index) => (
            <p key={`paragraph-${index}`} className="pt-3">
              <p className="font-bold">
                <Trans t={t} i18nKey={`privacy_policy_content.${index + 1}_title`} />
              </p>
              {index == 1 ? (
                <ul className="list-disc ms-5">
                  {Array.from({ length: 4 }).map((_, subindex) => (
                    <li>
                      <Trans
                        t={t}
                        i18nKey={`privacy_policy_content.${index + 1}_${subindex + 1}_content`}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Trans
                  t={t}
                  i18nKey={`privacy_policy_content.${index + 1}_content`}
                  className="font-light"
                />
              )}
            </p>
          ))}
        </div>
      </ScrollableContainer>

      <div className="flex w-full p-5 border-t border-dashed border-[#fcd401]">
        <Button
          onClick={() => {
            setShowModal(false);
          }}
          variant="success"
          className="w-full"
        >
          {t('confirm')}
        </Button>
      </div>
    </div>
  );
};

export default ModalPrivacyPolicy;

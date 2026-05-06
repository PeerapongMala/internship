import Button from '@component/web/atom/wc-a-button';
import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import { useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import sanitize from 'sanitize-html';
import Check from '../../../../assets/check.svg';
import styles from './index.module.css';

interface TermsAndConditionsProps {
  content?: string;
  date?: string;
  viewOnly?: boolean;
  onConfirm?: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  content,
  date = '',
  viewOnly = false,
  onConfirm,
}) => {
  const { t, i18n } = useTranslation(['global']);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm ? onConfirm() : navigate({ to: '/initial' });
    }, 300);
  };

  return (
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
          {t('terms.title')}
        </div>

        <ScrollableContainer className="pl-3">
          {date && (
            <div className="text-gray-600 flex justify-center w-full py-5">
              {t('terms.date', { date })}
            </div>
          )}
          <div className="text-xl leading-relaxed space-y-1 px-5">
            <div className="text-xl font-bold">{t('terms.userAgreement')}</div>
            <div className="pb-5 space-y-10 font-light">
              {content ? (
                <div
                  className="ql-editor !p-0"
                  dangerouslySetInnerHTML={{
                    __html: sanitize(content, {
                      allowedTags: sanitize.defaults.allowedTags.concat(['img']),
                    }),
                  }}
                />
              ) : (
                [t('terms.clause1'), t('terms.clause2'), t('terms.clause3')].map(
                  (text, index) => (
                    <p key={index} className="flex items-start">
                      <span className="mr-2">{index + 1}.</span>
                      <span className="mr-3">{text}</span>
                    </p>
                  ),
                )
              )}
            </div>
          </div>
        </ScrollableContainer>

        <div className="flex w-full p-5 border-t border-dashed border-[#fcd401]">
          <Button
            onClick={handleConfirm}
            className="w-full mx-10"
            variant="success"
            prefix={
              viewOnly ? <img src={Check} alt="Icon" className="w-10 h-10" /> : undefined
            }
          >
            {viewOnly ? t('terms.confirm') : t('terms.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

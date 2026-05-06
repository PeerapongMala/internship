import TermsAndConditions from '@component/web/molecule/wc-m-termcondition-modal';
import API from '@domain/g01/g01-d02/local/api';
import { toDateTimeTH } from '@global/helper/date';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import ConfigJson from '../../../config/index.json';

const ModalTOU = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { i18n } = useTranslation([ConfigJson.key]);

  const [tosData, setTosData] = useState<TermOfService>();
  const [isAccepted, setIsAccepted] = useState<boolean>(true);

  const currentLanguage = i18n.language as 'th' | 'en' | 'zh';


  useEffect(() => {
    async function init() {
      API.Terms.CheckAcceptance()
        .then((res) => {
          if (res.status_code === 200) {
            setIsAccepted(res.data);
          } else {
            setIsAccepted(false);
          }
        })
        .catch((err) => {
          console.error(err);
          setIsAccepted(false);
        });

      API.Terms.Get()
        .then((res) => {
          if (res.status_code === 200) {
            setTosData(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });

    }

    if (showModal) {
      init();
    }
  }, [showModal]);

  const handleOnConfirm = () => {
    if (!isAccepted) {
      API.Terms.AcceptAcceptance()
        .then((res) => {
          if (res.status_code === 200) {
            console.log("TOU Accepted")
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setShowModal(false)
  };

  const getTosData = (data: TermOfService | undefined) => {
    if (typeof data == "undefined") {
      return "Loading..."
    }

    if (typeof data.content === 'object' && data.content[currentLanguage]) {
      return data.content[currentLanguage]
    } else {
      return (tosData?.content as string)
    }
  }

  const getLastDateData = (data: TermOfService | undefined) => {
    if (typeof data == "undefined") {
      return ""
    }

    if (data.updated_at) {
      return toDateTimeTH(data.updated_at)
    }
    if (data.created_at) {
      return toDateTimeTH(data.created_at)
    }
  }

  return (
    <>
      {showModal ? (
        <TermsAndConditions
          content={getTosData(tosData)}
          date={getLastDateData(tosData)}
          // onCancel={() => setShowTermConditionModal(false)}
          onConfirm={handleOnConfirm}
          viewOnly={isAccepted}
        />
      ) : null}
    </>
  );
}


export default ModalTOU;

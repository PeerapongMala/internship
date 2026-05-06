// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import { Affiliation, AffiliationContract } from '../local/type';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../local/component/web/atom/wc-a-breadcrumbs';
import { useForm } from 'react-hook-form';
import API from '../local/api';
import FormTemplateContractWizard from '../local/component/web/template/contracts/wc-t-form-template-contract-wizard';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  // get path variables
  const { affiliationId } = useParams({ strict: false });

  const [affiliation, setAffiliation] = useState<Affiliation>();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);

    // get affiliation data
    API.affiliation?.GetById(affiliationId).then((res) => {
      if (res.status_code === 200) {
        setAffiliation(res.data);
      }
    });
  }, []); // Make sure to provide an appropriate dependency array

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        {/** breadcrumbs */}
        <CWBreadcrumbs
          links={[
            { label: 'สำหรับแอดมิน', href: '../../../../' },
            { label: 'สังกัดโรงเรียน', href: '../../../' },
            {
              label: `${affiliation?.id}: ${affiliation?.name}`,
              href: '../../',
            },
            {
              label: 'สัญญาสังกัด',
              href: '#',
            },
          ]}
        />
        {/** back button */}
        <div className="flex items-center gap-2.5">
          <Link to="../">
            <IconArrowBackward className="h-8 w-8 p-1" />
          </Link>
          <span className="text-2xl font-bold leading-8">สัญญาสังกัด</span>
        </div>
        {/** affiliation title */}
        <div className="rounded-md bg-neutral-100 p-2.5">
          <span className="text-2xl font-bold leading-8">{affiliation?.name}</span>
        </div>

        <FormTemplateContractWizard affiliationId={affiliationId} />
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;

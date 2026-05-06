import { Tag } from 'antd';
import type { MarketplaceSource } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

const LABEL_KEYS: Record<MarketplaceSource, string> = {
  lazada: 'lazada',
  shopee: 'shopee',
  tiktok: 'tiktok',
  'walk-in': 'walkIn',
  phone: 'phoneOrder',
};

interface Props {
  source?: MarketplaceSource;
}

export default function MarketplaceBadge({ source }: Props) {
  const { t } = useLanguage();
  if (!source) return null;
  return (
    <Tag>
      {t(LABEL_KEYS[source] as never)}
    </Tag>
  );
}

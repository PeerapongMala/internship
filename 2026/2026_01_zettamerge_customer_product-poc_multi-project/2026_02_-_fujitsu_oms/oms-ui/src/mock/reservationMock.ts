export const MOCK_MARKETPLACE_ADDRESSES = [
  {
    address: '99/1 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    coordinates: { lat: 13.7381, lng: 100.5654 },
  },
  {
    address: '222 ถ.วิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
    coordinates: { lat: 13.8199, lng: 100.5613 },
  },
  {
    address: '55/3 ถ.ประชาอุทิศ แขวงบางมด เขตทุ่งครุ กรุงเทพฯ 10140',
    coordinates: { lat: 13.6514, lng: 100.5022 },
  },
  {
    address: '789 ถ.ศรีนครินทร์ แขวงสวนหลวง เขตสวนหลวง กรุงเทพฯ 10250',
    coordinates: { lat: 13.7234, lng: 100.6345 },
  },
  {
    address: '100/5 ถ.บรมราชชนนี แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700',
    coordinates: { lat: 13.7651, lng: 100.4748 },
  },
  {
    address: '333 ถ.พระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพฯ 10150',
    coordinates: { lat: 13.6128, lng: 100.4523 },
  },
];

export function generateTrackingNumber(provider: 'flash' | 'dhl'): string {
  const prefix = provider === 'flash' ? 'FL' : 'DHL';
  return `${prefix}${Date.now().toString().slice(-10)}`;
}

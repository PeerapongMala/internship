import { TextDeviceID } from '../atoms/wc-a-text';

export function DialogFooter() {
  return (
    <div className="text-center mt-auto">
      <TextDeviceID>Device ID: 00000000</TextDeviceID>
    </div>
  );
}

export default DialogFooter;

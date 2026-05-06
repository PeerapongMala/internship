import Button from '../../atom/Button';
import IconUpload from '@global/asset/icon/upload.svg';
import IconImport from '@global/asset/icon/download.svg';

export default function ButtonCSVGroup() {
  return (
    <div className="mb-4 flex space-x-2">
      <Button className="bg-primary">
        <IconImport /> CSV
      </Button>
      <Button>
        <IconUpload /> CSV
      </Button>
    </div>
  );
}

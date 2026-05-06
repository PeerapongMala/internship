import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import { Map, MapData } from './Type';

interface ModalMapProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMap: (mapName: string) => void;
}

const ModalMap = ({
  open,
  onClose,
  children,
  onOk,
  onSelectMap,
  ...rest
}: ModalMapProps) => {
  const [mapData, setMapData] = useState<Map[]>(MapData || []);
  const [selectedMap, setSelectedMap] = useState('');
  const handleSelectMap = (mapName: string) => {
    setSelectedMap(mapName);
  };
  const handleConfirmSelectMap = () => {
    onSelectMap(selectedMap);
    onClose();
  };

  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เลือกฉาก"
      {...rest}
    >
      <div className="flex max-h-[650px] w-full flex-col overflow-y-auto">
        <div className="w-full px-10 py-5">
          <div className="grid grid-cols-3 gap-10">
            {mapData.map((data, index) => (
              <div
                key={index}
                className={`${selectedMap === data.MapName ? 'border-red-400' : ''} flex flex-col items-center border-4 p-1 duration-200 hover:scale-105 hover:cursor-pointer hover:border-red-400`}
                onClick={() => handleSelectMap(data.MapName)}
              >
                <img
                  src={data.image}
                  alt=""
                  className="object-cover xl:h-[200px] xl:w-[300px]"
                />
                <p className="mt-5">{data.MapName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-5 px-5 py-5">
        <button onClick={onClose} className="btn btn-outline-primary flex w-32 gap-2">
          ยกเลิก
        </button>
        <button
          onClick={handleConfirmSelectMap}
          className="btn btn-primary flex w-32 gap-2"
          disabled={!selectedMap}
        >
          เลือก
        </button>
      </div>
    </Modal>
  );
};

export default ModalMap;

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Map } from '../../../Type';

interface ModalMapProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMap: (selectedMap: {
    id: number;
    map_name: string;
    image_path: string;
  }) => void;
  MapData?: Map[];
  seed_subject_group_id?: number;
  initialSelectedMapId?: number;
}

const ModalMap = ({
  open,
  onClose,
  children,
  onOk,
  onSelectMap,
  MapData,
  seed_subject_group_id,
  initialSelectedMapId,
  ...rest
}: ModalMapProps) => {
  const filteredMapData = (MapData || []).filter(
    (map) => map.seed_subject_group_id === seed_subject_group_id,
  );
  const sortedMapData = [...filteredMapData].sort((a, b) => a.id - b.id);
  const [selectedMap, setSelectedMap] = useState<{
    id: number;
    map_name: string;
    image_path: string;
  } | null>(
    initialSelectedMapId
      ? filteredMapData.find((map) => map?.id === initialSelectedMapId) ||
          (sortedMapData.length > 0
            ? {
                id: sortedMapData[0].id,
                map_name: sortedMapData[0].map_name,
                image_path: sortedMapData[0].image_path,
              }
            : null)
      : sortedMapData.length > 0
        ? {
            id: sortedMapData[0].id,
            map_name: sortedMapData[0].map_name,
            image_path: sortedMapData[0].image_path,
          }
        : null,
  );

  const handleSelectMap = (id: number, mapName: string, mapPath: string) => {
    setSelectedMap({ id: id, map_name: mapName, image_path: mapPath });
  };

  const handleConfirmSelectMap = () => {
    if (selectedMap) {
      onSelectMap(selectedMap);
      onClose();
    }
  };
  const handleCloseAndSelect = () => {
    onClose();
  };
  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={handleCloseAndSelect}
      onOk={onOk}
      disableCancel
      disableOk
      title="เลือกฉาก"
      {...rest}
    >
      <div className="flex max-h-[650px] w-full flex-col overflow-y-auto">
        <div className="w-full px-10 py-5">
          <div className="grid grid-cols-3 gap-10">
            {sortedMapData?.map((data, index) => (
              <div
                key={index}
                className={`${selectedMap?.id === data.id ? 'border-primary text-primary' : ''} flex flex-col items-center border-4 p-1 duration-200 hover:scale-105 hover:cursor-pointer hover:border-primary`}
                onClick={() => handleSelectMap(data.id, data.map_name, data.image_path)}
              >
                <img
                  src={data.image_path}
                  alt=""
                  className="object-cover xl:h-[200px] xl:w-[300px]"
                />
                <p className="mt-5">{data.map_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-5 px-5 py-5">
        <button
          onClick={handleCloseAndSelect}
          className="btn btn-outline-dark flex w-32 gap-2"
        >
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

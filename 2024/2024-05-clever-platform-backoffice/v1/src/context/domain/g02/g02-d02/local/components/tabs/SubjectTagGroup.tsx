import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import { DataTable } from 'mantine-datatable';
import { ITag, ITagGroup, ManageYearStatus } from '../../type';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import { useState } from 'react';
import { Modal } from '@component/web/cw-modal';
import CWInput from '@component/web/cw-input';
import showMessage from '@global/utils/showMessage';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';

const TSubjectTagGroup = ({
  tagGroups,
  onTagGroupChange,
  onTagCreate,
  onTagUpdate,
  onTagArchive,
}: {
  tagGroups: ITagGroup[];
  onTagGroupChange(data: Partial<ITagGroup>): void;
  onTagCreate(data: Partial<ITag> & { tag_group_id: number }): void;
  onTagUpdate(data: Partial<ITag>): void;
  onTagArchive(status: 'enabled' | 'disabled', data: Partial<ITag>): void;
}) => {
  const statuses = [
    {
      label: 'แบบร่าง',
      value: ManageYearStatus.DRAFT,
      className: 'badge-outline-dark',
    },
    {
      label: 'ใช้งาน',
      value: ManageYearStatus.IN_USE,
      className: 'badge-outline-success',
    },
    {
      label: 'ไม่ใช้งาน',
      value: ManageYearStatus.NOT_IN_USE,
      className: 'badge-outline-danger',
    },
  ];

  const [modalType, setModalType] = useState<
    '' | 'tag_group_edited' | 'tag_created' | 'tag_edited'
  >('');
  const [tagGroup, setTagGroup] = useState<ITagGroup>();
  const [tag, setTag] = useState<ITag>();

  const [tagName, setTagName] = useState('');
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isRecallDialogOpen, setRecallDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ITag>();

  function closeModal() {
    setModalType('');
    setTagName('');
    setTagGroup(undefined);
  }

  function closeArchiveModal() {
    setArchiveDialogOpen(false);
    setRecallDialogOpen(false);
    setSelectedRecord(undefined);
  }

  return (
    <div className={`flex h-fit w-full flex-col gap-2 rounded-md bg-white p-4 shadow-md`}>
      {tagGroups.map((group) => (
        <div key={`tag_${group.id}`} className="flex flex-col gap-4">
          <hr />
          <h1 className="text-lg font-bold">{group.name}</h1>
          <div className="flex gap-2">
            <CWButton
              icon={<IconPen />}
              type="button"
              title="แก้ไขชื่อ"
              onClick={() => {
                setModalType('tag_group_edited');
                setTagGroup(group);
                setTagName(group.name);
              }}
            />
            <CWButton
              icon={<IconPlus />}
              type="button"
              title="เพิ่ม Tag"
              onClick={() => {
                setModalType('tag_created');
                setTagGroup(group);
              }}
            />
          </div>
          <DataTable
            className="table-hover"
            records={group.tags}
            minHeight={200}
            noRecordsText="ไม่พบข้อมูล"
            columns={[
              {
                accessor: '#',
                title: '#',
                width: 40,
                render: (_, index) => index + 1,
              },
              { accessor: 'id', title: 'Tag ID' },
              { accessor: 'name', title: 'ชื่อ' },
              {
                accessor: 'updated_at',
                title: 'แก้ไขล่าสุด',
                render: ({ updated_at }) => (updated_at ? toDateTimeTH(updated_at) : ''),
              },
              { accessor: 'updated_by', title: 'แก้ไขล่าสุดโดย' },
              {
                accessor: 'status',
                title: 'เปิดใช้งาน',
                render: ({ status }) => {
                  const _status = statuses.find((s) => s.value == status);
                  return (
                    <span className={`badge ${_status?.className ?? ''}`}>
                      {_status?.label ?? status}
                    </span>
                  );
                },
              },
              {
                accessor: 'edit',
                title: 'แก้ไข',
                width: 80,
                titleClassName: 'text-center',
                cellsClassName: 'text-center',
                render: (record) => (
                  <button
                    type="button"
                    onClick={() => {
                      setModalType('tag_edited');
                      setTagGroup(group);
                      setTag(record);
                      setTagName(record.name);
                    }}
                  >
                    <IconPen />
                  </button>
                ),
              },
              {
                accessor: 'archive',
                title: 'จัดเก็บ',
                width: 80,
                titleClassName: 'text-center',
                cellsClassName: 'text-center',
                render: (record) =>
                  record.status === 'disabled' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecord(record);
                        setRecallDialogOpen(true);
                      }}
                    >
                      <IconCornerUpLeft />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecord(record);
                        setArchiveDialogOpen(true);
                      }}
                    >
                      <IconArchive />
                    </button>
                  ),
              },
            ]}
          />
        </div>
      ))}

      <CWModalArchive
        open={isArchiveDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onTagArchive('disabled', selectedRecord);
            closeArchiveModal();
          } else {
            showMessage('กรุณาเลือกรายการจัดเก็บ', 'warning');
            closeArchiveModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={isRecallDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onTagArchive('enabled', selectedRecord);
            closeArchiveModal();
          } else {
            showMessage('กรุณาเลือกรายการเปิดใช้งาน', 'warning');
            closeArchiveModal();
          }
        }}
      />

      {modalType != '' ? (
        <Modal
          open
          onClose={closeModal}
          title={
            modalType == 'tag_group_edited'
              ? `แก้ไขชื่อ`
              : modalType == 'tag_created'
                ? `เพิ่ม Tag`
                : 'แก้ไข Tag'
          }
        >
          <div className="flex flex-col gap-4">
            <CWInput
              value={tagName}
              className="w-96"
              onChange={(e) => {
                setTagName(e.currentTarget.value);
              }}
            />
            <div className="flex gap-2 *:flex-1">
              <CWButton
                type="button"
                className="!border-dark-light !bg-white !text-dark hover:!bg-dark hover:!text-white"
                title="ยกเลิก"
                onClick={closeModal}
              />
              <CWButton
                type="button"
                title="บันทึก"
                onClick={() => {
                  if (tagGroup && modalType == 'tag_group_edited') {
                    onTagGroupChange({
                      id: tagGroup.id,
                      name: tagName,
                    });
                    closeModal();
                  } else if (tagGroup && modalType == 'tag_created') {
                    onTagCreate({
                      tag_group_id: tagGroup.id,
                      name: tagName,
                    });
                    closeModal();
                  } else if (tag && modalType == 'tag_edited') {
                    onTagUpdate({
                      id: tag.id,
                      name: tagName,
                      status: tag.status,
                    });
                    closeModal();
                  } else {
                    showMessage('กรุณาเลือกกลุ่ม Tag', 'warning');
                    closeModal();
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      ) : (
        ''
      )}
    </div>
  );
};

export default TSubjectTagGroup;

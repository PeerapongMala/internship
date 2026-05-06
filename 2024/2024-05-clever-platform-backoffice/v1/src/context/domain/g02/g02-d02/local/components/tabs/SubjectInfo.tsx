import { useEffect, useRef, useState } from 'react';
import { ISubject, ISubjectGroup } from '../../type';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import { useParams } from '@tanstack/react-router';

const TSubjectInfo = ({
  subject,
  onDataChange,
  subjectGroups,
}: {
  subject?: ISubject;
  onDataChange(data: {
    subject_image: File | undefined;
    subject_group_id: number;
    name: string;
  }): void;
  subjectGroups: ISubjectGroup[];
}) => {
  const { subjectGroupId } = useParams({ strict: false });
  const imageRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    subject_image: File | undefined;
    subject_group_id: string;
    name: string;
  }>({
    subject_image: undefined,
    subject_group_id: subject?.subject_group_id.toString() ?? subjectGroupId,
    name: subject?.name ?? '',
  });

  function onInput(key: 'subject_image' | 'subject_group_id' | 'name', value: any) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    onDataChange({
      subject_image: formData.subject_image,
      subject_group_id: +formData.subject_group_id,
      name: formData.name,
    });
  }, [formData]);

  return (
    <div
      className={`flex flex-1 flex-col gap-6 rounded-md bg-white p-6 shadow-md xl:justify-center`}
    >
      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex flex-col items-center self-center xl:w-[300px]">
          <div className="flex h-[250px] w-[250px] items-center justify-center rounded-full bg-gray-200">
            {formData.subject_image || subject?.image_url ? (
              <img
                src={
                  formData.subject_image
                    ? URL.createObjectURL(formData.subject_image)
                    : subject?.image_url
                      ? subject.image_url
                      : ''
                }
                alt="Preview"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500">ภาพโปรไฟล์</span>
            )}
          </div>
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              onInput('subject_image', e.currentTarget.files?.[0]);
            }}
          />
          <button
            onClick={() => {
              imageRef?.current?.click();
            }}
            type="button"
            className="border-pritext-primary hover:bg-pritext-primary mt-4 h-10 w-4/5 rounded-md border bg-white text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white"
          >
            อัพโหลดรูป
          </button>
          <span className="mt-2 text-xs text-gray-400">ขนาดแนะนำ: xxxxxxx</span>
        </div>

        <div className="flex flex-1 gap-6">
          <CWSelect
            label="กลุ่มวิชา"
            options={subjectGroups.map((group) => ({
              label: group.seed_subject_group_name,
              value: group.id.toString(),
            }))}
            required
            onChange={(e) => {
              onInput('subject_group_id', e.currentTarget.value);
            }}
            value={formData.subject_group_id}
            className="flex-1"
          />
          <CWInput
            label="ชื่อวิชา"
            required
            className="flex-1"
            value={formData.name}
            onChange={(e) => {
              onInput('name', e.currentTarget.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TSubjectInfo;

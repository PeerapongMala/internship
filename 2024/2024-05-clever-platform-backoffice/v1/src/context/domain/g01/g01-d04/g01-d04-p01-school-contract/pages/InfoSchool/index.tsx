import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import AffiliationModal from '@domain/g01/g01-d04/g01-d04-p01-school-contract/pages/InfoSchool/AffiliationModal';
import API from '@domain/g01/g01-d04/local/api';
import { SchoolAffiliation, SchoolByIdResponse } from '@domain/g01/g01-d04/local/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import districts from '@global/utils/geolocation/data/districts.json';
import provinces from '@global/utils/geolocation/data/provinces.json';
import regions from '@global/utils/geolocation/data/regions.json';
import subDistricts from '@global/utils/geolocation/data/subdistricts.json';
import showMessage from '@global/utils/showMessage.ts';
import { useNavigate, useParams } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="relative flex flex-col rounded-md bg-white p-4 shadow dark:bg-black">
    <p className="pb-4 text-lg font-bold">{title}</p>
    {children}
  </div>
);

function InfoSchool() {
  const { schoolId } = useParams({ from: '' });
  const isCreateMode = schoolId === 'create';
  const navigate = useNavigate();
  const [schoolData, setSchoolData] = useState<SchoolByIdResponse>(
    {} as SchoolByIdResponse,
  );
  const [currentData, setCurrentData] = useState<SchoolByIdResponse>(
    {} as SchoolByIdResponse,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCreateMode) return;

    setLoading(true);
    API.school
      .GetById(schoolId)
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          throw new Error('School not found in the system.');
        }
        setSchoolData(data);
        setCurrentData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch school data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [schoolId]);

  const [selectAffiliation, setSelectAffiliation] = useState<SchoolAffiliation | null>(
    null,
  );

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(
      JSON.stringify(currentData) !== JSON.stringify(schoolData) ||
        selectAffiliation !== null,
    );
  }, [currentData, schoolData, selectAffiliation]);

  const statusOptions = [
    { value: 'enabled', label: 'ใช้งาน' },
    { value: 'disabled', label: 'ไม่ใช้งาน' },
    { value: 'draft', label: 'แบบร่าง' },
  ];
  const regionOptions = [
    ...regions.map((region) => ({
      value: region.id,
      label: 'ภาค' + region.regionNameTh,
    })),
  ];

  const provinceOptions = [
    ...provinces
      .filter(
        (province) =>
          province.regionCode ===
          Number(
            regionOptions.find((option) => option.label === currentData.region)?.value ||
              currentData.region,
          ),
      )
      .map((province) => ({
        value: province.provinceCode,
        label: province.provinceNameTh,
      })),
  ];

  const districtOptions = [
    ...districts
      .filter(
        (district) =>
          district.provinceCode ===
          Number(
            provinceOptions.find((option) => option.label === currentData.province)
              ?.value || currentData.province,
          ),
      )
      .map((district) => ({
        value: district.districtCode,
        label: district.districtNameTh,
      })),
  ];

  const subDistrictOptions = [
    ...subDistricts
      .filter(
        (subDistrict) =>
          subDistrict.districtCode ===
          Number(
            districtOptions.find((option) => option.label === currentData.district)
              ?.value || currentData.district,
          ),
      )
      .map((subDistrict) => ({
        value: subDistrict.subdistrictCode,
        label: subDistrict.subdistrictNameTh,
      })),
  ];

  const getOptionValue = (
    options: {
      value: number;
      label: string;
    }[],
    label: string,
  ) => options.find((option) => option.label === label)?.value || label;

  const [modalAffiliation, setModalAffiliation] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    affiliation: '',
    type: '',
    schoolAffiliationGroup: '',
  });

  const handleDropdownSelect =
    (key: string) =>
    (value: string): void => {
      setSelectedOptions((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handleInputChange = (key: keyof SchoolByIdResponse, value: string) => {
    setCurrentData((prev) => {
      const updates: Partial<SchoolByIdResponse> = { [key]: value };
      if (key === 'region') {
        updates.region =
          regionOptions.find((option) => option.value === Number(value))?.label || '';
        updates.province = '';
        updates.district = '';
        updates.sub_district = '';
        updates.post_code = '';
      } else if (key === 'province') {
        updates.province =
          provinceOptions.find((option) => option.value === Number(value))?.label || '';
        updates.district = '';
        updates.sub_district = '';
        updates.post_code = '';
      } else if (key === 'district') {
        updates.district =
          districtOptions.find((option) => option.value === Number(value))?.label || '';
        updates.sub_district = '';
        updates.post_code = '';
      }
      return { ...prev, ...updates };
    });
  };

  const handleSave = async () => {
    const requiredFields = [
      { key: 'name', label: 'ชื่อโรงเรียน' },
      { key: 'address', label: 'ที่อยู่' },
      { key: 'region', label: 'ภาค' },
      { key: 'province', label: 'จังหวัด' },
      { key: 'district', label: 'อำเภอ' },
      { key: 'sub_district', label: 'ตำบล' },
      { key: 'status', label: 'สถานะ' },
      { key: 'code', label: 'รหัสโรงเรียน' },
    ];

    for (const field of requiredFields) {
      if (!currentData[field.key as keyof SchoolByIdResponse]) {
        showMessage(`กรุณากรอกข้อมูล: ${field.label}`, 'info');
        return;
      }
    }

    if (!currentData.school_affiliation_id && !selectAffiliation) {
      showMessage(`กรุณากรอกข้อมูล: สังกัด`, 'info');
      return;
    }

    if (!isChanged && schoolData.id) return;

    try {
      const updatedData = {
        ...currentData,
        school_affiliation_id: selectAffiliation?.id || currentData.school_affiliation_id,
        updated_by: currentData.updated_by || '-',
      };

      const action = schoolData.id
        ? await API.school.Update(currentData.id.toString(), updatedData)
        : await API.school.Create({
            ...updatedData,
            created_by: 'current_user_id',
          });

      await action;
      showMessage(schoolData.id ? 'บันทึกสำเร็จ' : 'โรงเรียนถูกสร้างเรียบร้อยแล้ว');
      await navigate({ to: `/admin/school` });
    } catch (error) {
      console.error('Error saving school data:', error);
      showMessage('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
        event.target.value = '';
        return;
      }

      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showMessage('ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
        event.target.value = '';
        return;
      }

      setCurrentData((prev) => ({
        ...prev,
        school_profile: file,
      }));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="font-noto-sans-thai">
      <div className="flex flex-row gap-6">
        <div className="flex w-3/4 flex-col gap-4">
          <Section title="ข้อมูลโรงเรียน">
            <div className="flex flex-row gap-[54px]">
              <div className="flex flex-col items-center gap-[10px]">
                <div className="h-60 w-60 overflow-hidden rounded-full bg-gray-400">
                  {currentData.school_profile instanceof File ? (
                    <img
                      src={URL.createObjectURL(currentData.school_profile)}
                      alt="Uploaded"
                      className="h-full w-full object-cover"
                    />
                  ) : currentData.image_url ? (
                    <img
                      src={currentData.image_url}
                      alt="Uploaded"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-500">
                      ไม่มีรูป
                    </div>
                  )}
                </div>
                <label
                  htmlFor="upload-button"
                  className="btn btn-outline-primary cursor-pointer"
                >
                  อัพโหลดรูป
                </label>
                <input
                  id="upload-button"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-center text-sm text-neutral-400">
                  <p>อัปโหลดรูป</p>
                  <p>format: .jpg, .png | อัปโหลดรูป 5 MB</p>
                </div>
              </div>
              <div className="flex w-full flex-col">
                <div className="mb-2 w-full">
                  <CWInput
                    label="ชื่อโรงเรียน"
                    value={currentData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2 flex w-full flex-row items-center justify-between">
                  <p className="text-sm">
                    <span className="text-red-500">*</span>สังกัด
                  </p>
                  <button
                    onClick={() => setModalAffiliation(true)}
                    className="btn btn-outline-primary"
                  >
                    เลือกสังกัด
                  </button>
                </div>
                <div className="h-auto w-full rounded-md border p-4">
                  <div className="flex flex-row justify-between">
                    <div className="w-1/2">
                      <p className="text-sm">กลุ่มสังกัด:</p>
                      <p className="text-sm">สำนักงานเขตพื้นที่:</p>
                      <p className="text-sm">ประเภท:</p>
                    </div>
                    <div className="w-1/2">
                      <p className="text-sm">
                        {selectAffiliation?.name || currentData.school_affiliation_name}
                      </p>
                      <p className="text-sm">
                        {selectAffiliation?.id || currentData.school_affiliation_id}
                      </p>
                      <p className="text-sm">
                        {selectAffiliation?.type || currentData.school_affiliation_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="ที่อยู่โรงเรียน">
            <div className="flex flex-row gap-6">
              <div className="flex w-1/2 flex-col gap-4">
                <CWInput
                  label="ที่อยู่"
                  value={currentData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
                <CWSelect
                  options={provinceOptions}
                  title={'เลือกจังหวัด'}
                  label="จังหวัด"
                  value={getOptionValue(provinceOptions, currentData.province)}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  required
                  disabled={!currentData.region}
                />
                <CWSelect
                  options={subDistrictOptions}
                  title={'เลือกตำบล'}
                  label="ตำบล"
                  value={getOptionValue(subDistrictOptions, currentData.sub_district)}
                  onChange={(e) => {
                    handleInputChange('sub_district', e.target.value);
                    const selectedSubDistrict = subDistricts.find(
                      (subDistrict) =>
                        subDistrict.subdistrictCode === Number(e.target.value),
                    );
                    if (selectedSubDistrict) {
                      handleInputChange(
                        'post_code',
                        String(selectedSubDistrict.postalCode),
                      );
                    }
                  }}
                  required
                  disabled={!currentData.district}
                />
                <div className="flex gap-6">
                  <CWInput
                    label="ละติจูด"
                    value={currentData.latitude || undefined}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="00.0000"
                    className="w-full"
                  />
                  <CWInput
                    label="ลองจิจูด"
                    value={currentData.longtitude || undefined}
                    onChange={(e) => handleInputChange('longtitude', e.target.value)}
                    placeholder="00.0000"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex w-1/2 flex-col gap-4">
                <CWSelect
                  options={regionOptions}
                  title={'เลือกภาค'}
                  label="ภาค"
                  value={getOptionValue(regionOptions, currentData.region)}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  required
                />

                <CWSelect
                  options={districtOptions}
                  title={'เลือกอำเภอ'}
                  label="อำเภอ"
                  value={getOptionValue(districtOptions, currentData.district)}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                  disabled={!currentData.province}
                />
                <CWInput
                  label="รหัสไปรษณีย์"
                  value={currentData.post_code}
                  onChange={(e) => handleInputChange('post_code', e.target.value)}
                  required
                  disabled
                />
              </div>
            </div>
          </Section>

          <Section title="ข้อมูลผู้ติดต่อ">
            <div className="flex flex-row gap-6">
              <div className="flex w-1/2 flex-col gap-4">
                <CWInput
                  label="ผู้อำนวยการ"
                  value={currentData.director || undefined}
                  onChange={(e) => handleInputChange('director', e.target.value)}
                />
                <CWInput
                  label="รองผู้อำนวยการ"
                  value={currentData.deputy_director || undefined}
                  onChange={(e) => handleInputChange('deputy_director', e.target.value)}
                />
                <CWInput
                  label="นายทะเบียน"
                  value={currentData.registrar || undefined}
                  onChange={(e) => handleInputChange('registrar', e.target.value)}
                />
                <CWInput
                  label="หัวหน้าวิชาการโรงเรียน"
                  value={currentData.academic_affair_head || undefined}
                  onChange={(e) =>
                    handleInputChange('academic_affair_head', e.target.value)
                  }
                />
                <CWInput
                  label="ครูที่ปรึกษา"
                  value={currentData.advisor || undefined}
                  onChange={(e) => handleInputChange('advisor', e.target.value)}
                />
              </div>
              <div className="flex w-1/2 flex-col gap-4">
                <CWInput
                  label="เบอร์โทร"
                  value={currentData.director_phone_number || undefined}
                  onChange={(e) =>
                    handleInputChange('director_phone_number', e.target.value)
                  }
                />
                <CWInput
                  label="เบอร์โทร"
                  value={currentData.deputy_director_phone_number || undefined}
                  onChange={(e) =>
                    handleInputChange('deputy_director_phone_number', e.target.value)
                  }
                />
                <CWInput
                  label="เบอร์โทร"
                  value={currentData.registrar_phone_number || undefined}
                  onChange={(e) =>
                    handleInputChange('registrar_phone_number', e.target.value)
                  }
                />
                <CWInput
                  label="เบอร์โทร"
                  value={currentData.academic_affair_head_phone_number || undefined}
                  onChange={(e) =>
                    handleInputChange('academic_affair_head_phone_number', e.target.value)
                  }
                />
                <CWInput
                  label="เบอร์โทร"
                  value={currentData.advisor_phone_number || undefined}
                  onChange={(e) =>
                    handleInputChange('advisor_phone_number', e.target.value)
                  }
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="relative flex h-fit w-1/4 flex-col gap-4 rounded-md bg-white p-4 shadow dark:bg-black">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <p className="w-1/2">
                <span className="text-red-500">*</span>รหัสโรงเรียน
              </p>
              {schoolData.code ? (
                <p className="w-1/2">{schoolData.code}</p>
              ) : (
                <input
                  type="text"
                  className="w-1/2 rounded border border-gray-300 p-1"
                  onChange={(e) => handleInputChange('code', e.target.value)}
                />
              )}
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              <p className="w-1/2">
                <span className="text-red-500">*</span>สถานะ
              </p>
              <span className="w-1/2">
                <WCADropdown
                  placeholder={
                    statusOptions.find((o) => o.value === currentData.status)?.label ||
                    'เลือกสถานะ'
                  }
                  options={statusOptions.map((o) => o.label)}
                  onSelect={(label: string) => {
                    const selectedValue =
                      statusOptions.find((o) => o.label === label)?.value || '';
                    handleInputChange('status', selectedValue);
                  }}
                />
              </span>
            </div>
            {currentData.updated_at && (
              <div className="flex flex-row gap-4">
                <p className="w-1/2">แก้ไขล่าสุด</p>
                <p className="w-1/2">
                  {toDateTimeTH(new Date(currentData.updated_at)).toString()}
                </p>
              </div>
            )}
            {currentData.updated_by && (
              <div className="flex flex-row gap-4">
                <p className="w-1/2">แก้ไขโดย</p>
                <p className="w-1/2">{currentData.updated_by}</p>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={!isChanged}>
            บันทึก
          </button>
        </div>
      </div>

      <AffiliationModal
        isOpen={modalAffiliation}
        onClose={() => setModalAffiliation(false)}
        selectedOptions={selectedOptions}
        handleDropdownSelect={handleDropdownSelect}
        setSelectAffiliation={setSelectAffiliation}
      />
    </div>
  );
}

export default InfoSchool;

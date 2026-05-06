import { useEffect, useState } from 'react';
import StoreGlobal from '@global/store/global';

interface SubGroup {
  title: string;
  subGroups: string[];
}

interface CheckboxProps {
  title: string;
  options: { title: string; subGroups: any[] }[];
  checked?: boolean;
  onChange?: (isChecked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ title, options, checked, onChange }) => {
  useEffect(() => {
    //
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []); // Make sure to provide an appropriate dependency array

  const [isExpanded, setIsExpanded] = useState(false); // สำหรับการขยาย/ยุบเมนูย่อย
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({}); // สำหรับการขยาย/ยุบกลุ่มย่อย
  const [checkedGroups, setCheckedGroups] = useState<{ [key: string]: boolean }>({}); // สำหรับการเลือก checbox กลุ่มย่อย
  const [checkedSubGroups, setCheckedSubGroups] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({}); // สำหรับการเลือก checkbox กลุ่มเรียน

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubGroupExpand = (groupTitle: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupTitle]: !prevState[groupTitle], // ขยาย/ยุบกลุ่มย่อย
    }));
  };
  const handleCheckAll = (groupTitle: string) => {
    const isChecked = !checkedGroups[groupTitle];
    setCheckedGroups((prevState) => ({
      ...prevState,
      [groupTitle]: isChecked,
    }));
    setCheckedSubGroups((prevState) => ({
      ...prevState,
      [groupTitle]:
        options
          .find((options) => options.title === groupTitle)
          ?.subGroups.reduce(
            (acc, subgroup) => ({
              ...acc,
              [subgroup]: isChecked,
            }),
            {},
          ) || {},
    }));
  };

  const handleCheckSubGroup = (groupTitle: string, subGroup: string) => {
    const isChecked = !checkedSubGroups[groupTitle]?.[subGroup];
    setCheckedSubGroups((prevState) => ({
      ...prevState,
      [groupTitle]: {
        ...prevState[groupTitle],
        [subGroup]: isChecked,
      },
    }));
  };

  return (
    <div className="p-4">
      {/* Checkbox หลัก */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="" className="ml-2 cursor-pointer">
          {title}
        </label>
      </div>

      {/* ตัวเลือกย่อย */}
      {isExpanded && (
        <div className="ml-5 mt-2 space-y-2">
          {options.map((option, index) => (
            <div key={index} className="ml-10">
              <div className="flex items-center">
                <button
                  onClick={() => toggleSubGroupExpand(option.title)}
                  className="mr-2"
                >
                  {expandedGroups[option.title] ? '▼' : '▶'} {/* ลูกศรพับ/ขยาย */}
                </button>
                <label className="ml-2 cursor-pointer">{option.title}</label>
              </div>

              {/* แสดงกลุ่มเรียนเมื่อเลือก */}
              {expandedGroups[option.title] && (
                <div className="ml-5 flex items-center gap-5">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={!!checkedGroups[option.title]}
                      onChange={() => handleCheckAll(option.title)}
                    />
                    <label htmlFor="" className="ml-2 mt-2 cursor-pointer">
                      ทั้งหมด
                    </label>
                  </div>
                  {option.subGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={!!checkedSubGroups[option.title]?.[group]}
                        onChange={() => handleCheckSubGroup(option.title, group)}
                      />
                      <label htmlFor="" className="ml-2 mt-2 cursor-pointer">
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Checkbox;

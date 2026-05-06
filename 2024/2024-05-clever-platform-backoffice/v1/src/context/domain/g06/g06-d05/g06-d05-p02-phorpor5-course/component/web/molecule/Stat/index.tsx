import Label from '../../../../../local/component/web/atom/Label';
import FormRow from '../FormRow';

export default function Stat() {
  return (
    <>
      <div className="grid grid-cols-4 items-center">
        <div className="overflow-hidden text-ellipsis">
          <Label text="นักเรียนต้นปีการศึกษา" />
        </div>

        <FormRow
          label="ชาย"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="หญิง"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="รวม"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
      </div>

      <div className="grid grid-cols-4 items-center">
        <div className="overflow-hidden text-ellipsis">
          <Label text="ออกระหว่างปีการศึกษา" />
        </div>

        <FormRow
          label="ชาย"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="หญิง"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="รวม"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
      </div>

      <div className="grid grid-cols-4 items-center">
        <div className="overflow-hidden text-ellipsis">
          <Label text="เข้าระหว่างปีการศึกษา" />
        </div>

        <FormRow
          label="ชาย"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="หญิง"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />

        <FormRow
          label="รวม"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
      </div>

      <div className="grid grid-cols-4 items-center">
        <div className="overflow-hidden text-ellipsis">
          <Label text="รวมสิ้นปีการศึกษา" />
        </div>
        <FormRow
          label="ชาย"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
        <FormRow
          label="หญิง"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
        <FormRow
          label="รวม"
          value={11}
          labelAfter="คน"
          classNameInput="w-10"
          className="justify-start"
        />
      </div>
    </>
  );
}

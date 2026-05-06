import { Divider } from '@core/design-system/library/vristo/source/components/Divider';

const BaseInformation = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ข้อมูลด่าน</h1>
        <button className="btn btn-danger w-32 font-bold">เผยแพร่</button>
      </div>
      <Divider />
      <div className="grid grid-cols-[20%_80%] gap-2">
        <div>รหัสด่าน:</div>
        <div>000001</div>

        <div>สถานะ:</div>
        <div>
          <span className="badge badge-outline-info">แบบร่าง</span>
        </div>

        <div>วิชา:</div>
        <div>คณิตศาสตร์</div>

        <div>ชั้นปี:</div>
        <div>ป. 4</div>

        <div>บทเรียน:</div>
        <div>บทที่ 1-1 จำนวนนับไม่เกิน 1 ล้าน</div>

        <div>บทเรียนย่อย:</div>
        <div>
          อ่านและเขียนตัวเลขฮินดูอารบิก ตัวเลขไทย และตัวหนังสือแสดงจำนวนนับที่มากกว่า
          100,000
        </div>

        <div>แก้ไขล่าสุด:</div>
        <div>20 ก.พ 2565 24:24</div>

        <div>แก้ไขล่าสุดโดย:</div>
        <div>Admin</div>
      </div>
    </>
  );
};

export default BaseInformation;

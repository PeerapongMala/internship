const addDay = (date: Date | null, num: number): Date | null => {
    if (!date) return null; // ตรวจสอบว่ามีวันที่หรือไม่
    const newDate = new Date(date); // สร้างสำเนาใหม่ของวันที่
    newDate.setDate(newDate.getDate() + num); // เพิ่มวันที่ตามจำนวนที่ระบุ
    return newDate;
  };
  
  export default addDay;
  
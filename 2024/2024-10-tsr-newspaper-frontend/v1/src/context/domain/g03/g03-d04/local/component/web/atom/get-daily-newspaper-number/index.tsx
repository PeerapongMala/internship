const getDailyNewspaperNumber = (date: Date): number => {
    const current = new Date(date);
    const year = current.getFullYear();
  
    // ปี 2025 เริ่มนับจาก 1 เม.ย. (วันแรก)
    const baseDate =
      year === 2025
        ? new Date('2025-04-01')
        : new Date(`${year}-01-01`);
  
    // ถ้าวันที่อยู่ก่อนวันเริ่มต้นของปีนั้นๆ → ไม่มีฉบับ
    if (current < baseDate) return 0;
  
    const diffTime = current.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays + 1; // ฉบับแรกคือวันที่ baseDate = ฉบับที่ 1
  };
export default getDailyNewspaperNumber;
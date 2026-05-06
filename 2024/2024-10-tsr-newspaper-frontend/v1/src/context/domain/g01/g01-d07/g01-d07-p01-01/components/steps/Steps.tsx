const listAll = [
    {
      howTo: 'ขั้นตอนการ',
      topic: 'ลงประกาศหนังสือพิมพ์และชำระเงิน',
      steps: [
        'การสมัครสมาชิก',
        ['1.1 สมัครสมาชิกด้วย E-mail หรือสร้าง Username (ไม่สามารถแก้ไขภายหลังได้)'],
        'การเตรียมและอัปโหลดไฟล์',
        ['2.1 เลือกอัปโหลดไฟล์ในรูปแบบ PDF, JPEG หรือ PNG ในรูปแบบแนวตั้งเท่านั้น','2.2 เนื้อหาที่นำมาลงต้องเป็นไปตาม ข้อกำหนดการใช้งาน'],
        'การลงประกาศและตรวจสอบข้อมูล',
        ['3.1 ระบุวันที่ต้องการลงประกาศ', '3.2 ท่านสามารถลงประกาศได้หลายกรอบพร้อมกัน', '3.3 กดลงประกาศ ระบบจะนำไปยังหน้าตรวจสอบ','3.4 ตรวจสอบความถูกต้อง'],
        'การชำระเงินและการเผยแพร่ประกาศ',
        ['4.1 เมื่อตรวจสอบข้อมูลถูกต้องแล้ว ท่านสามารถชําระเงินได้ทันที','4.2 หลังจากประกาศได้รับการอนุมัติจากเจ้าหน้าที่ จะได้รับการเผยแพร่ในเวลา 00:01 น. ของวันทําการถัดไป','4.3 หนังสือพิมพ์จะสามารถดาวน์โหลดได้วันที่เผยแพร่ประกาศ'],
      ],
    },
  ];
  
  export default function Steps() {
    return (
      <div className="flex flex-col space-y-20 p-20 text-black dark:text-white">
        {listAll.map(({ howTo, topic, steps }, index) => (
          <div key={index} className="flex flex-col">
            <h1 className="font-semibold text-2xl md:text-4xl">
              {howTo}
              <span className="text-secondary">{topic}</span>
            </h1>
            <div className="py-12">
              <ol className="list-decimal ml-6 md:text-xl space-y-2 md:space-y-4 font-medium">
                {steps.map((step, index) =>
                  Array.isArray(step) ? (
                    <ol key={index} className=" ml-6 space-y-2 md:space-y-4 font-normal">
                      {step.map((subStep, subIndex) => (
                        <li key={subIndex}>{subStep}</li>
                      ))}
                    </ol>
                  ) : (
                    <li key={index}>{step}</li>
                  ),
                )}
              </ol>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
function SchoolCard() {
    return (
        <div className="flex flex-col bg-neutral-100 p-[10px] gap-[10px] rounded-[10px]">
            <div className="flex gap-[10px]">
                <img alt="school_image" src="/public/logo192.png" className="w-6 h-6" />
                <p className="text-xl font-bold">โรงเรียนสาธิตมัธยม</p>
            </div>
            <p className="text-sm">รหัสโรงเรียน: 00000000001 (ตัวย่อ: AA109)</p>
        </div>
    );
}

export default SchoolCard;

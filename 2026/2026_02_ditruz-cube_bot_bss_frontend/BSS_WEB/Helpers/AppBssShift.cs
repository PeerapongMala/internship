using System.ComponentModel;

namespace BSS_WEB.Helpers
{
    public enum AppBssShift
    {
        [Description("เช้า")]
        [Category("SHIFT01")]
        Morning,
        [Description("บ่าย")]
        [Category("SHIFT02")]
        Afternoon,
        [Description("นอกเวลาทำการ")]
        [Category("SHIFT03")]
        Overtime,
        [Description("ทั้งวัน")]
        [Category("SHIFT04")]
        AllDay
    }
}

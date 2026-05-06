namespace BSS_API.Core.Helpers
{
    public static class BanknoteTypeHelper
    {
        public static string MapBnType(string? bnType) => bnType?.ToUpper() switch
        {
            "G" => "ธนบัตรดี",
            "B" => "ธนบัตรเสีย",
            "D" => "ธนบัตรทำลาย",
            "C" => "ธนบัตรปลอม",
            "L" => "ธนบัตรขาดจำนวน",
            "R" => "ธนบัตร Reject",
            "T" => "ธนบัตรชำรุด",
            "E" => "ธนบัตรเกินจำนวน",
            _ => bnType ?? "-"
        };
    }
}

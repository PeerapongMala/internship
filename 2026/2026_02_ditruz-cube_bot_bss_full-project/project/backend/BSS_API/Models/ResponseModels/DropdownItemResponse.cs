namespace BSS_API.Models.ResponseModels
{
    public class DropdownItemResponse
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public object? AdditionalData { get; set; } // ข้อมูลเพิ่มเติม (ถ้ามี)
    }
}

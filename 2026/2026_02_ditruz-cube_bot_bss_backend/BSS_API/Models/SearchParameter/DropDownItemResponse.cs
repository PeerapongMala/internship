namespace BSS_API.Models.SearchParameter
{
    public class DropDownItemResponse<T>
    {
        public long Key { get; set; }

        public dynamic? Value { get; set; }

        public string? Text { get; set; }

        public string? Code { get; set; }

        public T? RowData { get; set; }
    }
}
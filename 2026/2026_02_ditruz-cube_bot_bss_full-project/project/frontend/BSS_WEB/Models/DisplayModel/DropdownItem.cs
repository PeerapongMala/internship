namespace BSS_WEB.Models.DisplayModel
{
    public class DropdownItem
    {
        public int key { get; set; }
        public int value { get; set; }
        public string text { get; set; } = string.Empty;
        public object? rowData { get; set; }
    }
}

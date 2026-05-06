namespace BSS_WEB.Models.SearchModel
{
    public class SearchCondition
    {
        public string ColumnName { get; set; } = string.Empty;
        public string FilterOperator { get; set; } = string.Empty;
        public object? FilterValue { get; set; }
    }
}

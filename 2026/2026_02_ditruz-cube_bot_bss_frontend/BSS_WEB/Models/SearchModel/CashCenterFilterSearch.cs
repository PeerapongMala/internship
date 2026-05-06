namespace BSS_WEB.Models.SearchModel
{
    public class CashCenterFilterSearch :BaseFilterSearch
    {
        public string departmentFilter { get; set; } = string.Empty;
        public string institutionFilter { get; set; } = string.Empty;
    }
}

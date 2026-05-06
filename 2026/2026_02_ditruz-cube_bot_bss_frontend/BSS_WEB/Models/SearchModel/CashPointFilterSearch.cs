namespace BSS_WEB.Models.SearchModel
{
    public class CashPointFilterSearch : BaseFilterSearch
    {
        public string departmentFilter { get; set; } = string.Empty;
        public string institutionFilter { get; set; } = string.Empty;
    }
}

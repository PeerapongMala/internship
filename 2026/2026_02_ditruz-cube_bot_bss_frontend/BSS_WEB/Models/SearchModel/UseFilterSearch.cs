namespace BSS_WEB.Models.SearchModel
{
    public class UseFilterSearch : BaseFilterSearch
    {
        public string companyFilter { get; set; } = string.Empty;
        public string departmentFilter { get; set; } = string.Empty;
        public string roleFilter { get; set; } = string.Empty;
        
    }
}

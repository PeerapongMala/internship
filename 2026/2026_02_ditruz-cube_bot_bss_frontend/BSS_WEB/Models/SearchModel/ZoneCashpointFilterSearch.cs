namespace BSS_WEB.Models.SearchModel
{
    public class ZoneCashpointFilterSearch : BaseFilterSearch
    {
        public string cashpointFilter { get; set; } = string.Empty;   
        public string zoneFilter { get; set; } = string.Empty;
    }
}

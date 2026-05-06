namespace BSS_WEB.Views.Holding.HoldingNoDetail
{
    using Microsoft.AspNetCore.Mvc.RazorPages;

    public class IndexModel : PageModel
    {
        public string BnTypeName { get; set; } = string.Empty;
        public string CssVariantClass { get; set; } = "holding-unfit";
        public string BnTypeCode { get; set; } = string.Empty;
        public string Sorter { get; set; } = string.Empty;
        public string Reconciliator { get; set; } = string.Empty;
        public string SortingMachine { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public void OnGet()
        {
        }
    }
}

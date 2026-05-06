namespace BSS_WEB.Views.Verify.VerifyAutoSelling
{
    using Microsoft.AspNetCore.Mvc.RazorPages;

    public class IndexModel : PageModel
    {
        public string SortingMachine { get; set; } = string.Empty;
        public string Verifier { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public TimeSpan? ShiftStartTime { get; set; }
        public TimeSpan? ShiftEndTime { get; set; }
        public string BnTypeNameDisplay { get; set; } = string.Empty;
        public string BnTypeName { get; set; } = string.Empty;
        public string CssVariantClass { get; set; } = "verify-unfit";
        public string BnTypeCode { get; set; } = string.Empty;
        public void OnGet()
        {
        }
    }
}

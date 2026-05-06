namespace BSS_WEB.Views.Verify.VerifyConfirmation
{
    using Microsoft.AspNetCore.Mvc.RazorPages;

    public class IndexModel : PageModel
    {
        public string BnTypeName { get; set; } = string.Empty;
        public string CssVariantClass { get; set; } = "verify-unfit";
        public string BnTypeCode { get; set; } = string.Empty;
        public string Supervisor { get; set; } = string.Empty;
        public string SortingMachine { get; set; } = string.Empty;
        public void OnGet()
        {
        }
    }
}

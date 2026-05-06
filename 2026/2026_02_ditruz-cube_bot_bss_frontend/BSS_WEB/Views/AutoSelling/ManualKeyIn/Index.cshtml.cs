namespace BSS_WEB.Views.Verify.ManualKeyIn
{
    using Microsoft.AspNetCore.Mvc.RazorPages;

    public class IndexModel : PageModel
    {
        public string BnTypeNameDisplay { get; set; } = string.Empty;
        public string BnTypeName { get; set; } = string.Empty;
        public string CssVariantClass { get; set; } = "verify-unfit";
        public string BnTypeCode { get; set; } = string.Empty;
        public void OnGet()
        {
        }
    }
}

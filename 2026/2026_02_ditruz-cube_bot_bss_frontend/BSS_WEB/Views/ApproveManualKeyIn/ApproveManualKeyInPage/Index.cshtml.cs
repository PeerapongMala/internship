namespace BSS_WEB.Views.ApproveManualKeyIn.ApproveManualKeyInPage
{
    using Microsoft.AspNetCore.Mvc.RazorPages;

    public class IndexModel : PageModel
    {
        public string SortingMachine { get; set; } = string.Empty;
        public string Approver { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public string PageTitle { get; set; } = "Approve Manual Key-in";
        public string PageTitleThai { get; set; } = "อนุมัติการกรอกข้อมูลด้วยตนเอง";
        public string CssVariantClass { get; set; } = "approve-manual-key-in";

        public void OnGet()
        {
        }
    }
}

namespace BSS_WEB.Views.Preparation.PreparationUnfit
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.RazorPages;
    
    public class IndexModel : PageModel
    {
        public string SortingMachine { get; set; } = string.Empty;
        public string Preparator { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public TimeSpan? ShiftStartTime { get; set; }
        public TimeSpan? ShiftEndTime { get; set; }
        public int ConfigBssAlertShift { get; set; } = 0;
        public string BnTypeNameDisplay { get; set; } = string.Empty;
        public void OnGet()
        {
        }
    }
}

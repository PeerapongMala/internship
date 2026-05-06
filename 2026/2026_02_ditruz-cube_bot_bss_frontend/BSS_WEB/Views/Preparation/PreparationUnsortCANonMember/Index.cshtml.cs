using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BSS_WEB.Views.Preparation.PreparationUnsortCANonMember
{
    public class IndexModel : PageModel
    {
        public string SortingMachine { get; set; } = string.Empty;
        public string Preparator { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public TimeSpan? ShiftStartTime { get; set; }
        public TimeSpan? ShiftEndTime { get; set; }
        public int ConfigBssAlertShift { get; set; } = 0;
        public void OnGet()
        {
        }
    }
}

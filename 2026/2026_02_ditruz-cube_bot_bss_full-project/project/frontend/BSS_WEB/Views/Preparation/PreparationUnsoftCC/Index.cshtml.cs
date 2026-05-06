namespace BSS_WEB.Views.Preparation.PreparationUnsoftCC
{
     using Microsoft.AspNetCore.Mvc;
     using Microsoft.AspNetCore.Mvc.RazorPages;
     
     public class IndexModel : PageModel
     {
        public string SortingMachine { get; set; } = string.Empty;
        public string Preparator { get; set; } = string.Empty;
        public string ShiftName { get; set; } = string.Empty;
        public int companyId { get; set; }
        public int departmentId { get; set; }
        public TimeSpan? ShiftStartTime { get; set; }
        public TimeSpan? ShiftEndTime { get; set; }
        public int ConfigBssAlertShift { get; set; } = 0;
        public void OnGet() 
          {
          }
     }
}


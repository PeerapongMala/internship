using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BSS_WEB.Views.Main
{
    public class OperationSettingModel : PageModel
    {
        public string BssMessage { get; set; }
        public string IsPrepareCentral { get; set; }
        public void OnGet()
        {
           
        }
    }
}

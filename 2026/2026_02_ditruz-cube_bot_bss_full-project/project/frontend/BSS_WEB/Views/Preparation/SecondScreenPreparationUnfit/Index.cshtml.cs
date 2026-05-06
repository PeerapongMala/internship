using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BSS_WEB.Views.Preparation.DisplayTwoPreparation
{
    public class IndexModel : PageModel
    {
        public string CashpointDisplay { get; set; } = string.Empty;
        public string BankNameDisplay { get; set; } = string.Empty;
        public string DenoDisplay { get; set; } = string.Empty;
        public string ContainerDisplay { get; set; } = string.Empty;

        public void OnGet()
        {
        }
    }
}

using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class SaveOperationSettingRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string BanknoteTypeSelected { get; set; }

        [Required]
        public string OperationSelected { get; set; }

        [Required]
        public string MachineSelected { get; set; }

        public string? SorterSelected { get; set; }
        
    }
}

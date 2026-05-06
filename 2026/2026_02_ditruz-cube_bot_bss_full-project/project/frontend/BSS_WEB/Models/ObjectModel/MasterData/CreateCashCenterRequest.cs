using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateCashCenterRequest
    {
        
        public string cashCenterCode { get; set; } = string.Empty;
        public string cashCenterName { get; set; } = string.Empty;
        public int institutionId { get; set; } = 0;
        public int departmentId { get; set; } = 0;
        public bool isActive { get; set; } = false;
    }
}

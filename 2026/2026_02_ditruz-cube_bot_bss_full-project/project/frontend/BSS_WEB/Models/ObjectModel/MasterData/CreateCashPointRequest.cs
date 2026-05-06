using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateCashPointRequest
    {
      
        public int institutionId { get; set; }= 0;
        public int departmentId { get; set; } = 0;
     
        public string cashpointName { get; set; } = string.Empty;
        public string branchCode { get; set; } = string.Empty;

        public string cbBcdCode { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
        
    }
}

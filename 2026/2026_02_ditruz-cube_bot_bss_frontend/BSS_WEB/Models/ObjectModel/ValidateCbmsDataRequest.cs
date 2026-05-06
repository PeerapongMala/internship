using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class ValidateCbmsDataRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required, MaxLength(20)]
        public string ContainerId { get; set; } = string.Empty;


        [Required, MaxLength(20)]
        public string BarCode { get; set; } = string.Empty;


        [Required]
        public DateTime SendDateFrom { get; set; }

        [Required]
        public DateTime SendDateTo { get; set; }


        [Required]
        public int CompanyId { get; set; }


        [Required, MaxLength(20)]
        public string ValidateType { get; set; } = CbmsValidateType.CaMember;


        [Required, MaxLength(3)]
        public string BnTypeInput { get; set; } = "A";

        public int MachineId { get; set; }
    }
    public class ValidateCbmsDataFrontRequest
    {
       
        [Required, MaxLength(20)]
        public string ContainerId { get; set; } = string.Empty;
 
         
    }
    public static class CbmsValidateType
    {
        public const string CaMember = "CA_MEMBER";
        public const string CaNonMember = "CA_NON_MEMBER";
    }
}

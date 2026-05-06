using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterInstitutionViewData
    {
        public int InstitutionId { get; set; }
        public string InstitutionCode { get; set; }
        public string BankCode { get; set; }
        public string InstitutionShortName { get; set; }
        public string InstitutionNameTh { get; set; }
        public string? InstitutionNameEn { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}

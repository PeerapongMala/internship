using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterCashCenterViewData
    {
        public int CashCenterId { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }

        public int InstitutionId { get; set; }

        public string InstitutionNameTh { get; set; }

        public string? InstitutionNameEn { get; set; }

        public string CashCenterCode { get; set; }

        public string CashCenterName { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

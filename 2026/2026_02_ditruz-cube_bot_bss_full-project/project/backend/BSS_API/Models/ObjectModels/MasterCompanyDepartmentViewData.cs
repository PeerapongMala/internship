using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterCompanyDepartmentViewData
    {
        public int ComdeptId { get; set; }

        public int CompanyId { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }

        public int DepartmentId { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentShortName { get; set; }
        public string DepartmentName { get; set; }

        public string CbBcdCode { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;

        public DateTime EndDate { get; set; } = DateTime.Now;

        public bool IsSendUnsortCC { get; set; }

        public bool IsPrepareCentral { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

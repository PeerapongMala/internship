using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterZoneViewData
    {
        public int ZoneId { get; set; }

        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; } 


        public int? InstId { get; set; }
        public string InstitutionNameTh { get; set; }
        public string InstitutionNameEn { get; set; }

        public string ZoneCode { get; set; }

        public string ZoneName { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; } 
        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string? CbBcdCode { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterMachineViewData
    {
        public int MachineId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int MachineTypeId { get; set; }
        public string MachineTypeName { get; set; }
        public string MachineCode { get; set; }
        public string MachineName { get; set; }
        public int? HcLength { get; set; }
        public string? PathnameBss { get; set; }
        public bool? IsEmergency { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? PathnameCompleted { get; set; }
        public string? PathnameError { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterRoleViewData
    {
        public int RoleGroupId { get; set; }
        public string RoleGroupName { get; set; }
        public int RoleId { get; set; }
        public string RoleCode { get; set; }

        public string? RoleName { get; set; }

        public string? RoleDescription { get; set; }

        public int? SeqNo { get; set; }

        public bool? IsGetOtpSupervisor { get; set; }

        public bool? IsGetOtpManager { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

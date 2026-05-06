using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterUserViewData
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? UsernameDisplay { get; set; }
        public string? UserEmail { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public bool? IsInternal { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int DepartmentId { get; set; }
        public string  DepartmentName { get; set; }
        public int  RoleGroupId { get; set; }
        public string RoleGroupName { get; set; } 

          
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }


       

    }
}

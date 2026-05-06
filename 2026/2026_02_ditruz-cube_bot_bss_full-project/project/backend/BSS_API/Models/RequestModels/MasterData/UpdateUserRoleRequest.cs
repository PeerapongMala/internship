using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateUserRoleRequest
    {
        public int UserRoleId { get; set; }

        public int UserId { get; set; }

        public int RoleGroupId { get; set; }

        public DateTime AssignedDateTime { get; set; } = DateTime.Now;

        public bool? IsActive { get; set; }
         
    }
}

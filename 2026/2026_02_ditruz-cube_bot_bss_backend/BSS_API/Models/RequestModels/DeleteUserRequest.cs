using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class DeleteUserRequest
    {
        [Required]
        public int UserId { get; set; }

        //[Required]
        //public int DepartmentId { get; set; }

        //[Required]
        //public int RoleGroupId { get; set; }

        //[Required]
        //public int UpdatedBy { get; set; }
    }
}

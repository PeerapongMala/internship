using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateUserRequest
    {

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [MaxLength(30)]
        public string UsernameDisplay { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserEmail { get; set; }

        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public string RoleGroupIdList { get; set; }
    }
}

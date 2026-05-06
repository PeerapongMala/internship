using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateRoleRequest:CreateRoleRequest
    {
        public int roleId { get; set; } = 0;
       
    }
}

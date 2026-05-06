using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateRoleGroupRequest:CreateRoleGroupRequest
    {
        public int roleGroupId { get; set; } = 0;
         

    }
}

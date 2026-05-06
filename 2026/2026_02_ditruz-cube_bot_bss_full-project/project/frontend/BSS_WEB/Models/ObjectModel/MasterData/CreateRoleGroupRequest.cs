using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateRoleGroupRequest
    {
        public string roleGroupCode { get; set; } = string.Empty;
        public string roleGroupName { get; set; } = string.Empty;
        public bool isActive { get; set; } = false; 

    }
}

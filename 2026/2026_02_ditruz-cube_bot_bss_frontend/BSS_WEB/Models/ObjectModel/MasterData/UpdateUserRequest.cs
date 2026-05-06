using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateUserRequest:CreateUserRequest
    {
        public int userId { get; set; } = 0;
        
    }
}

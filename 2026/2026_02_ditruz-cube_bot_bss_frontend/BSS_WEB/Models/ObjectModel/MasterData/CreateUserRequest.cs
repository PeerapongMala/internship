using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateUserRequest
    {
        public string userName { get; set; }
        public string usernameDisplay { get; set; }

        public string userEmail { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public DateTime startDate { get; set; }

        public DateTime endDate { get; set; }

        public bool isActive { get; set; }
 

        public int departmentId { get; set; }

        public int roleGroupId  { get; set; }
    }
}


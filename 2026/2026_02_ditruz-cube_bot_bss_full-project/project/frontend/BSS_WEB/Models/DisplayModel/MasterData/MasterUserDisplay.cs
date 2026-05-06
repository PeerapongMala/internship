
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterUserDisplay
    {
        [Display(Name = "User Id")]
        public int userId { get; set; }

        [Display(Name = "User Name")]
        public string userName { get; set; }

        [Display(Name = "Username Display")]
        public string usernameDisplay { get; set; }

        [Display(Name = "User Email")]
        public string userEmail { get; set; }

        [Display(Name = "First Name")]
        public string? firstName { get; set; }

        [Display(Name = "Last Name")]
        public string? lastName { get; set; }

        [Display(Name = "Is Internal")]
        public bool? isInternal { get; set; }

        [Display(Name = "Is Active")]
        public bool isActive { get; set; }

        [Display(Name = "Create By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }

        [Display(Name = "Role Group Id")]
        public int  roleGroupId { get; set; }

        [Display(Name = "Role Group Name")]
        public string? roleGroupName { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

        [Display(Name = "Department Name")]
        public string? departmentName { get; set; }

        [Display(Name = "Company Id")]
        public int companyId { get; set; }

        [Display(Name = "Company Name")]
        public string? companyName { get; set; }

        [Display(Name = "Start Date")]
        public DateTime? startDate { get; set; }

        [Display(Name = "End Date")]
        public DateTime? endDate { get; set; }


      
    }
}

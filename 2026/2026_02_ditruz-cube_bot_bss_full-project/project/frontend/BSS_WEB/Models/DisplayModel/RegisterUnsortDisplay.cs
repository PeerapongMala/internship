using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class RegisterUnsortDisplay
    {
        [Display(Name = "Register Unsort Id")]
        public long registerUnsortId { get; set; }

        [Display(Name = "Container Code")]
        public string containerCode { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

        [Display(Name = "Status Id")]
        public int statusId { get; set; }

        [Display(Name = "Supervisor Received")]
        public int? supervisorReceived { get; set; }

        [Display(Name = "Received Date")]
        public DateTime receivedDate { get; set; }

        [Display(Name = "Remark")]
        public string remark { get; set; }

        [Display(Name = "reated By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }

        [Display(Name = "Department Name")]
        public string departmentName { get; set; }

        [Display(Name = "Status Name Th")]
        public string statusNameTh { get; set; }

        [Display(Name = "Status Code")]
        public string statusCode { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterDepartmentDisplay: MasterCommonData
    {
        [Display(Name = "Department Id")]
        public int? departmentId { get; set; }

        [Display(Name = "Department Code")]        
        public string? departmentCode { get; set; }

        [Display(Name = "Short Name")]       
        public string? departmentShortName { get; set; }

        [Display(Name = "Department Name")]       
        public string? departmentName { get; set; } 
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterZoneCashpointDisplay 
    { 
        [Display(Name = "Zone Cashpoint Id")]
        public int ZoneCashpointId { get; set; }

        [Display(Name = "Zone Id")]
        public int ZoneId { get; set; }

        [Display(Name = "Cashpoint Id")]
        public int CashpointId { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

        [Display(Name = "Created By")]
        public int? CreatedBy { get; set; }

        [Column("Created Date")]
        public DateTime CreatedDate { get; set; }

        [Display(Name = "Updated By")]
        public int? UpdatedBy { get; set; }

        [Display(Name = "Updated Date")]
        public DateTime? UpdatedDate { get; set; }

        [Display(Name = "Cash Point Name")]
       
        public string CashpointName { get; set; }

        [Display(Name = "Zone Name")]       
        public string ZoneName { get; set; }
        [Display(Name = "Zone Code")]
        public string ZoneCode { get; set; }
    }
}

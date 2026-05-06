using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateMasterZoneRequest
    {
        [Required]
        public int ZoneId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

      
        public int? InstId { get; set; }

        [Required]
        [MaxLength(5)]
        public string ZoneCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string ZoneName { get; set; }

        public bool? IsActive { get; set; }
 

    }
}

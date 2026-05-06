using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class UpdateCompanyRequest
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(10)]
        public string CompanyCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string CompanyName { get; set; }

        public bool? IsActive { get; set; }
         

        public DateTime? UpdatedDate { get; set; }
    }
}

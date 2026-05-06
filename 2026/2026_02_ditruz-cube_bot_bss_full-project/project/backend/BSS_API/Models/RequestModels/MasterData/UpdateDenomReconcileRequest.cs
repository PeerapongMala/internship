using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateDenomReconcileRequest
    {
        [Required]
        public int DenomReconcileId { get; set; }
        [Required]
        public int DenoId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int SeriesDenomId { get; set; }

        public int? SeqNo { get; set; }

        public bool? IsDefault { get; set; }

        public bool? IsDisplay { get; set; }

        public bool? IsActive { get; set; }
         
    }
}

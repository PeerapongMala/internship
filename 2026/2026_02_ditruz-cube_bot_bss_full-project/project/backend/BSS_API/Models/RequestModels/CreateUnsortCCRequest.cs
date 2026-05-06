using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateUnsortCCRequest
    {
        public long RegisterUnsortId { get; set; }

        [Required]
        public int InstId { get; set; }

        [Required]
        public int DenoId { get; set; }

        public int BanknoteType { get; set; }

        [Required]
        public int BanknoteQty { get; set; }

        public int RemainingQty { get; set; }

        public bool IsActive { get; set; }

        public int CreatedBy { get; set; }
    }
}

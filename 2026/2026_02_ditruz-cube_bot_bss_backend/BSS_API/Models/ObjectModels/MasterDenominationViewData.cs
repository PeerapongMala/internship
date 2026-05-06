using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterDenominationViewData
    {
        public int DenominationId { get; set; }
        public int DenominationCode { get; set; }
        public int DenominationPrice { get; set; }
        public string? DenominationDesc { get; set; }
        public string DenominationCurrency { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}

namespace BSS_API.Models.ObjectModels
{
    public class MasterMSevenDenomViewData
    {
      
        public int M7DenomId { get; set; }

        public int DenoId { get; set; }

        public int DenominationCode { get; set; }
        public string DenominationDesc { get; set; }
        public int DenominationPrice { get; set; }
        public int SeriesDenomId { get; set; }
        public string SeriesDenomCode { get; set; }
        public string SeriesDenomDesc { get; set; }
        public string M7DenomCode { get; set; }

        public string M7DenomName { get; set; }

        public string M7DenomDescrpt { get; set; }

        public string M7DenomBms { get; set; }

        public string? M7DnBms { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

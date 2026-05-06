namespace BSS_API.Models.ObjectModels
{
    public class MasterDenomReconcileViewData
    {

        public int DenomReconcileId { get; set; }

        public int DenoId { get; set; }

        public int?  DenominationCode { get; set; }
        public string? DenominationDesc { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }

        public int SeriesDenomId { get; set; }
        public string SeriesCode { get; set; }

        public string SerieDescrpt { get; set; }

        public int? SeqNo { get; set; }

        public bool? IsDefault { get; set; }

        public bool? IsDisplay { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

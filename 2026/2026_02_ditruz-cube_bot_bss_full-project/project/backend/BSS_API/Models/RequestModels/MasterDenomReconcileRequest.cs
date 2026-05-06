namespace BSS_API.Models.RequestModels
{
    public class MasterDenomReconcileRequest
    {
        public int? DenomReconcileId { get; set; }
        public int? DenoId { get; set; }
        public int? DepartmentId { get; set; }
        public int? SeriesDenomId { get; set; }
        public int? SeqNo { get; set; }

        public bool? IsDefault { get; set; }
        public bool? IsDisplay { get; set; }
        public bool? IsActive { get; set; }
    }
}

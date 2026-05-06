namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class PreparationUnsortCaNonMemberResult
    {
        public long PrepareId { get; set; }

        public string? HeaderCardCode { get; set; }

        public string? BankCode { get; set; }

        public string? CashCenterName { get; set; }

        public int? DenominationPrice { get; set; }

        public string? ContainerCode { get; set; }

        public DateTime PrepareDate { get; set; }

        public int? CreatedBy { get; set; }

        public string? CreatedByName { get; set; }

        public string? UpdatedByName { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool? IsFlag { get; set; } = true;

        public int? ZoneId { get; set; }
        public string? ZoneName { get; set; }

    }
}

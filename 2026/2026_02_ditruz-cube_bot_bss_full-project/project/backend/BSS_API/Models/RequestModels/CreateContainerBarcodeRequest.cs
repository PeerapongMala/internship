namespace BSS_API.Models.RequestModels
{
    using System.ComponentModel.DataAnnotations;

    public class CreateContainerBarcodeRequest
    {
        public long? ReceiveId { get; set; }

        [Required] public int DepartmentId { get; set; }

        public int? MachineId { get; set; }

        public int? CompanyId { get; set; }

        public long? UnSortCcId { get; set; } = 0;

        [Required(AllowEmptyStrings = false)] public string ContainerCode { get; set; }

        public string? PackageCode { get; set; }

        public string? BundleCode { get; set; }

        [Required(AllowEmptyStrings = false)] public string HeaderCardCode { get; set; }

        /// <summary>
        /// primary ของธนาคาร
        /// </summary>
        [Required]
        public int InstitutionId { get; set; }

        /// <summary>
        /// primary ศูนย์เงินสด
        /// </summary>
        public int? CashCenterId { get; set; } = null;

        /// <summary>
        /// primary zone
        /// </summary>
        public int? ZoneId { get; set; } = null;

        /// <summary>
        /// primary สาขา
        /// </summary>
        public int? CashPointId { get; set; } = null;

        /// <summary>
        /// primary ชนิดราคา
        /// </summary>
        [Required]
        public int DenominationId { get; set; }

        [Required] public int CreatedBy { get; set; }

        public int? UpdatedBy { get; set; }

        #region IsFirstScan

        public bool isFirstScan { get; set; } = true;

        #endregion IsFirstScan
    }
}
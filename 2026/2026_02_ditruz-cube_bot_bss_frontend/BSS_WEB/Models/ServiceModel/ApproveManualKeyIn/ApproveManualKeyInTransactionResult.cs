namespace BSS_WEB.Models.ServiceModel.ApproveManualKeyIn
{
    public class ApproveManualKeyInTransactionResult
    {
        public long ApproveManualKeyInTranId { get; set; }
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }
        public int DepartmentId { get; set; }
        public int MachineHdId { get; set; }
        public string? MachineName { get; set; }
<<<<<<< HEAD
=======
        public string? PackageCode { get; set; }
        public string? BundleCode { get; set; }
        public string? BankName { get; set; }
        public string? ZoneName { get; set; }
        public string? CashpointName { get; set; }
        public string? BnTypeName { get; set; }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        public int? DenominationPrice { get; set; }
        public string? StatusCode { get; set; }
        public string? StatusNameTh { get; set; }
        public string? StatusNameEn { get; set; }
        public int StatusId { get; set; }
        public int? M7Qty { get; set; }
        public int? ManualKeyInQty { get; set; }
        public int? SupQty { get; set; }
        public int? BundleNumber { get; set; }
        public int? TotalValue { get; set; }
        public bool? IsWarning { get; set; }
        public bool? IsNotMatch { get; set; }
        public string? Remark { get; set; }
        public string? AlertRemark { get; set; }
        public string? ReferenceCode { get; set; }
        public int? SorterId { get; set; }
        public string? SorterName { get; set; }
        public int ShiftId { get; set; }
        public string? ShiftName { get; set; }
        public DateTime? PrepareDate { get; set; }
<<<<<<< HEAD
=======
        public DateTime? ManualDate { get; set; }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public string? UpdatedByName { get; set; }
    }
}

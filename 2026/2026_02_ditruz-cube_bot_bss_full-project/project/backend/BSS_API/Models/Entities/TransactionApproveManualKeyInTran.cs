namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_approve_manual_key_in_tran")]
    public class TransactionApproveManualKeyInTran
    {
        public TransactionApproveManualKeyInTran()
        {
            TransactionApproveManualKeyIn = new HashSet<TransactionApproveManualKeyIn>();
        }

        [Key, Column("approve_manual_key_in_tran_id")] public long ApproveManualKeyInTranId { get; set; }

        #region Department

        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment? MasterDepartment { get; set; }

        #endregion Department

        #region TransactionPreapre

        [Column("prepare_id")]
        [ForeignKey("TransactionPreparation")]
        public long PrepareId { get; set; }

        public TransactionPreparation? TransactionPreparation { get; set; }

        #endregion TransactionPreapre

        #region Machine

        [Column("machine_hd_id")]
        [ForeignKey("MasterMachine")]
        public int MachineHdId { get; set; }

        public MasterMachine? MasterMachine { get; set; }

        #endregion Machine

        [Column("header_card_code")] public string? HeaderCardCode { get; set; }

        [Column("header_parent_id")] public long? HeaderParentId { get; set; }

        [Column("m7_qty")] public int? M7Qty { get; set; }

        [Column("manual_key_in_qty")] public int? ManualKeyInQty { get; set; }

        [Column("sup_qty")] public int? SupQty { get; set; }

        [Column("bundle_num")] public int? BundleNumber { get; set; }

        [Column("total_value")] public int? TotalValue { get; set; }

        #region Status

        [Column("status_id")]
        [ForeignKey("MasterStatus")]
        public int StatusId { get; set; }

        public MasterStatus? MasterStatus { get; set; }

        #endregion Status

        [Column("approve_by")] public int? ApproveBy { get; set; }

        [Column("approve_date")] public DateTime? ApproveDate { get; set; }

        [Column("reference_code")] public string? ReferenceCode { get; set; }

        [Column("sorter_id")] public int? SorterId { get; set; }

        #region Shift

        [Column("shift_id"), ForeignKey("MasterShift")]
        public int ShiftId { get; set; }

        public MasterShift? MasterShift { get; set; }

        #endregion Shift

        [Column("remark")] public string? Remark { get; set; }

        [Column("alert_remark")] public string? AlertRemark { get; set; }

        [Column("is_display")] public bool? IsDisplay { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("is_revoke")] public bool? IsRevoke { get; set; }

        [Column("count_manual_key_in")] public int? CountManualKeyIn { get; set; }

        [Column("is_warning")] public bool? IsWarning { get; set; }

        [Column("is_not_approved")] public bool? IsNotApproved { get; set; }

        [Column("created_by")] public int CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionApproveManualKeyIn>? TransactionApproveManualKeyIn { get; set; }
    }
}

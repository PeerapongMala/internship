namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_reconcile")]
    public class TransactionReconcile
    {
        [Key, Column("reconcile_id")] public long ReconcileId { get; set; }

        #region TransactionReconcileTran

        [Column("reconcile_tran_id")]
        [ForeignKey("TransactionReconcileTran")]
        public long ReconcileTranId { get; set; }

        public TransactionReconcileTran? TransactionReconcileTran { get; set; }

        #endregion TransactionReconcileTran

        [Column("bn_type")] public string BnType { get; set; }

        [Column("denom_series")] public string DenomSeries { get; set; }

        [Column("qty")] public int Qty { get; set; }

        [Column("total_value")] public int TotalValue { get; set; }

        [Column("is_replace_t")] public bool? IsReplaceT { get; set; }

        [Column("is_replace_c")] public bool? IsReplaceC { get; set; }

        [Column("adjust_type")] public string AdjustType { get; set; }

        [Column("is_normal")] public bool? IsNormal { get; set; }

        [Column("is_addon")] public bool? IsAddOn { get; set; }

        [Column("is_endjam")] public bool? IsEndJam { get; set; }

        [Column("adjust_date")] public DateTime? AdjustDate { get; set; }

        [Column("manual_by")] public int? ManualBy { get; set; }

        [Column("manual_date")] public DateTime? ManualDate { get; set; }

        [Column("verify_by")] public int? VerifyBy { get; set; }

        [Column("verify_date")] public DateTime? VerifyDate { get; set; }

        [Column("is_send_cbms")] public bool? IsSendCbms { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}
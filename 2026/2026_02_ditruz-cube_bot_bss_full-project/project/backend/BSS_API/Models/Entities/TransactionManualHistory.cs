namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_manual_history")]
    public class TransactionManualHistory
    {
        [Key, Column("manual_his_id")] public long ManualHisId { get; set; }

        [Column("reconcile_id")]
        [ForeignKey("TransactionReconcile")]
        public long ReconcileId { get; set; }

        public TransactionReconcile? TransactionReconcile { get; set; }

        [Column("old_deno_price")] public int OldDenoPrice { get; set; }

        [Column("new_deno_price")] public int NewDenoPrice { get; set; }

        [Column("old_bn_type")] public string OldBnType { get; set; } = string.Empty;

        [Column("new_bn_type")] public string NewBnType { get; set; } = string.Empty;

        [Column("old_denom_series")] public string OldDenomSeries { get; set; } = string.Empty;

        [Column("new_denom_series")] public string NewDenomSeries { get; set; } = string.Empty;

        [Column("old_qty")] public int OldQty { get; set; }

        [Column("new_qty")] public int NewQty { get; set; }

        [Column("old_value")] public int OldValue { get; set; }

        [Column("new_value")] public int NewValue { get; set; }

        [Column("sup_action")] public string SupAction { get; set; } = string.Empty;

        [Column("manager_id")] public int? ManagerId { get; set; }

        [Column("officer_id")] public int? OfficerId { get; set; }

        [Column("is_manual_key")] public bool? IsManualKey { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}

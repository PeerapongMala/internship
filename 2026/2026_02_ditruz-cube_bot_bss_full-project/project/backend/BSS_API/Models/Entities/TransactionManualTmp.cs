namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_manual_tmp")]
    public class TransactionManualTmp
    {
        [Key, Column("manual_tmp_id")] public long ManualTmpId { get; set; }

        [Column("reconcile_tran_id")]
        [ForeignKey("TransactionReconcileTran")]
        public long ReconcileTranId { get; set; }

        public TransactionReconcileTran? TransactionReconcileTran { get; set; }

        [Column("reconcile_id")]
        [ForeignKey("TransactionReconcile")]
        public long? ReconcileId { get; set; }

        public TransactionReconcile? TransactionReconcile { get; set; }

        [Column("deno_price")] public int DenoPrice { get; set; }

        [Column("bn_type")] public string BnType { get; set; } = string.Empty;

        [Column("denom_series")] public string DenomSeries { get; set; } = string.Empty;

        [Column("tmp_qty")] public int TmpQty { get; set; }

        [Column("tmp_value")] public int TmpValue { get; set; }

        [Column("tmp_action")] public string TmpAction { get; set; } = string.Empty;

        [Column("manual_date")] public DateTime ManualDate { get; set; }
    }
}

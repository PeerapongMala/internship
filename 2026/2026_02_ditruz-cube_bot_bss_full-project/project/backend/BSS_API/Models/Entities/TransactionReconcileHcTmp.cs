namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_reconcile_hc_tmp")]
    public class TransactionReconcileHcTmp
    {
        [Key, Column("reconcile_tmp_hc_id")] public long ReconcileTmpHcId { get; set; }

        #region TransactionReconcileTran

        [Column("reconcile_tran_id")]
        [ForeignKey("TransactionReconcileTran")]
        public long ReconcileTranId { get; set; }

        public TransactionReconcileTran? TransactionReconcileTran { get; set; }

        #endregion TransactionReconcileTran

        [Column("header_card_code")] public string HeaderCardCode { get; set; }

        [Column("bn_type")] public string BnType { get; set; }

        [Column("denom_series")] public string DenomSeries { get; set; }

        [Column("deno_price")] public int DenoPrice { get; set; }

        [Column("tmp_qty")] public int TmpQty { get; set; }

        [Column("tmp_value")] public int TmpValue { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("update_date")] public DateTime UpdateDate { get; set; }
    }
}

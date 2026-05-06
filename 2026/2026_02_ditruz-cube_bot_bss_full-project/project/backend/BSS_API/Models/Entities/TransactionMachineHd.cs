namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_machine_hd")]
    public class TransactionMachineHd
    {
        public TransactionMachineHd()
        {
            TransactionMachineHdDatas = new HashSet<TransactionMachineHdData>();
        }

        [Key, Column("machine_hd_id")] public long MachineHdId { get; set; }

        #region SourceFile

        [Column("source_file_id")]
        [ForeignKey("TransactionSourceFile")]
        public long? SourceFileId { get; set; }

        public TransactionSourceFile? TransactionSourceFile { get; set; }

        #endregion SourceFile

        [Column("department_id")] public int DepartmentId { get; set; }

        #region Machine

        [Column("machine_id")]
        [ForeignKey("MasterMachine")]
        public int? MachineId { get; set; }

        public MasterMachine? MasterMachine { get; set; }

        #endregion Machine

        [Column("header_card_code"), MaxLength(15)] public string HeaderCardCode { get; set; } = string.Empty;

        [Column("start_time")] public DateTime StartTime { get; set; }

        [Column("end_time")] public DateTime EndTime { get; set; }

        [Column("deposit_id"), MaxLength(15)] public string? DepositId { get; set; }

        [Column("is_reject"), MaxLength(5)] public string? IsReject { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("seq_no")] public int? SeqNo { get; set; }

        [Column("remark")] public string? Remark { get; set; }

        [Column("machine_qty")] public int? MachineQty { get; set; }

        [Column("is_error")] public bool? IsError { get; set; }

        [Column("deno_id")] public int? DenoId { get; set; }

        [Column("is_reconciled")] public bool? IsReconciled { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        [Column("is_match_prepare")] public bool? IsMatchPrepare { get; set; }

        [Column("is_duplicated")] public bool? IsDuplicated { get; set; }

        public ICollection<TransactionMachineHdData>? TransactionMachineHdDatas { get; set; }
    }
}

namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_source_file")]
    public class TransactionSourceFile
    {
        public TransactionSourceFile()
        {
            TransactionMachineHds = new HashSet<TransactionMachineHd>();
        }

        [Key, Column("source_file_id")] public long SourceFileId { get; set; }

        #region Machine

        [Column("machine_id")]
        [ForeignKey("MasterMachine")]
        public int MachineId { get; set; }

        public MasterMachine? MasterMachine { get; set; }

        #endregion Machine

        [Column("file_name"), MaxLength(150)] public string FileName { get; set; } = string.Empty;

        [Column("is_error")] public bool? IsError { get; set; }

        [Column("remark"), MaxLength(300)] public string? Remark { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionMachineHd>? TransactionMachineHds { get; set; }
    }
}

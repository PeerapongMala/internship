namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_container_prepare")]
    public class TransactionContainerPrepare
    {
        public TransactionContainerPrepare()
        {
            TransactionPreparation = new HashSet<TransactionPreparation>();
        }

        [Key]
        [Required]
        [Column("container_prepare_id")]
        public long ContainerPrepareId { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]

        public int DepartmentId { get; set; }

        public MasterDepartment MasterDepartment { get; set; }

        [Column("machine_id")]
        [ForeignKey("MasterMachine")]

        public int? MachineId { get; set; }

        public MasterMachine MasterMachine { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("container_code")]
        public string ContainerCode { get; set; }

        [Column("receive_id")]
        [ForeignKey("ReceiveCbmsDataTransaction")]
        public long? ReceiveId { get; set; }

        public ReceiveCbmsDataTransaction ReceiveCbmsDataTransaction { get; set; }

        [Required]
        [Column("bntype_id")]
        [ForeignKey("MasterBanknoteType")]

        public int BntypeId { get; set; }

        public MasterBanknoteType MasterBanknoteType { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionPreparation> TransactionPreparation { get; set; }
    }
}
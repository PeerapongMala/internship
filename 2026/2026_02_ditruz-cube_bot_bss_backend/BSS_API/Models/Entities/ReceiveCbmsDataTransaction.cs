namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_receive_cbms_data")]
    public class ReceiveCbmsDataTransaction
    {
        public ReceiveCbmsDataTransaction()
        {
            TransactionContainerPrepares = new HashSet<TransactionContainerPrepare>();
        }

        [Key]
        [Required]
        [Column("receive_id")]
        public long ReceiveId { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment MasterDepartment { get; set; }

        [Required]
        [MaxLength(3)]
        [Column("bn_type_input")]
        public string BnTypeInput { get; set; }

        [MaxLength(20)] [Column("barcode")] public string? BarCode { get; set; }

        [MaxLength(20)]
        [Column("container_id")]
        public string? ContainerId { get; set; }

        [Column("send_date")] public DateTime? SendDate { get; set; }

        [Required]
        [Column("inst_id")]
        [ForeignKey("MasterInstitution")]
        public int InstitutionId { get; set; }

        public MasterInstitution MasterInstitution { get; set; }


        [Required]
        [Column("deno_id")]
        [ForeignKey("MasterDenomination")]
        public int DenominationId { get; set; }

        public MasterDenomination MasterDenomination { get; set; }

        [Column("qty")] public int? Qty { get; set; }


        [Column("remaining_qty")] public int? RemainingQty { get; set; }

        [Column("unfit_qty")] public int? UnfitQty { get; set; }

        [MaxLength(5)] [Column("cb_bdc_code")] public string? CbBdcCode { get; set; }

        [Column("created_by")] public string? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [MaxLength(20)] [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<TransactionContainerPrepare> TransactionContainerPrepares { get; set; }
    }
}
namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_prepare")]
    public class TransactionPreparation
    {
        [Key]
        [Required]
        [Column("prepare_id")]
        public long PrepareId { get; set; }

        [Required]
        [Column("container_prepare_id")]
        [ForeignKey("TransactionContainerPrepare")]
        public long ContainerPrepareId { get; set; }

        public TransactionContainerPrepare TransactionContainerPrepare { get; set; }

        [Required]
        [Column("header_card_code")]
        [MaxLength(15)]
        public string HeaderCardCode { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("package_code")]
        public string PackageCode { get; set; }

        [Required]
        [Column("bundle_code")]
        [MaxLength(30)]
        public string BundleCode { get; set; }

        [Column("unsort_cc_id")]
        [ForeignKey("TransactionUnsortCC")]
        public long? TransactionUnsortCCId { get; set; }

        public TransactionUnsortCC? TransactionUnsortCC { get; set; }

        [Required]
        [Column("inst_id")]
        [ForeignKey("MasterInstitution")]
        public int InstId { get; set; }

        public MasterInstitution MasterInstitution { get; set; }

        [Column("cashcenter_id")]
        [ForeignKey("MasterCashCenter")]
        public int? CashcenterId { get; set; }

        public MasterCashCenter MasterCashCenter { get; set; }

        [Column("zone_id")]
        [ForeignKey("MasterZone")]
        public int? ZoneId { get; set; }

        public MasterZone? MasterZone { get; set; }

        [Column("cashpoint_id")]
        [ForeignKey("MasterCashPoint")]

        public int? CashpointId { get; set; }

        public MasterCashPoint MasterCashPoint { get; set; }

        [Required]
        [Column("deno_id")]
        [ForeignKey("MasterDenomination")]

        public int DenoId { get; set; }

        public MasterDenomination MasterDenomination { get; set; }

        [Required] [Column("qty")] public int Qty { get; set; }

        [Column("remark")] [MaxLength(300)] public string? Remark { get; set; }

        [Required]
        [Column("status_id")]
        [ForeignKey("MasterStatus")]

        public int StatusId { get; set; }

        public MasterStatus MasterStatus { get; set; }

        [Required] [Column("prepare_date")] public DateTime PrepareDate { get; set; }

        [Column("is_reconcile")] public bool? IsReconcile { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        [Column("is_match_machine")] public bool? IsMatchMachine { get; set; }

        public MasterUser? CreatedByUser { get; set; }
        public MasterUser? UpdatedByUser { get; set; }

        public TransactionReconcileTran? TransactionReconcileTran { get; set; }
    }
}
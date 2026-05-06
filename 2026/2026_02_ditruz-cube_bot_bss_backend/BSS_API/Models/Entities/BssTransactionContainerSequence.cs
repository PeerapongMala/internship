namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_container_seq")]
    public class BssTransactionContainerSequence
    {
        [Key, Column("container_seq_id")] public int ContainerSequenceId { get; set; }

        [Column("department_id")] public int DepartmentId { get; set; }

        [Column("inst_id")] public int InstitutionId { get; set; }

        [Column("cashcenter_id")] public int? CashCenterId { get; set; }

        [Column("zone_id")] public int? ZoneId { get; set; }

        [Column("cashpoint_id")] public int? CashPointId { get; set; }

        [Column("deno_id")] public int DenominationId { get; set; }

        [Column("container_type")] public string ContainerType { get; set; }

        [Column("seq_no")] public int? SequenceNo { get; set; }

        [Column("total_bundle")] public int? TotalBundle { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime? CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}
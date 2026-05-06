namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_send_unsort_seq")]
    public class MasterSendUnsortSequence
    {
        [Key] [Column("send_seq_id")] public int SendSequenceId { get; set; }

        [Column("department_id")] public int DepartmentId { get; set; }

        [Column("send_seq_no")] public int SendSequenceNumber { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}
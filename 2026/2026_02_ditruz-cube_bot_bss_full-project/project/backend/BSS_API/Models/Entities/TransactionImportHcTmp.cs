namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_import_hc_tmp")]
    public class TransactionImportHcTmp
    {
        [Key, Column("import_hc_tmp_id")] public int ImportHcTmpId { get; set; }

        [Column("department_id")] public int DepartmentId { get; set; }

        [Column("machine_id")] public int MachineId { get; set; }

        [Column("machine_hd_id")] public long MachineHdId { get; set; }

        [Column("header_card_code"), MaxLength(15)] public string HeaderCardCode { get; set; } = string.Empty;

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}

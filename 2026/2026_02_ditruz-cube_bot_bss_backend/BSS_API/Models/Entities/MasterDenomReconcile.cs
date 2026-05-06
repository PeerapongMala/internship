using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_mst_denom_reconcile")]
    //[Index(nameof(DenoId), nameof(DepartmentId), nameof(DenomSeries), IsUnique = true, Name = "UQ_bss_mst_denom_reconcile_deno_dept_series")]
    public class MasterDenomReconcile
    {

        [Key]
        [Required]
        [Column("denom_reconcile_id")]
        public int DenomReconcileId { get; set; }

        [Required]
        [ForeignKey("bss_mst_denomination")]
        [Column("deno_id")]
        public int DenoId { get; set; }

        [ForeignKey(nameof(DenoId))]
        public MasterDenomination MasterDenomination { get; set; }

        [Required]
        [ForeignKey("bss_mst_bn_operation_center")]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public MasterDepartment MasterDepartment { get; set; } 

        [Required]
        [ForeignKey("bss_mst_series_denom")]
        [Column("series_denom_id")]
        public int SeriesDenomId { get; set; }

        [ForeignKey(nameof(SeriesDenomId))]
        public MasterSeriesDenom MasterSeriesDenom { get; set; }

        [Column("seq_no")]
        public int? SeqNo { get; set; }

        [Column("is_default")]
        public bool? IsDefault { get; set; }

        [Column("is_display")]
        public bool? IsDisplay { get; set; }

        [Column("is_active")]
        public bool? IsActive { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }


    }
}

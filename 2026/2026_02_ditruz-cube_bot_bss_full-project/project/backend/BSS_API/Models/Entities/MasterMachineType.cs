using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{

    [Table("bss_mst_machine_type")]
    public class MasterMachineType
    {

        [Key]
        [Required]
        [Column("machine_type_id")]
        public int MachineTypeId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("machine_type_code")]
        public string MachineTypeCode { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("machine_type_name")]
        public string MachineTypeName { get; set; }

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

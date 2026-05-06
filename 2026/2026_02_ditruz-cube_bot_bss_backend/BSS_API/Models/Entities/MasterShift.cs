namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    
    [Table("bss_mst_shift")]
    public class MasterShift
    {
        [Key]
        [Required]
        [Column("shift_id")]
        public int ShiftId { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("shift_code")]
        public string ShiftCode { get; set; }

        [MaxLength(20)]
        [Column("shift_name")]
        public string? ShiftName { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("start_time")]
        public string ShiftStartTime { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("end_time")]
        public string ShiftEndTime { get; set; }

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
        
        public ICollection<TransactionReconcileTran>? TransactionReconcileTran { get; set; }
    }
}

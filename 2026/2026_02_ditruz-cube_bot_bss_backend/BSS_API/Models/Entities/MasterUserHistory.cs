using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_txn_user_history")]
    public class MasterUserHistory
    {
        [Key]
        [Required]
        [Column("user_his_id")]
        public int UserHisId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [ForeignKey("bss_mst_bn_operation_center")]
        [Column("department_id")]
        public int DepartmentId { get; set; }

        [Required]
        [ForeignKey("bss_mst_role_group")]
        [Column("role_group_id")]
        public int RoleGroupId { get; set; }

        [Required]
        [MaxLength(40)]
        [Column("username")]
        public string UserName { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("user_mail")]
        public string UserEmail { get; set; }

        [MaxLength(50)]
        [Column("first_name")]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("is_internal")]
        public bool? IsInternal { get; set; }

        [Column("start_date")]
        public DateTime StartDate { get; set; } = DateTime.Now;

        [Column("end_date")]
        public DateTime EndDate { get; set; } = DateTime.Now;

        [Column("user_created_date")]
        public DateTime? UserCreatedDate { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("created_date")]
        public DateTime? CreatedDate { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
    }
}

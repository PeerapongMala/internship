namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_mst_user")]
    public class MasterUser
    {
        public MasterUser()
        {
            MasterUserRole = new HashSet<MasterUserRole>();
            TransactionRegisterUnsort = new HashSet<TransactionRegisterUnsort>();
            TransactionUnsortCC = new HashSet<TransactionUnsortCC>();
            TransactionUserLoginLog = new HashSet<TransactionUserLoginLog>();
            BssTransactionNotiRecipient = new HashSet<BssTransactionNotiRecipient>();
            BssTransactionRefreshToken =  new HashSet<BssTransactionRefreshToken>();
        }
        
        [Key] [Required] [Column("user_id")] public int UserId { get; set; }

        [Required]
        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment MasterDepartment { get; set; }

        [Required]
        [MaxLength(40)]
        [Column("username")]
        public string UserName { get; set; }

        [MaxLength(100)]
        [Column("username_display")]
        public string? UsernameDisplay { get; set; }

        [MaxLength(30)] [Column("id_no")] public string? IdNo { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("user_mail")]
        public string UserEmail { get; set; }

        [MaxLength(50)] [Column("first_name")] public string? FirstName { get; set; }

        [MaxLength(50)] [Column("last_name")] public string? LastName { get; set; }

        [Column("is_internal")] public bool? IsInternal { get; set; }

        [Required] [Column("start_date")] public DateTime StartDate { get; set; } = DateTime.Now;

        [Required] [Column("end_date")] public DateTime EndDate { get; set; } = DateTime.Now;

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Required] [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        public ICollection<MasterUserRole> MasterUserRole { get; set; }

        public ICollection<TransactionRegisterUnsort> TransactionRegisterUnsort { get; set; }

        public ICollection<TransactionUnsortCC> TransactionUnsortCC { get; set; }

        public ICollection<TransactionUserLoginLog> TransactionUserLoginLog { get; set; }

        public ICollection<BssTransactionNotiRecipient> BssTransactionNotiRecipient { get; set; }

        public ICollection<BssTransactionRefreshToken> BssTransactionRefreshToken { get; set; }
    }
}
namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    
    [Table("bss_txn_login_log")]
    public class TransactionUserLoginLog
    {
        [Key, Column("login_log_id")] public long LoginLogId { get; set; }

        #region MasterDepartment

        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }
        public MasterDepartment MasterDepartment { get; set; }

        #endregion MasterDepartment

        #region UserLogin

        [Column("user_id")]
        [ForeignKey("UserLogin")]
        public int UserId { get; set; }
        public MasterUser? UserLogin { get; set; }

        #endregion UserLogin

        #region MasterMachine

        [Column("machine_id")]
        [ForeignKey("MasterMachine")]
        public int? MachineId { get; set; }
        public MasterMachine? MasterMachine { get; set; }

        #endregion MasterMachine
        
        [Column("first_login")]
        public DateTime? FirstLogin { get; set; }
        
        [Column("last_login")]
        public DateTime? LastLogin { get; set; }
        
        [Column("remark")]
        public string? Remark { get; set; }
        
        [Column("is_active")]
        public bool? IsActive { get; set; }
        
        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}

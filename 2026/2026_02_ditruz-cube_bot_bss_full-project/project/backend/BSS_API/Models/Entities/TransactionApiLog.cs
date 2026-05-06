namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_api_log")]
    public class TransactionApiLog
    {
        [Key, Column("api_log_id")] public long ApiLogId { get; set; }

        #region MasterDepartment

        [Column("department_id")]
        [ForeignKey("MasterDepartment")]
        public int DepartmentId { get; set; }

        public MasterDepartment? MasterDepartment { get; set; }

        #endregion MasterDepartment

        [Column("system_code")] public string SystemCode { get; set; }

        [Column("service_name")] public string ServiceName { get; set; }

        [Column("api_request")] public string ApiRequest { get; set; }

        [Column("api_response")] public string ApiResponse { get; set; }

        [Column("api_result")] public bool ApiResult { get; set; }

        [Column("remark")] public string? Remark { get; set; }

        [Column("created_by")] public string? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }
    }
}
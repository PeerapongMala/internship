namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_notification")]
    public class BssTransactionNotification
    {
        [Key, Column("notification_id")] public long NotificationId { get; set; }

        [Column("notification_type_code")] public string NotificationTypeCode { get; set; }

        [Column("department_id")] public int DepartmentId { get; set; }

        [Column("message")] public string Message { get; set; }

        [Column("is_sent")] public bool IsSent { get; set; }

        [Column("created_by")] public int CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }

        [Column("otp_code")] public string OtpCode { get; set; }

        [Column("otp_ref_code")] public string OtpRefCode { get; set; }

        [Column("otp_date")] public DateTime OtpDate { get; set; }

        public BssTransactionNotiRecipient BssTransactionNotiRecipient { get; set; }
    }
}
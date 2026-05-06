namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_noti_recipient")]
    public class BssTransactionNotiRecipient
    {
        [Key, Column("recipient_id")] public long RecipientId { get; set; }

        [Column("notification_id")]
        [ForeignKey("BssTransactionNotification")]
        public long NotificationId { get; set; }

        public BssTransactionNotification BssTransactionNotification { get; set; }

        [Column("user_id")]
        [ForeignKey("MasterUser")]
        public int UserId { get; set; }

        public MasterUser MasterUser { get; set; }

        [Column("is_read")] public bool IsRead { get; set; }

        [Column("created_by")] public int CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; }

        [Column("updated_by")] public int UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}
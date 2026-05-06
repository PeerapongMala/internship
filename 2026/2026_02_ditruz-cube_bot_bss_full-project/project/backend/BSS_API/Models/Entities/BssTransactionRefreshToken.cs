using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.Entities
{
    [Table("bss_txn_refresh_token")]
    public class BssTransactionRefreshToken
    {
        [Key]
        [Required]
        [Column("refresh_token_id")]
        public long RefreshTokenId { get; set; }

        [Required]
        [Column("user_id")]
        [ForeignKey("MasterUser")]
        public int UserId { get; set; }

        public MasterUser MasterUser { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("token_hash")]
        public string TokenHash { get; set; }

        [Required]
        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; } = DateTime.Now.AddDays(7);

        [MaxLength(50)]
        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("is_revoked")]
        public bool IsRevoked { get; set; } = false;

        [Column("revoked_at")]
        public DateTime? RevokedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

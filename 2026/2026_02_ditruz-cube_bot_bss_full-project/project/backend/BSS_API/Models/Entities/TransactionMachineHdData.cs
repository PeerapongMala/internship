namespace BSS_API.Models.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bss_txn_machine_hd_data")]
    public class TransactionMachineHdData
    {
        [Key, Column("machine_data_id")] public long MachineDataId { get; set; }

        #region MachineHd

        [Column("machine_hd_id")]
        [ForeignKey("TransactionMachineHd")]
        public long MachineHdId { get; set; }

        public TransactionMachineHd? TransactionMachineHd { get; set; }

        #endregion MachineHd

        [Column("denom_id"), MaxLength(8)] public string DenomId { get; set; } = string.Empty;

        [Column("denom_name"), MaxLength(50)] public string DenomName { get; set; } = string.Empty;

        [Column("denom_currency"), MaxLength(5)] public string? DenomCurrency { get; set; }

        [Column("denom_value")] public int DenomValue { get; set; }

        [Column("denom_quality"), MaxLength(8)] public string DenomQuality { get; set; } = string.Empty;

        [Column("denom_output"), MaxLength(10)] public string DenomOutput { get; set; } = string.Empty;

        [Column("denom_num")] public int DenomNum { get; set; }

        [Column("bn_type"), MaxLength(5)] public string? BnType { get; set; }

        [Column("series_code"), MaxLength(10)] public string? SeriesCode { get; set; }

        [Column("is_not_found")] public bool? IsNotFound { get; set; }

        [Column("is_unknow")] public bool? IsUnknow { get; set; }

        [Column("remark"), MaxLength(500)] public string? Remark { get; set; }

        [Column("is_active")] public bool? IsActive { get; set; }

        [Column("created_by")] public int? CreatedBy { get; set; }

        [Column("created_date")] public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column("updated_by")] public int? UpdatedBy { get; set; }

        [Column("updated_date")] public DateTime? UpdatedDate { get; set; }
    }
}

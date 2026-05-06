namespace BSS_API.Models.ObjectModels
{
    using System.ComponentModel.DataAnnotations;

    public class ReceiveCbmsData
    {
        [Required] [MaxLength(5)] public string bdc_code { get; set; }

        [Required] [MaxLength(3)] public string bn_type_input { get; set; }

        [Required] [MaxLength(20)] public string barcode { get; set; }

        [Required] [MaxLength(20)] public string container_id { get; set; }

        [Required] [MaxLength(20)] public string send_date { get; set; }

        [MaxLength(12)] public string? inst_code { get; set; }

        public int deno { get; set; }

        public int qty { get; set; }

        [MaxLength(5)] public string? cb_bdc_code { get; set; }

        [Required] public int created_by { get; set; }
    }
}
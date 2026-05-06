using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class GetDeliveryVerifyDataToCbmsData
    {
        [Required]
        [MaxLength(3)]
        public string result_session { get; set; }

        [Required]
        [MaxLength(12)]
        public string inst_code { get; set; }

        [Required]
        public int deno { get; set; }

        [Required]
        [MaxLength(1)]
        public string bn_type_input { get; set; }

        [Required]
        [MaxLength(1)]
        public string bn_type_output { get; set; }

        [Required]
        [MaxLength(3)]
        public string bn_series { get; set; }

        [Required]
        [MaxLength(15)]
        public string container_id { get; set; }

        [Required]
        public int qty { get; set; }

        [Required]
        [MaxLength(5)]
        public string cb_bdc_code { get; set; }

        [Required]
        [MaxLength(5)]
        public string bdc_code { get; set; }

        [Required]
        [MaxLength(20)]
        public string barcode { get; set; }

        [Required]
        [MaxLength(24)]
        public string sub_barcode { get; set; }

        [Required]
        [MaxLength(50)]
        public string header_card { get; set; }

        [MaxLength(50)]
        public string affedted_header_card { get; set; }

        [Required]
        [MaxLength(100)]
        public string reference_code { get; set; }
        
        [Required]
        [MaxLength(15)]
        public string machine_id { get; set; }

        [Required]
        public DateTime mchn_sort_date { get; set; }

    }
}

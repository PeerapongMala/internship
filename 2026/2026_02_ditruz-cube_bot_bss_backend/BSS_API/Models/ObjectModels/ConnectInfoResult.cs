using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class ConnectInfoResult
    {
        [Required]
        public string system_code { get; set; }

        [Required]
        public string date_time { get; set; }

        public string? ip_client { get; set; } = string.Empty;

        [Required]
        public string service_name { get; set; }
    }
}

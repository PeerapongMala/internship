namespace BSS_API.Models.External.Request
{
    using Newtonsoft.Json;
    using Core.JsonConverter;
    using System.ComponentModel.DataAnnotations;

    public class ReceiveCbmsDataRequest
    {
        [JsonProperty("connectInfo")] public ReceiveCbmsConnectInfo ConnectInfo { get; set; } = new();

        [JsonProperty("requestData")] public ReceiveCbmsRequestData? RequestData { get; set; } = new();

        [JsonProperty("receivedData")]
        public ICollection<ReceiveCbmsReceiveData> ReceivedData { get; set; } = new List<ReceiveCbmsReceiveData>();
    }

    public class ReceiveCbmsConnectInfo
    {
        [JsonProperty("systemCode"), Required(AllowEmptyStrings = false)]
        public string SystemCode { get; set; }

        [JsonProperty("callerDatetime")] public DateTime? CallerDateTime { get; set; }

        [JsonProperty("ipClient"), Required(AllowEmptyStrings = false)]
        public string IpClient { get; set; }

        [JsonProperty("serviceName")] public string ServiceName { get; set; } = "receivebanknotecbms";
    }

    public class ReceiveCbmsRequestData
    {
    }

    public class ReceiveCbmsReceiveData
    {
        [JsonProperty("bdc_code")] public string? bdc_code { get; set; }

        [JsonProperty("bn_type_input")] public string? bn_type_input { get; set; }

        [JsonProperty("barcode")] public string? barcode { get; set; }

        /// <summary>
        /// barcode ภาชนะ
        /// </summary>
        [JsonProperty("container_id")]
        public string? container_id { get; set; }

        [JsonProperty("send_date")]
        [JsonConverter(typeof(StrictDateTimeConverter))]
        public DateTime? send_date { get; set; } = DateTime.Now;

        /// <summary>
        /// รหัสธนาคาร
        /// </summary>
        [JsonProperty("inst_code")]
        public string? inst_code { get; set; }

        /// <summary>
        /// ชนิดราคา
        /// </summary>
        [JsonProperty("deno")]
        public decimal? deno { get; set; }

        [JsonProperty("qty")] public int? qty { get; set; }

        [JsonProperty("cb_bdc_code")]
        [JsonConverter(typeof(StringOnlyConverter))]
        public string cb_bdc_code { get; set; }

        [JsonProperty("requested_by")] public string? requested_by { get; set; }
    }
}
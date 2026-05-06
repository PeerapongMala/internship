using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class CountPrepareByContainerRequest
    {
        public int departmentId { get; set; } = 0;
        public string containerId { get; set; } = string.Empty;

        public string bssBNTypeCode { get; set; } = string.Empty;
    }
}

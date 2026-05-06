using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ConfirmFromCbmsRequest
    {
        public ConnectInfoRequest connectinforeq { get; set; }
        public ConfirmFromCbmsRequestModel stringjsonreq { get; set; }
    }
}

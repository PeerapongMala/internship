
using BSS_API.Models.ObjectModels;
using BSS_API.Models.ResponseModels;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ReceiveCbmsRequest
    {
        public ConnectInfoRequest connectinforeq { get; set; }

        public ReceiveCbmsRequestModel stringjsonreq { get; set; }
    }
}

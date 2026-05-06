using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.RequestModels
{
    public class DeliveryCbmsRequest
    {
        public ConnectInfoRequest connectinforeq { get; set; }
        public DeliveryCbmsRequestData stringjsonreq { get; set; }
    }
}

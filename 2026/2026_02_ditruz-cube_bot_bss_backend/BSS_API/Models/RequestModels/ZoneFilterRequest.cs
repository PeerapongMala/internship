using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ZoneFilterRequest
    {
        public string departmentFilter { get; set; } = string.Empty;
        public string instFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}

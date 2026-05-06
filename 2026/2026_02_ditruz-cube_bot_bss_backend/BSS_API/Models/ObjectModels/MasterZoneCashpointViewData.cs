using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterZoneCashpointViewData
    {
        public int ZoneCashpointId { get; set; }

        public int ZoneId { get; set; }

        public string ZoneCode { get; set; }
        public string ZoneName { get; set; }  
        public int CashpointId { get; set; }
        public string CashPointName { get; set; }


        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}

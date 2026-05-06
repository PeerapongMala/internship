using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterSeriesDenomDisplay
    {
         
        public int SeriesDenomId { get; set; }
 
        public string SeriesCode { get; set; }
 
        public string SerieDescrpt { get; set; }

       
        public bool? IsActive { get; set; }
 
        public int? CreatedBy { get; set; }
 
        public DateTime CreatedDate { get; set; }
 
        public int? UpdatedBy { get; set; }
 
        public DateTime? UpdatedDate { get; set; }


    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class MasterMSevendenomSeriesViewData
    {
        
        public int MSevendenomSeriesId { get; set; }

        public int MSevenDenomId { get; set; }

        public int SeriesDenomId { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }



        public string SeriesCode { get; set; } 
        public string SerieDescrpt { get; set; }
        public string M7DenomCode { get; set; }
        public string M7DenomName { get; set; }
        public string M7DenomDescrpt { get; set; }
    }
}
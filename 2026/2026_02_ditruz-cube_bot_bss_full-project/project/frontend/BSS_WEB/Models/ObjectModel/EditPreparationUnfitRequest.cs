using System.Text.Json.Serialization;

namespace BSS_WEB.Models.ObjectModel
{
    public class EditPreparationUnfitRequest
    {
        public long PrepareId { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public string? Remark { get; set; }

        
        public int UpdatedBy { get; set; }

        
     
        public int CreatedBy { get; set; }
    }
}

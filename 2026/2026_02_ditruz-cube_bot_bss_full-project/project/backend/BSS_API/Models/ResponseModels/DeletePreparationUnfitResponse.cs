namespace BSS_API.Models.ResponseModels
{
    public class EditPreparationUnfitResponse
    {
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }   
        public string? Remark { get; set; }
        public int?  UpdatedBy { get; set; } 
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}

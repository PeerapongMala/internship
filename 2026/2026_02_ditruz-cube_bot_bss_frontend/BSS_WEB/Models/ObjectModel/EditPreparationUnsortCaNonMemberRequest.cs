namespace BSS_WEB.Models.ObjectModel
{
    public class EditPreparationUnsortCaNonMemberRequest
    {
        public long PrepareId { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public string? Remark { get; set; } 
        public int UpdatedBy { get; set; }  
        public int CreatedBy { get; set; }
    }
}

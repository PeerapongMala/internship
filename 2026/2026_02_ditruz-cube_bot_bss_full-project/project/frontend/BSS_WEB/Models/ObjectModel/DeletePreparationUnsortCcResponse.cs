namespace BSS_WEB.Models.ObjectModel
{
    public class DeletePreparationUnsortCcResponse
    {
        public long PrepareId { get; set; }
        public long ContainerPrepareId { get; set; }
        public bool? IsActive { get; set; }
        public int StatusId { get; set; }
        public string? Remark { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}

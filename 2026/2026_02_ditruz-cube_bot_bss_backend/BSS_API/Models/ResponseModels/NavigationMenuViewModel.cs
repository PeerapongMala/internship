namespace BSS_API.Models.ResponseModels
{
    public class NavigationMenuViewModel
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string? MenuPath { get; set; }
        public string? ControllerName { get; set; }
        public string? ActionName { get; set; }
        public int? ParentMenuId { get; set; }
        public int DisplayOrder { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? AssignedDate { get; set; }
    }
}

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateMenuRequest
    {
        public string menuName { get; set; } = string.Empty;
        public string menuPath { get; set; } = string.Empty;
        public int displayOrder { get; set; } = 0;
        public string controllerName { get; set; } = string.Empty;
        public string actionName { get; set; } = string.Empty;
        public int? parentMenuId { get; set; } = null;
        public bool isActive { get; set; } = false;
       

    }
}

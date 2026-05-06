namespace BSS_WEB.Models.ObjectModel
{
    public class MasterMenuActiveData
    {
        public int menuId { get; set; }
        public string menuName { get; set; }
        public int displayOrder { get; set; }
        public int? parentMenuId { get; set; }
    }
}

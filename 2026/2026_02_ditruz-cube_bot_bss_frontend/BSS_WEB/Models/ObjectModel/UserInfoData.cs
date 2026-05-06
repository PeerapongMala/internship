namespace BSS_WEB.Models.ObjectModel
{
    public class UserInfoData
    {
        public int userId { get; set; }
        public string? userName { get; set; }
        public string? usernameDisplay { get; set; }
        public string? userEmail { get; set; }
        public string? firstName { get; set; }
        public string? lastName { get; set; }
        public bool? isInternal { get; set; }
    }
}

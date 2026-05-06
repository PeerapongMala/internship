namespace BSS_WEB.Models.SearchModel
{
    public class SearchUserForCreateRequest
    {
        public int companyId { get; set; } = 0;
        public string userNameInput { get; set; } = string.Empty;
        public int createBy { get; set; } = 0;
    }
}

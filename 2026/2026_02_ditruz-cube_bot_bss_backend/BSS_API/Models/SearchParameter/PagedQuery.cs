namespace BSS_API.Models.SearchParameter
{
    public class PagedSearch<TFilter>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string SortBy { get; set; }
        public string SortDirection { get; set; } = "asc";

        public TFilter Filter { get; set; }
    }
}

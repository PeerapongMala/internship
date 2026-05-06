namespace BSS_API.Models.SearchParameter
{
    public class PagedResult<T>
    { 
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

        public int TotalPages =>
        PageSize <= 0
            ? 0
            : (int)Math.Ceiling((double)TotalItems / PageSize);

        public List<T> Items { get; set; }
    }
}

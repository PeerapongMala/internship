using BSS_WEB.Models.Common;

namespace BSS_API.Models.SearchParameter
{
    public class DataTablePagedRequest<TFilter>
    : PagedRequest<TFilter>
    where TFilter : class?
    {
        /// <summary>
        /// DataTables draw counter
        /// </summary>
        public int Draw { get; set; }
    }
 
}

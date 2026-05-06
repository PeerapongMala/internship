namespace BSS_API.Models.SearchParameter
{
    using Core.Constants;
    using System.ComponentModel.DataAnnotations;

    public class SystemSearchRequest
    {
        public int? CompanyId { get; set; }

        public int? DepartmentId { get; set; }

        public string? CbBcdCode { get; set; }

        [Required] public string TableName { get; set; } = string.Empty;

        public string Operator { get; set; } = OperatorConstants.OR;

        public ICollection<SearchCondition> SearchCondition { get; set; } = new List<SearchCondition>();

        #region Paging

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        #endregion Paging

        #region DropDown

        public int SelectItemCount { get; set; } = 100;

        public bool IncludeData { get; set; } = true;

        #endregion DropDown
    }

    public class SearchCondition
    {
        public string ColumnName { get; set; } = string.Empty;
        public string FilterOperator { get; set; } = string.Empty;
        public object? FilterValue { get; set; }
    }
}
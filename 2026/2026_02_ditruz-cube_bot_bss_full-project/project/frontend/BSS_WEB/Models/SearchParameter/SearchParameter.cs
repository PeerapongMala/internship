using System.Text.Json;
using Newtonsoft.Json.Linq;
using BSS_WEB.Core.Constants;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.SearchParameter
{
    public class SystemSearchRequest
    {
        public int? CompanyId { get; set; }

        public int? DepartmentId { get; set; }
        public string? CbBcdCode { get; set; }

        [Required] public string TableName { get; set; } = string.Empty;
        public string Operator { get; set; } = OperatorConstants.AND;
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
        private object? _filterValue;

        public object? FilterValue
        {
            get => _filterValue;
            set
            {
                if (value is JToken jToken)
                {
                    _filterValue = ConvertJToken(jToken);
                }
                else if (value is JsonElement jsonElement)
                {
                    _filterValue = ConvertJsonElement(jsonElement);
                }
                else
                {
                    _filterValue = value;
                }
            }
        }

        private object? ConvertJToken(JToken token)
        {
            switch (token.Type)
            {
                case JTokenType.Integer:
                    return token.Value<long>();
                case JTokenType.Float:
                    return token.Value<double>();
                case JTokenType.String:
                    return token.Value<string>();
                case JTokenType.Boolean:
                    return token.Value<bool>();
                case JTokenType.Null:
                    return null;
                default:
                    return token.ToString();
            }
        }

        private object? ConvertJsonElement(JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Number:
                    if (element.TryGetInt64(out long longValue))
                        return longValue;
                    return element.GetDouble();
                case JsonValueKind.String:
                    return element.GetString();
                case JsonValueKind.True:
                    return true;
                case JsonValueKind.False:
                    return false;
                case JsonValueKind.Null:
                    return null;
                default:
                    return element.ToString();
            }
        }
    }
}
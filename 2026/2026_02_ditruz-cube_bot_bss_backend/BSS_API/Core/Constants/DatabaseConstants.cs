namespace BSS_API.Core.Constants
{
    public abstract class OperatorConstants
    {
        public const string AND = "AND";
        public const string OR = "OR";
    }

    public abstract class FilterOperatorConstants
    {
        public const string CONTAINS = "CONTAINS";
        public const string NOT_CONTAINS = "NOT_CONTAINS";
        public const string EQUAL = "EQUAL";
        public const string NOT_EQUAL = "NOT_EQUAL";
        public const string END_WITH = "END_WITH";
        public const string START_WITH = "START_WITH";
        public const string IS_NULL = "IS_NULL";
        public const string IS_NOT_NULL = "IS_NOT_NULL";
        /*public const string IN = "IN";
        public const string NOT_IN = "NOT_IN";*/
        public const string IS_EMPTY = "IS_EMPTY";
        public const string IS_NOT_EMPTY = "IS_NOT_EMPTY";
        public const string GREATER_THAN = "GREATER_THAN";
        public const string GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL";
        public const string LESS_THAN = "LESS_THAN";
        public const string LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL";
    }
}
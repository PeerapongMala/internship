namespace BSS_API.Helpers
{
    using Models;
    using Core.Constants;
    using System.Collections;
    using Models.SearchParameter;
    using System.Linq.Expressions;

    public static class QueryableExtensions
    {
        public static IQueryable<T> GenerateCondition<T>(
            this IQueryable<T> query,
            SystemSearchRequest request)
        {
            var parameter = Expression.Parameter(typeof(T), "x");
            Expression? finalExpression = null;

            foreach (var condition in request.SearchCondition)
            {
                var member = BuildMemberExpression(parameter, condition.ColumnName);
                var memberType = member.Type;

                // ??? type ???? (int? -> int)
                var targetType = Nullable.GetUnderlyingType(memberType) ?? memberType;

                object? safeValue = condition.FilterValue;

                if (safeValue != null)
                {
                    safeValue = Convert.ChangeType(safeValue, targetType);
                }

                // ????? constant ?????? memberType ????
                var filterValue = Expression.Constant(safeValue, memberType);

                Expression conditionExpression = condition.FilterOperator switch
                {
                    FilterOperatorConstants.CONTAINS => Expression.Call(
                        member,
                        nameof(string.Contains),
                        Type.EmptyTypes,
                        filterValue
                    ),

                    FilterOperatorConstants.NOT_CONTAINS => Expression.Not(
                        Expression.Call(
                            member,
                            nameof(string.Contains),
                            Type.EmptyTypes,
                            filterValue
                        )
                    ),

                    FilterOperatorConstants.START_WITH => Expression.Call(
                        member,
                        nameof(string.StartsWith),
                        Type.EmptyTypes,
                        filterValue
                    ),

                    FilterOperatorConstants.END_WITH => Expression.Call(
                        member,
                        nameof(string.EndsWith),
                        Type.EmptyTypes,
                        filterValue
                    ),

                    FilterOperatorConstants.EQUAL => Expression.Equal(member, filterValue),
                    FilterOperatorConstants.NOT_EQUAL => Expression.NotEqual(member, filterValue),
                    FilterOperatorConstants.GREATER_THAN => Expression.GreaterThan(member, filterValue),
                    FilterOperatorConstants.GREATER_THAN_OR_EQUAL => Expression.GreaterThanOrEqual(member, filterValue),
                    FilterOperatorConstants.LESS_THAN => Expression.LessThan(member, filterValue),
                    FilterOperatorConstants.LESS_THAN_OR_EQUAL => Expression.LessThanOrEqual(member, filterValue),
                    FilterOperatorConstants.IS_NULL => Expression.Equal(member, Expression.Constant(null)),
                    FilterOperatorConstants.IS_NOT_NULL => Expression.NotEqual(member, Expression.Constant(null)),
                    FilterOperatorConstants.IS_EMPTY => Expression.Equal(member, Expression.Constant(string.Empty)),
                    FilterOperatorConstants.IS_NOT_EMPTY => Expression.NotEqual(member, Expression.Constant(string.Empty)),
                    /*FilterOperatorConstants.IN => BuildInExpression(member, filterValue),
                    FilterOperatorConstants.NOT_IN => Expression.Not(BuildInExpression(member, filterValue)),*/

                    _ => throw new NotSupportedException(
                        $"Operator '{condition.FilterOperator}' not supported"
                    )
                };

                finalExpression = finalExpression == null
                    ? conditionExpression
                    : request.Operator == OperatorConstants.AND
                        ? Expression.AndAlso(finalExpression, conditionExpression)
                        : Expression.OrElse(finalExpression, conditionExpression);
            }

            if (finalExpression == null)
                return query;

            var lambda = Expression.Lambda<Func<T, bool>>(finalExpression, parameter);
            return query.Where(lambda);
        }
        
        private static MemberExpression BuildMemberExpression(
            Expression parameter,
            string propertyPath)
        {
            Expression current = parameter;
            foreach (var prop in propertyPath.Split('.'))
            {
                current = Expression.PropertyOrField(current, prop);
            }

            return (MemberExpression)current;
        }

        private static Expression BuildInExpression(
            Expression member,
            object? value)
        {
            if (value is not IEnumerable enumerable)
                throw new ArgumentException("IN operator requires array value");

            var elementType = member.Type;

            var listType = typeof(List<>).MakeGenericType(elementType);
            var list = Activator.CreateInstance(listType)!;

            var addMethod = listType.GetMethod("Add")!;

            foreach (var item in enumerable)
            {
                addMethod.Invoke(list, [
                    Convert.ChangeType(item, elementType)
                ]);
            }

            return Expression.Call(
                Expression.Constant(list),
                nameof(List<int>.Contains),
                Type.EmptyTypes,
                member
            );
        }
    }
}
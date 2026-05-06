using System.Collections;
using System.Linq.Expressions;
using System.Reflection;

namespace BSS_API.Helpers.Filters;

public enum FilterOp
{
    Equal,
    NotEqual,
    Contains,
    StartsWith,
    EndsWith,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    In,
    Between // ใช้คู่ From/To
}

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public sealed class FilterAttribute : Attribute
{
    public FilterOp Op { get; }
    public string? EntityPath { get; }
    public bool IgnoreCase { get; set; } = true;

    public FilterAttribute(FilterOp op, string? entityPath = null)
    {
        Op = op;
        EntityPath = entityPath;
    }
}
public static class FilterExpressionBuilder
{
    public static Expression<Func<TEntity, bool>> Build<TEntity, TRequest>(this TRequest request)
    {
        var entityType = typeof(TEntity);
        var requestType = typeof(TRequest);

        var parameter = Expression.Parameter(entityType, "e");
        Expression? body = null;

        foreach (var reqProp in requestType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            var value = reqProp.GetValue(request);
            if (value is null) continue;

            var entityProp = entityType.GetProperty(reqProp.Name);
            if (entityProp is null) continue;


            if (reqProp.PropertyType == typeof(string))
            {
                var str = value as string;
                if (string.IsNullOrWhiteSpace(str)) continue;
            }

            if (reqProp.PropertyType == typeof(int) && (int)value == 0)
                continue;

            if (reqProp.PropertyType == typeof(int?) && (int?)value == null)
                continue;

            var left = Expression.Property(parameter, entityProp);
            var right = Expression.Constant(value, entityProp.PropertyType);

            var equal = Expression.Equal(left, right);

            body = body == null
                ? equal
                : Expression.AndAlso(body, equal);
        }

        if (body == null)
            body = Expression.Constant(true);

        return Expression.Lambda<Func<TEntity, bool>>(body, parameter);
    }
    public static Expression<Func<TEntity, bool>> Builder<TEntity, TFilter>(this TFilter filter)
        where TEntity : class
        where TFilter : class
    {
        var param = Expression.Parameter(typeof(TEntity), "x");
        Expression? body = null;

        foreach (var prop in typeof(TFilter).GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            var attr = prop.GetCustomAttribute<FilterAttribute>();
            if (attr is null) continue;

            var value = prop.GetValue(filter);
            if (IsEmptyValue(prop.PropertyType, value)) continue;

            var entityPath = attr.EntityPath ?? prop.Name;
            var member = BuildMemberExpression(param, entityPath);

            Expression condition = BuildCondition(member, attr, value);

            body = body is null ? condition : Expression.AndAlso(body, condition);
        }

        return body is null
            ? (x => true)
            : Expression.Lambda<Func<TEntity, bool>>(body, param);
    }

    private static MemberExpression BuildMemberExpression(Expression parameter, string propertyPath)
    {
        Expression current = parameter;

        foreach (var prop in propertyPath.Split('.'))
            current = Expression.PropertyOrField(current, prop);

        return (MemberExpression)current;
    }

    private static bool IsEmptyValue(Type type, object? value)
    {
        if (value is null) return true;

        if (type == typeof(string))
            return string.IsNullOrWhiteSpace((string)value);

        // Nullable<T>
        var underlying = Nullable.GetUnderlyingType(type);
        if (underlying is not null)
            return value is null;

        // int/long/... = 0 ไม่ filter
        if (type.IsValueType)
        {
            var defaultVal = Activator.CreateInstance(type);
            if (Equals(value, defaultVal)) return true;
        }

        // IEnumerable (ยกเว้น string): ว่าง = ไม่ filter
        if (value is IEnumerable enumerable && value is not string)
        {
            foreach (var _ in enumerable) return false;
            return true;
        }

        return false;
    }

    private static Expression BuildCondition(MemberExpression member, FilterAttribute attr, object value)
    {
        var memberType = member.Type;
        var targetType = Nullable.GetUnderlyingType(memberType) ?? memberType;

        object convertedValue = ConvertTo(targetType, value);

        Expression constant = Expression.Constant(convertedValue, targetType);
        if (memberType != targetType)
            constant = Expression.Convert(constant, memberType);

        return attr.Op switch
        {
            FilterOp.Equal => Expression.Equal(member, constant),
            FilterOp.NotEqual => Expression.NotEqual(member, constant),
            FilterOp.GreaterThan => Expression.GreaterThan(member, constant),
            FilterOp.GreaterThanOrEqual => Expression.GreaterThanOrEqual(member, constant),
            FilterOp.LessThan => Expression.LessThan(member, constant),
            FilterOp.LessThanOrEqual => Expression.LessThanOrEqual(member, constant),

            FilterOp.Contains => BuildStringCall(member, "Contains", convertedValue, attr.IgnoreCase),
            FilterOp.StartsWith => BuildStringCall(member, "StartsWith", convertedValue, attr.IgnoreCase),
            FilterOp.EndsWith => BuildStringCall(member, "EndsWith", convertedValue, attr.IgnoreCase),

            FilterOp.In => BuildInExpression(member, value),

            _ => throw new NotSupportedException($"Filter operator '{attr.Op}' not supported.")
        };
    }

    private static Expression BuildStringCall(MemberExpression member, string method, object convertedValue, bool ignoreCase)
    {
        if (member.Type != typeof(string))
            throw new InvalidOperationException($"{method} only supports string member. Member={member.Member.Name}");

        Expression left = member;
        Expression right = Expression.Constant((string)convertedValue, typeof(string));

        if (ignoreCase)
        {
            var toLower = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!;
            left = Expression.Call(left, toLower);
            right = Expression.Call(right, toLower);
        }

        var m = typeof(string).GetMethod(method, new[] { typeof(string) })!;
        return Expression.Call(left, m, right);
    }

    private static Expression BuildInExpression(MemberExpression member, object raw)
    {
        if (raw is not IEnumerable enumerable || raw is string)
            throw new ArgumentException("IN operator requires IEnumerable (not string).");

        var elementType = Nullable.GetUnderlyingType(member.Type) ?? member.Type;

        var listType = typeof(List<>).MakeGenericType(elementType);
        var list = Activator.CreateInstance(listType)!;
        var add = listType.GetMethod("Add")!;

        foreach (var item in enumerable)
        {
            if (item is null) continue;
            var converted = ConvertTo(elementType, item);
            add.Invoke(list, new[] { converted });
        }

        var contains = listType.GetMethod("Contains", new[] { elementType })!;
        Expression listConst = Expression.Constant(list);
        Expression memberValue = member.Type == elementType ? member : Expression.Convert(member, elementType);

        return Expression.Call(listConst, contains, memberValue);
    }

    private static object ConvertTo(Type targetType, object value)
    {
        if (value.GetType() == targetType) return value;

        if (targetType.IsEnum)
            return Enum.Parse(targetType, value.ToString()!, ignoreCase: true);

        if (targetType == typeof(Guid))
            return Guid.Parse(value.ToString()!);

        if (targetType == typeof(DateTime))
            return DateTime.Parse(value.ToString()!);

        return Convert.ChangeType(value, targetType);
    }
}

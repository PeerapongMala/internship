namespace BSS_API.Repositories.Common
{
    using BSS_API.Models.Common;
    using System.Linq.Expressions;
    using Microsoft.EntityFrameworkCore;

    public static class IQueryableExtensions
    {
        public static async Task<PagedData<TResult>> ToPagedDataAsync<T, TFilter, TResult>(
            this IQueryable<T> query,
            PagedRequest<TFilter> request,
            Func<IQueryable<T>, TFilter?, IQueryable<T>>? applyFilter,
            Func<IQueryable<T>, string?, IQueryable<T>>? applySearch,
            IReadOnlyDictionary<string, Expression<Func<T, object>>>? sortMap,
            Expression<Func<T, TResult>> selector,
            CancellationToken ct = default)
            where TFilter : class?
        {
            if (applyFilter != null)
                query = applyFilter(query, request.Filter);

            if (applySearch != null)
                query = applySearch(query, request.Search);

            if (request.Sorts?.Count > 0 && sortMap != null)
                query = query.ApplySorting(request.Sorts, sortMap);

            var total = await query.CountAsync(ct);
            var items = new List<TResult>();
            if (request.PageSize <= 0)
            {
                items = await query
                    .Select(selector)
                    .ToListAsync(ct);
            }
            else
            {
                items = await query
                    .Skip(request.Skip)
                    .Take(request.Take)
                    .Select(selector)
                    .ToListAsync(ct);
            }

            return new PagedData<TResult>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
        
        private static IQueryable<T> ApplySorting<T>(
            this IQueryable<T> query,
            IEnumerable<SortRequest>? sorts,
            IReadOnlyDictionary<string, Expression<Func<T, object>>>? sortMap)
        {
            if (sorts == null || sortMap == null || sorts.Count() == 0)
                return query;

            IOrderedQueryable<T>? orderedQuery = null;

            foreach (var sort in sorts)
            {
                if (!sortMap.TryGetValue(sort.Field, out var expr))
                    continue;

                if (orderedQuery == null)
                {
                    orderedQuery = sort.Direction == SortDirection.Desc
                        ? query.OrderByDescending(expr)
                        : query.OrderBy(expr);
                }
                else
                {
                    orderedQuery = sort.Direction == SortDirection.Desc
                        ? orderedQuery.ThenByDescending(expr)
                        : orderedQuery.ThenBy(expr);
                }
            }

            return orderedQuery ?? query;
        }
    }
}
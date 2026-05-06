

using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Linq.Expressions;

namespace BSS_API.Repositories.Interface
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll(Expression<Func<T, bool>>? filter = null, string? includeProperties = null, bool tracked = false);
        T Get(Expression<Func<T, bool>> filter, string? includeProperties = null, bool tracked = false);
        void Add(T entity);
        bool Any(Expression<Func<T, bool>> filter);
        void Remove(T entity);
        void Update(T entity);
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null, bool tracked = false);
        Task<T?> GetAsync(Expression<Func<T, bool>> filter, string? includeProperties = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, bool tracked = false);
        Task AddAsync(T entity);
        Task<bool> AnyAsync(Expression<Func<T, bool>> filter);
        Task<IDbContextTransaction> BeginTransactionAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted, CancellationToken ct = default);
        Task ExecuteInTransactionAsync(Func<Task> action, IsolationLevel isolationLevel = IsolationLevel.ReadCommitted, CancellationToken ct = default);
        Task<TResult> ExecuteInTransactionAsync<TResult>(Func<Task<TResult>> action, IsolationLevel isolationLevel = IsolationLevel.ReadCommitted, CancellationToken ct = default);
        Task<List<T>> GetListAsync();
        Task AddManyAsync(List<T> entities);
        Task<T> AddAsyncResult(T entity);
        Task RemoveManyAsync(List<T> entities);
        Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> filter);
        Task<T?> GetFirstOrDefaultAsNoTrackingAsync(Expression<Func<T, bool>> filter);
        Task<T?> GetFirstOrDefaultAsNoTrackingAsync(
            Expression<Func<T, bool>> filter,
            params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetManyAsync(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, int skip = 0, int take = 0);
        Task<(List<T> res, int count)> GetManyWithCountAsync(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, int skip = 0, int take = 0);
        Task<List<T>> GetListAsyncByCondition(Expression<Func<T, bool>> filter);
        Task<List<T>> GetListAsyncByConditionAsNoTracking(Expression<Func<T, bool>> filter);
        Task<List<T>> GetListAsyncByCondition(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetListAsyncByConditionAsNoTracking(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);
         

    }
}

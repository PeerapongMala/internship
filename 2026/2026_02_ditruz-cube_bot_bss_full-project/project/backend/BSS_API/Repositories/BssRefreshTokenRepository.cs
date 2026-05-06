using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml.Office;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace BSS_API.Repositories
{
    public class BssRefreshTokenRepository : GenericRepository<BssTransactionRefreshToken>, IBssRefreshTokenRepository
    {
        private readonly ApplicationDbContext _db;

        public BssRefreshTokenRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<BssGenerateRefreshTokenResult?> CreateRefreshTokenAsync(CreateRefreshTokenRequest request)
        {
            var result = new BssGenerateRefreshTokenResult();
            var currentDate = DateTime.Now;
            var refreshToken = TokenHelper.GenerateRefreshToken();
            var hashToken = TokenHelper.HashToken(refreshToken);

            result.RefreshToken = refreshToken;
            result.TokenHash = hashToken;

            var tokenEntity = await _db.BssTransactionRefreshTokens
                .Where(x => x.UserId == request.UserId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (tokenEntity == null)
            {
                var entity = new BssTransactionRefreshToken
                {
                    UserId = request.UserId,
                    TokenHash = hashToken,
                    ExpiresAt = currentDate.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble()),
                    IpAddress = request.IpAddress ?? string.Empty,
                    IsRevoked = false,
                    CreatedAt = currentDate
                };

                await _db.BssTransactionRefreshTokens.AddAsync(entity);
                await _db.SaveChangesAsync();

                #region /* Set Result */

                result.Id = entity.RefreshTokenId;
                result.UserId = entity.UserId;
                result.ExpiresAt = entity.ExpiresAt;
                result.IpAddress = entity.IpAddress;
                result.IsRevoked = entity.IsRevoked;
                result.CreatedAt = entity.CreatedAt;

                #endregion /* Set Result */
            }
            else
            {
                // update บาง field
                tokenEntity.IpAddress = request.IpAddress ?? string.Empty;
                tokenEntity.TokenHash = hashToken;
                tokenEntity.ExpiresAt = currentDate.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble());
                tokenEntity.IsRevoked = false;
                tokenEntity.RevokedAt = null;
                await _db.SaveChangesAsync();

                #region /* Set Result */

                result.Id = tokenEntity.RefreshTokenId;
                result.UserId = tokenEntity.UserId;
                result.ExpiresAt = tokenEntity.ExpiresAt;
                result.IpAddress = tokenEntity.IpAddress;
                result.IsRevoked = tokenEntity.IsRevoked;
                result.CreatedAt = tokenEntity.CreatedAt;

                #endregion /* Set Result */

            }

            #region /* Insert User Login Log */

            var entityLoginNew = new TransactionUserLoginLog
            {
                DepartmentId = request.DepartmentId,
                UserId = request.UserId,
                MachineId = null,
                FirstLogin = currentDate,
                LastLogin = currentDate,
                Remark = null,
                IsActive = true,
                CreatedBy = request.UserId,
                CreatedDate = currentDate
            };

            await _db.TransactionUserLoginLogs.AddAsync(entityLoginNew);
            await _db.SaveChangesAsync();

            #endregion /* Insert User Login Log */

            return result;
        }

        public async Task<BssGenerateRefreshTokenResult?> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request)
        {
            var result = new BssGenerateRefreshTokenResult();

            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return null;

            var hashToken = TokenHelper.HashToken(request.RefreshToken);

            var tokenEntity = await _db.BssTransactionRefreshTokens
                 .Where(x => x.TokenHash == hashToken)
                 .FirstOrDefaultAsync();

            if (tokenEntity == null)
                return null;

            if (tokenEntity.IsRevoked)
                return null;

            if (tokenEntity.ExpiresAt < DateTime.Now)
                return null;

            var currentDate = DateTime.Now;


            // ROTATION
            //tokenEntity.IsRevoked = true;
            //tokenEntity.RevokedAt = DateTime.Now;

            var newRefreshToken = TokenHelper.GenerateRefreshToken();
            var newHashToken = TokenHelper.HashToken(newRefreshToken);

            //var newEntity = new BssTransactionRefreshToken
            //{
            //    UserId = tokenEntity.UserId,
            //    TokenHash = newHashToken,
            //    ExpiresAt = DateTime.Now.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble()),
            //    IpAddress = tokenEntity.IpAddress ?? string.Empty,
            //    IsRevoked = false,
            //    CreatedAt = DateTime.Now
            //};

            //await _db.BssTransactionRefreshTokens.AddAsync(newEntity);

            tokenEntity.TokenHash = hashToken;
            tokenEntity.ExpiresAt = currentDate.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble());
            tokenEntity.IsRevoked = false;
            tokenEntity.RevokedAt = null;

            await _db.SaveChangesAsync();

            result.Id = tokenEntity.RefreshTokenId;
            result.UserId = tokenEntity.UserId;
            result.RefreshToken = newRefreshToken;
            result.TokenHash = newHashToken;
            result.ExpiresAt = tokenEntity.ExpiresAt;
            result.IpAddress = tokenEntity.IpAddress;
            result.IsRevoked = tokenEntity.IsRevoked;
            result.CreatedAt = tokenEntity.CreatedAt;

            return result;
        }

        public async Task<BssGenerateRefreshTokenResult?> LogoutAndRevokeAsync(LogoutAndRevokeRequest request)
        {
            var result = new BssGenerateRefreshTokenResult();

            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return null;

            var hashToken = TokenHelper.HashToken(request.RefreshToken);

            var tokenEntity = await _db.BssTransactionRefreshTokens
                .Where(x => x.TokenHash == hashToken)
                .FirstOrDefaultAsync();


            var currentDate = DateTime.Now;

            if (tokenEntity == null)
            {
                return null;
            }
            else
            {
                tokenEntity.IsRevoked = true;
                tokenEntity.RevokedAt = currentDate;

                var userLoginLog = _db.TransactionUserLoginLogs.Where(item => item.UserId == tokenEntity.UserId && item.IsActive == true);

                await userLoginLog.ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.IsActive, false)
                     .SetProperty(x => x.UpdatedBy, tokenEntity.UserId)
                     .SetProperty(x => x.UpdatedDate, currentDate));

                await _db.SaveChangesAsync();

                result.Id = tokenEntity.RefreshTokenId;
                result.UserId = tokenEntity.UserId;
                result.RefreshToken = request.RefreshToken;
                result.TokenHash = tokenEntity.TokenHash;
                result.ExpiresAt = tokenEntity.ExpiresAt;
                result.IpAddress = tokenEntity.IpAddress;
                result.IsRevoked = tokenEntity.IsRevoked;
                result.CreatedAt = tokenEntity.CreatedAt;
            }

            return result;
        }

        public async Task<IEnumerable<BssGenerateRefreshTokenResult>> GetRefreshTokenListByUserIdAsync(int userId)
        {

            var queryData = await _db.BssTransactionRefreshTokens
                .Include(d => d.MasterUser)
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new BssGenerateRefreshTokenResult
                {
                    Id = x.RefreshTokenId,
                    UserId = x.UserId,
                    TokenHash = x.TokenHash,
                    ExpiresAt = x.ExpiresAt,
                    IpAddress = x.IpAddress,
                    IsRevoked = x.IsRevoked,
                    CreatedAt = x.CreatedAt
                }).ToListAsync();

            return queryData;
        }

        public async Task<BssGenerateRefreshTokenResult?> GetLastRefreshTokenByUserIdAsync(int userId)
        {

            var queryData = await _db.BssTransactionRefreshTokens
                .Include(d => d.MasterUser)
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new BssGenerateRefreshTokenResult
                {
                    Id = x.RefreshTokenId,
                    UserId = x.UserId,
                    TokenHash = x.TokenHash,
                    ExpiresAt = x.ExpiresAt,
                    IpAddress = x.IpAddress,
                    IsRevoked = x.IsRevoked,
                    CreatedAt = x.CreatedAt
                }).FirstOrDefaultAsync();

            return queryData;
        }
    }
}

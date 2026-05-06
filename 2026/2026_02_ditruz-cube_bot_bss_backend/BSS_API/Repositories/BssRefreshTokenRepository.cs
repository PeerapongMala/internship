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

            var refreshToken = TokenHelper.GenerateRefreshToken();
            var hashToken = TokenHelper.HashToken(refreshToken);

            var entity = new BssTransactionRefreshToken
            {
                UserId = request.UserId,
                TokenHash = hashToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IpAddress = request.IpAddress ?? string.Empty,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            };

            await _db.BssTransactionRefreshTokens.AddAsync(entity);
            await _db.SaveChangesAsync();

            result.Id = entity.RefreshTokenId;
            result.UserId = entity.UserId;
            result.RefreshToken = refreshToken;
            result.TokenHash = hashToken;
            result.ExpiresAt = entity.ExpiresAt;
            result.IpAddress = request.IpAddress;
            result.IsRevoked = entity.IsRevoked;
            result.CreatedAt = entity.CreatedAt;

            return result;
        }

        public async Task<BssGenerateRefreshTokenResult?> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request)
        {
            var result = new BssGenerateRefreshTokenResult();

            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return null;

            var hashToken = TokenHelper.HashToken(request.RefreshToken);

            var tokenEntity = await _db.BssTransactionRefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hashToken);
            if (tokenEntity == null)
                return null;

            if (tokenEntity.IsRevoked)
            {
                // Reuse Detection
                if (tokenEntity != null)
                {
                    var userTokens = _db.BssTransactionRefreshTokens
                        .Where(x => x.UserId == tokenEntity.UserId);

                    await userTokens.ExecuteUpdateAsync(s =>
                        s.SetProperty(x => x.IsRevoked, true)
                         .SetProperty(x => x.RevokedAt, DateTime.UtcNow));
                }

                return null;
            }

            if (tokenEntity.ExpiresAt < DateTime.UtcNow)
                return null;


            // ROTATION
            tokenEntity.IsRevoked = true;
            tokenEntity.RevokedAt = DateTime.UtcNow;

            var newRefreshToken = TokenHelper.GenerateRefreshToken();
            var newHashToken = TokenHelper.HashToken(newRefreshToken);

            var newEntity = new BssTransactionRefreshToken
            {
                UserId = tokenEntity.UserId,
                TokenHash = newHashToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IpAddress = tokenEntity.IpAddress ?? string.Empty,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            };

            await _db.BssTransactionRefreshTokens.AddAsync(newEntity);
            await _db.SaveChangesAsync();

            result.Id = newEntity.RefreshTokenId;
            result.UserId = newEntity.UserId;
            result.RefreshToken = newRefreshToken;
            result.TokenHash = newHashToken;
            result.ExpiresAt = newEntity.ExpiresAt;
            result.IpAddress = newEntity.IpAddress;
            result.IsRevoked = newEntity.IsRevoked;
            result.CreatedAt = newEntity.CreatedAt;

            return result;
        }

        public async Task<BssGenerateRefreshTokenResult?> LogoutAndRevokeAsync(LogoutAndRevokeRequest request)
        {
            var result = new BssGenerateRefreshTokenResult();

            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return null;

            var hashToken = TokenHelper.HashToken(request.RefreshToken);

            var tokenEntity = await _db.BssTransactionRefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hashToken);
            if (tokenEntity == null)
            {
                return null;
            }
            else
            {
                tokenEntity.IsRevoked = true;
                tokenEntity.RevokedAt = DateTime.UtcNow;

                var userLoginLog = _db.TransactionUserLoginLogs.Where(item => item.UserId == tokenEntity.UserId &&  item.IsActive == true);

                await userLoginLog.ExecuteUpdateAsync(s =>
                    s.SetProperty(x => x.IsActive, false)
                     .SetProperty(x => x.UpdatedBy, tokenEntity.UserId)
                     .SetProperty(x => x.UpdatedDate, DateTime.UtcNow));

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

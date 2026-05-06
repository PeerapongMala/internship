using System.Data;
using System.Data.Common;
using BSS_API.Models;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace BSS_API.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _db;

        #region SystemMail

        public IBssTransactionNotificationRepository BssTransactionNotificationRepository { get; }

        public IBssTransactionNotiRecipientRepository BssTransactionNotiRecipientRepository { get; }

        #endregion SystemMail

        public IMasterRoleRepository RoleRepos { get; private set; }
        public IMasterUserRepository UserRepos { get; private set; }
        public IMasterMenuRepository MenuRepos { get; private set; }
        public IMasterUserRoleRepository UserRoleRepos { get; private set; }
        public IMasterRolePermissionRepository RolePermissionRepos { get; private set; }
        public ICbmsTransactionRepository CbmsTransactionRepos { get; private set; }
        public IMasterDepartmentRepository DepartmentRepos { get; private set; }
        public IMasterCashTypeRepository CashtypeRepos { get; private set; }
        public IMasterInstitutionRepository InstitutionRepos { get; private set; }
        public IMasterMachineTypeRepository MachineTypeRepos { get; private set; }
        public IMasterMachineRepository MachineRepos { get; private set; }
        public IMasterDenominationRepository DenominationRepos { get; private set; }
        public IMasterDenomReconcileRepository DenomReconcileRepos { get; private set; }
        public IMasterShiftRepository ShiftRepos { get; private set; }
        public IMasterConfigRepository ConfigRepos { get; private set; }
        public IMasterConfigTypeRepository ConfigTypeRepos { get; private set; }
        public IMasterBanknoteTypeRepository BanknoteTypeRepos { get; private set; }
        public IMasterBanknoteTypeSendRepository BanknoteTypeSendRepos { get; private set; }
        public IMasterMSevenOutputRepository MSevenOutputRepos { get; private set; }
        public IMasterCompanyRepository CompanyRepos { get; private set; }
        public IMasterCashCenterRepository CashCenterRepos { get; private set; }
        public IMasterStatusRepository StatusRepos { get; private set; }
        public IMasterCashPointRepository CashPointRepos { get; private set; }
        public IMasterMSevenQualityRepository MSevenQualityRepos { get; private set; }
        public IMasterMSevenDenomRepository MSevenDenomRepos { get; private set; }
        public ITransactionRegisterUnsortRepository TransactionRegisterUnsortRepos { get; private set; }
        public ITransactionUnsortCCRepository TransactionUnsortCCRepos { get; private set; }
        public IMasterRoleGroupRepository RoleGroupRepos { get; private set; }
        public IMasterUserHistoryRepository UserHistoryRepos { get; private set; }
        public ITransactionUserLoginLogRepository TransUserLoginLogRepos { get; private set; }
        public IMasterCompanyDepartmentRepository CompanyDepartmentRepos { get; private set; }
        public IMasterCompanyInstitutionRepository CompanyInstitutionRepos { get; private set; }
        public IMasterSeriesDenomRepository SeriesDenomRepos { get; private set; }
        public IMasterMSevendenomSeriesRepository MSevendenomSeriesRepos { get; private set; }
        public IMasterZoneRepository ZoneRepos { get; private set; }
        public ITransactionApiLogRepository TransactionApiLogRepos { get; private set; }
        public IMasterZoneCashpointRepository ZoneCashpointRepos { get; private set; }
        public ITransactionPreparationRepository TransactionPreparationRepos { get; private set; }
        public ITransactionContainerPrepareRepository TransactionContainerPrepareRepos { get; private set; }
        public ITransactionReconcileTranRepository TransactionReconcileTranRepos { get; private set; }
        public ITransactionApproveManualKeyInTranRepository TransactionApproveManualKeyInTranRepos { get; private set; }
        public ITransactionVerifyTranRepository TransactionVerifyTranRepos { get; private set; }
        public ITransactionRevokeTranRepository TransactionRevokeTranRepos { get; private set; }
        public ITransactionReconciliationTranRepository TransactionReconciliationTranRepos { get; private set; }
        public ITransactionReconciliationRepository TransactionReconciliationRepos { get; private set; }
        public ITransactionReconcileTmpRepository TransactionReconcileTmpRepos { get; private set; }
        public IMasterSendUnsortSequenceRepository MasterSendUnsortSequenceRepos { get; }

        public IBssTransactionContainerSequenceRepository BssTransactionContainerSequenceRepos { get; }
        public ITransactionSendUnsortDataRepository TransactionSendUnsortDataRepos { get; private set; }
        public ITransactionSendUnsortCCRepository TransactionSendUnsortCCRepos { get; private set; }
        public ITransactionSendUnsortCCHistoryRepository TransactionSendUnsortCCHistoryRepos { get; private set; }
        public ITransactionSendUnsortDataHistoryRepository TransactionSendUnsortDataHistoryRepos { get; private set; }
        public ITransactionUnsortCCHistoryRepository TransactionUnsortCCHistoryRepos { get; private set; }
         public IBssRefreshTokenRepository BssRefreshTokenRepos { get; private set; }
        public ITransactionSourceFileRepository TransactionSourceFileRepos { get; private set; }
        public ITransactionMachineHdRepository TransactionMachineHdRepos { get; private set; }
        public ITransactionMachineHdDataRepository TransactionMachineHdDataRepos { get; private set; }
        public IAutoSellingRepository AutoSellingRepos { get; private set; }
        public ITransactionImportHcTmpRepository TransactionImportHcTmpRepos { get; private set; }


        #region Transaction

        private IDbConnection? _connection;

        public IDbConnection GetDbConnection()
        {
            try
            {
                if (_connection == null)
                {
                    _connection = _db.Database.GetDbConnection();
                    _connection.Open();
                }

                return _connection;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public IDbTransaction GetDbTransaction(IDbConnection connection,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
        {
            try
            {
                if (connection == null)
                {
                    throw new ArgumentNullException(nameof(connection));
                }

                var transaction = connection.BeginTransaction();
                _db.Database.UseTransaction((DbTransaction)transaction);
                return transaction;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public IDbContextTransaction ContextTransaction(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
        {
            try
            {
                return _db.Database.BeginTransaction(isolationLevel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Commit(IDbTransaction transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            try
            {
                if (_connection != null && _connection.State == ConnectionState.Open)
                {
                    transaction.Commit();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (_connection != null && _connection.State == ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        public void Commit(IDbContextTransaction? transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            try
            {
                _db.SaveChanges();
                transaction.Commit();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task CommitAsync(IDbContextTransaction? transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            try
            {
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Rollback(IDbTransaction? transaction)
        {
            try
            {
                if (transaction != null && _connection != null && _connection.State == ConnectionState.Open)
                {
                    transaction.Rollback();
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (_connection != null && _connection.State == ConnectionState.Open)
                {
                    _connection.Close();
                }
            }
        }

        public void Rollback(IDbContextTransaction? transaction)
        {
            try
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task RollbackAsync(IDbContextTransaction? transaction)
        {
            try
            {
                if (transaction != null)
                {
                    await transaction.RollbackAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion Transaction

        public UnitOfWork(ApplicationDbContext db)
        {
            this._db = db;

            #region SystemMail

            BssTransactionNotificationRepository = new BssTransactionNotificationRepository(_db);
            BssTransactionNotiRecipientRepository = new BssTransactionNotiRecipientRepository(_db);

            #endregion SystemMail

            RoleRepos = new MasterRoleRepository(db);
            UserRepos = new MasterUserRepository(db);
            MenuRepos = new MasterMenuRepository(db);
            UserRoleRepos = new MasterUserRoleRepository(db);
            RolePermissionRepos = new MasterRolePermissionRepository(db);
            CbmsTransactionRepos = new CbmsTransactionRepository(db);
            DepartmentRepos = new MasterDepartmentRepository(db);
            CashtypeRepos = new MasterCashTypeRepository(db);
            InstitutionRepos = new MasterInstitutionRepository(db);
            MachineRepos = new MasterMachineRepository(db);
            MachineTypeRepos = new MasterMachineTypeRepository(db);
            DenominationRepos = new MasterDenominationRepository(db);
            DenomReconcileRepos = new MasterDenomReconcileRepository(db);
            ShiftRepos = new MasterShiftRepository(db);
            ConfigRepos = new MasterConfigRepository(db);
            ConfigTypeRepos = new MasterConfigTypeRepository(db);
            BanknoteTypeRepos = new MasterBanknoteTypeRepository(db);
            BanknoteTypeSendRepos = new MasterBanknoteTypeSendRepository(db);
            MSevenOutputRepos = new MasterMSevenOutputRepository(db);
            CompanyRepos = new MasterCompanyRepository(db);
            CashCenterRepos = new MasterCashCenterRepository(db);
            StatusRepos = new MasterStatusRepository(db);
            CashPointRepos = new MasterCashPointRepository(db);
            MSevenQualityRepos = new MasterMSevenQualityRepository(db);
            MSevenDenomRepos = new MasterMSevenDenomRepository(db);
            TransactionRegisterUnsortRepos = new TransactionRegisterUnsortRepository(db);
            TransactionUnsortCCRepos = new TransactionUnsortCCRepository(db);
            RoleGroupRepos = new MasterRoleGroupRepository(db);
            UserHistoryRepos = new MasterUserHistoryRepository(db);
            TransUserLoginLogRepos = new TransactionUserLoginLogRepository(db);
            CompanyDepartmentRepos = new MasterCompanyDepartmentRepository(db);
            CompanyInstitutionRepos = new MasterCompanyInstitutionRepository(db);
            SeriesDenomRepos = new MasterSeriesDenomRepository(db);
            MSevendenomSeriesRepos = new MasterMSevendenomSeriesRepository(db);
            ZoneRepos = new MasterZoneRepository(db);
            TransactionApiLogRepos = new TransactionApiLogRepository(db);
            ZoneCashpointRepos = new MasterZoneCashpointRepository(db);
            TransactionPreparationRepos = new TransactionPreparationRepository(db);
            TransactionContainerPrepareRepos = new TransactionContainerPrepareRepository(db);
            TransactionReconcileTranRepos = new TransactionReconcileTranRepository(db);
            TransactionApproveManualKeyInTranRepos = new TransactionApproveManualKeyInTranRepository(db);
            TransactionVerifyTranRepos = new TransactionVerifyTranRepository(db);
            TransactionRevokeTranRepos = new TransactionRevokeTranRepository(db);
            TransactionReconciliationTranRepos = new TransactionReconciliationTranRepository(db);
            TransactionReconciliationRepos = new TransactionReconciliationRepository(db);
            TransactionReconcileTmpRepos = new TransactionReconcileTmpRepository(db);
            MasterSendUnsortSequenceRepos = new MasterSendUnsortSequenceRepository(db);
            BssTransactionContainerSequenceRepos = new BssTransactionContainerSequenceRepository(db);
            TransactionSendUnsortDataRepos = new TransactionSendUnsortDataRepository(db);
            TransactionSendUnsortCCRepos = new TransactionSendUnsortCCRepository(db);
            TransactionSendUnsortCCHistoryRepos = new TransactionSendUnsortCCHistoryRepository(db);
            TransactionSendUnsortDataHistoryRepos = new TransactionSendUnsortDataHistoryRepository(db);
            TransactionUnsortCCHistoryRepos = new TransactionUnsortCCHistoryRepository(db);
            BssRefreshTokenRepos = new BssRefreshTokenRepository(db);
            TransactionSourceFileRepos = new TransactionSourceFileRepository(db);
            TransactionMachineHdRepos = new TransactionMachineHdRepository(db);
            TransactionMachineHdDataRepos = new TransactionMachineHdDataRepository(db);
            AutoSellingRepos = new AutoSellingRepository(db);
            TransactionImportHcTmpRepos = new TransactionImportHcTmpRepository(db);
        }


        public void SaveChange()
        {
            _db.SaveChanges();
        }

        public async Task SaveChangeAsync()
        {
            await _db.SaveChangesAsync();
        }

        public void ClearChangeTracker()
        {
            _db.ChangeTracker.Clear();
        }

        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action)
        {
            var strategy = _db.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                await using var tx = await _db.Database.BeginTransactionAsync();
                try
                {
                    var result = await action();
                    await tx.CommitAsync();
                    return result;
                }
                catch (Exception ex)
                {
                    await tx.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<T> ExecuteWithTransactionAsync<T>(Func<Task<T>> action)
        {
            var strategy = _db.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () => await action());
        }
    }
}
namespace BSS_API.Models
{
    using Entities;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        #region SystemMail

        public DbSet<BssTransactionNotification> BssTransactionNotification { get; set; }

        public DbSet<BssTransactionNotiRecipient> BssTransactionNotiRecipient { get; set; }

        #endregion SystemMail

        #region MasterDataTable

        public DbSet<TransactionApiLog> TransactionApiLog { get; set; }

        public DbSet<MasterSendUnsortSequence> MasterSendUnsortSequence { get; set; }
        public DbSet<BssTransactionContainerSequence> BssTransactionContainerSequence { get; set; }

        public DbSet<MasterCompany> MasterCompanys { get; set; }
        public DbSet<MasterDepartment> MasterDepartments { get; set; }
        public DbSet<MasterCompanyDepartment> MasterCompanyDepartment { get; set; }
        public DbSet<MasterRoleGroup> MasterRoleGroups { get; set; }
        public DbSet<MasterRole> MasterRoles { get; set; }
        public DbSet<MasterMenu> MasterMenus { get; set; }
        public DbSet<MasterUser> MasterUsers { get; set; }
        public DbSet<MasterUserRole> MasterUserRoles { get; set; }
        public DbSet<MasterRolePermission> MasterRolePermissions { get; set; }
        public DbSet<MasterCashType> MasterCashTypes { get; set; }
        public DbSet<MasterInstitution> MasterInstitutions { get; set; }
        public DbSet<MasterMachineType> MasterMachineTypes { get; set; }
        public DbSet<MasterDenomination> MasterDenominations { get; set; }
        public DbSet<MasterShift> MasterShifts { get; set; }
        public DbSet<MasterBanknoteType> MasterBanknoteTypes { get; set; }
        public DbSet<MasterBanknoteTypeSend> MasterBanknoteTypesSend { get; set; }
        public DbSet<MasterStatus> MasterStatuses { get; set; }
        public DbSet<MasterMSevenOutput> MasterMSevenOutputs { get; set; }
        public DbSet<MasterCashPoint> MasterCashPoints { get; set; }
        public DbSet<MasterCashCenter> MasterCashCenters { get; set; }
        public DbSet<MasterConfig> MasterConfigs { get; set; }
        public DbSet<MasterConfigType> MasterConfigTypes { get; set; }
        public DbSet<MasterMachine> MasterMachine { get; set; }
        public DbSet<MasterDenomReconcile> DenomReconcile { get; set; }
        public DbSet<MasterMSevenQuality> MasterMSevenQuality { get; set; }
        public DbSet<MasterMSevenDenom> MasterMSevenDenom { get; set; }
        public DbSet<MasterCompanyInstitution> MasterCompanyInstitutions { get; set; }
        public DbSet<MasterSeriesDenom> MasterSeriesDenoms { get; set; }
        public DbSet<MasterMSevendenomSeries> MasterMSevendenomSeries { get; set; }
        public DbSet<MasterZone> MasterZones { get; set; }
        public DbSet<MasterZoneCashpoint> MasterZoneCashpoints { get; set; }
        public DbSet<MasterUserHistory> MasterUserHistorys { get; set; }

        #endregion MasterDataTable

        #region TransactionPreparation

        public DbSet<TransOperationLog> TransOperationLogs { get; set; }
        public DbSet<TransactionUserLoginLog> TransactionUserLoginLogs { get; set; }
        public DbSet<TransactionRegisterUnsort> TransactionRegisterUnsorts { get; set; }
        public DbSet<TransactionUnsortCC> TransactionUnsortCCs { get; set; }
        public DbSet<ReceiveCbmsDataTransaction> ReceiveCbmsDataTransactions { get; set; }
        public DbSet<TransactionPreparation> TransactionPreparation { get; set; }
        public DbSet<TransactionContainerPrepare> TransactionContainerPrepares { get; set; }

        #endregion TransactionPreparation

        #region TransactionRegisterUnsort

        public DbSet<TransactionSendUnsortCC> TransactionSendUnsortCCs { get; set; }
        public DbSet<TransactionSendUnsortData> TransactionSendUnsortDatas { get; set; }
        public DbSet<TransactionSendUnsortCCHistory> TransactionSendUnsortCCHistorys { get; set; }
        public DbSet<TransactionSendUnsortDataHistory> TransactionSendUnsortDataHistorys { get; set; }
        public DbSet<TransactionUnsortCCHistory> TransactionUnsortCCHistorys { get; set; }

        #endregion TransactionRegisterUnsort

        #region TransactionMachineData

        public DbSet<TransactionSourceFile> TransactionSourceFiles { get; set; }
        public DbSet<TransactionMachineHd> TransactionMachineHds { get; set; }
        public DbSet<TransactionMachineHdData> TransactionMachineHdDatas { get; set; }
        public DbSet<TransactionImportHcTmp> TransactionImportHcTmps { get; set; }

        #endregion TransactionMachineData

        #region TransactionReconcile

        public DbSet<TransactionReconcileTran> TransactionReconcileTran { get; set; }
        public DbSet<TransactionReconcile> TransactionReconcile { get; set; }

        #endregion TransactionReconcile

        #region BssAuthentication
        public DbSet<BssTransactionRefreshToken> BssTransactionRefreshTokens { get; set; }

        #endregion BssAuthentication

        #region TransactionApproveManualKeyIn

        public DbSet<TransactionApproveManualKeyInTran> TransactionApproveManualKeyInTran { get; set; }
        public DbSet<TransactionApproveManualKeyIn> TransactionApproveManualKeyIn { get; set; }

        #endregion TransactionApproveManualKeyIn

        #region TransactionManualKeyIn

        public DbSet<TransactionManualTmp> TransactionManualTmp { get; set; }
        public DbSet<TransactionManualHistory> TransactionManualHistory { get; set; }

        #endregion TransactionManualKeyIn

        #region TransactionReconcileTmp

        public DbSet<TransactionReconcileTmp> TransactionReconcileTmp { get; set; }
        public DbSet<TransactionReconcileHcTmp> TransactionReconcileHcTmp { get; set; }

        #endregion TransactionReconcileTmp

        #region TransactionVerify

        public DbSet<TransactionVerifyTran> TransactionVerifyTran { get; set; }
        public DbSet<TransactionVerify> TransactionVerify { get; set; }

        #endregion TransactionVerify

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region MasterData

            modelBuilder.Entity<MasterConfig>()
                .HasOne(x => x.ConfigType)
                .WithMany(x => x.Configs)
                .HasForeignKey(x => x.ConfigTypeId);

            #endregion MasterData

            #region SystemUser

            modelBuilder.Entity<MasterUserRole>()
                .HasKey(x => new { x.UserId, x.RoleGroupId });

            modelBuilder.Entity<MasterUserRole>()
                .HasOne(x => x.MasterUser)
                .WithMany(u => u.MasterUserRole)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<MasterUserRole>()
                .HasOne(x => x.MasterRoleGroup)
                .WithMany(r => r.MasterUserRole)
                .HasForeignKey(x => x.RoleGroupId);

            modelBuilder.Entity<MasterRole>()
                .HasOne(x => x.MasterRoleGroup)
                .WithMany(x => x.MasterRole)
                .HasForeignKey(x => x.RoleGroupId);

            modelBuilder.Entity<MasterUser>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.MasterUser)
                .HasForeignKey(x => x.DepartmentId);

            #endregion SystemUser

            modelBuilder.Entity<TransactionApiLog>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionApiLog)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<TransactionUserLoginLog>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionUserLoginLog)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<TransactionUserLoginLog>()
                .HasOne(x => x.UserLogin)
                .WithMany(x => x.TransactionUserLoginLog)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<TransactionUserLoginLog>()
                .HasOne(x => x.MasterMachine)
                .WithMany(x => x.TransactionUserLoginLog)
                .HasForeignKey(x => x.MachineId);

            #region SystemMailNotification

            modelBuilder.Entity<BssTransactionNotiRecipient>()
                .HasOne(u => u.BssTransactionNotification)
                .WithOne(c => c.BssTransactionNotiRecipient)
                .HasForeignKey<BssTransactionNotiRecipient>(u => u.NotificationId)
                .IsRequired(false);

            modelBuilder.Entity<BssTransactionNotiRecipient>()
                .HasOne(x => x.MasterUser)
                .WithMany(x => x.BssTransactionNotiRecipient)
                .HasForeignKey(x => x.UserId);

            #endregion SystemMailNotification

            #region ReceiveCbmsData

            modelBuilder.Entity<ReceiveCbmsDataTransaction>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.ReceiveCbmsDataTransactions)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<ReceiveCbmsDataTransaction>()
                .HasOne(x => x.MasterInstitution)
                .WithMany(x => x.ReceiveCbmsDataTransactions)
                .HasForeignKey(x => x.InstitutionId);

            modelBuilder.Entity<ReceiveCbmsDataTransaction>()
                .HasOne(x => x.MasterDenomination)
                .WithMany(x => x.ReceiveCbmsDataTransactions)
                .HasForeignKey(x => x.DenominationId);

            #endregion ReceiveCbmsData

            #region TransactionPreparation

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.TransactionContainerPrepare)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.ContainerPrepareId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterInstitution)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.InstId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterCashCenter)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.CashcenterId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterZone)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.ZoneId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterCashPoint)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.CashpointId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterDenomination)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.DenoId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.MasterStatus)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.StatusId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy)
                .HasPrincipalKey(u => u.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.UpdatedByUser)
                .WithMany()
                .HasForeignKey(x => x.UpdatedBy)
                .HasPrincipalKey(u => u.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionContainerPrepare>()
                .HasOne(x => x.ReceiveCbmsDataTransaction)
                .WithMany(x => x.TransactionContainerPrepares)
                .HasForeignKey(x => x.ReceiveId);

            modelBuilder.Entity<TransactionContainerPrepare>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionContainerPrepares)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<TransactionContainerPrepare>()
                .HasOne(x => x.MasterMachine)
                .WithMany(x => x.TransactionContainerPrepares)
                .HasForeignKey(x => x.MachineId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.TransactionUnsortCC)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.TransactionUnsortCCId);

            modelBuilder.Entity<TransactionPreparation>()
                .HasOne(x => x.TransactionContainerPrepare)
                .WithMany(x => x.TransactionPreparation)
                .HasForeignKey(x => x.ContainerPrepareId);

            modelBuilder.Entity<TransactionContainerPrepare>()
                .HasOne(x => x.MasterBanknoteType)
                .WithMany(x => x.TransactionContainerPrepares)
                .HasForeignKey(x => x.BntypeId);

            #endregion TransactionPreparation

            #region TransactionRegisterUnsort

            modelBuilder.Entity<TransactionRegisterUnsort>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionRegisterUnsorts)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<TransactionRegisterUnsort>()
                .HasOne(x => x.MasterStatus)
                .WithMany(x => x.TransactionRegisterUnsorts)
                .HasForeignKey(x => x.StatusId);

            modelBuilder.Entity<TransactionRegisterUnsort>()
                .HasOne(x => x.MasterStatus)
                .WithMany(x => x.TransactionRegisterUnsorts)
                .HasForeignKey(x => x.StatusId);

            modelBuilder.Entity<TransactionRegisterUnsort>()
                .HasOne(x => x.CreatedUser)
                .WithMany(x => x.TransactionRegisterUnsort)
                .HasForeignKey(x => x.CreatedBy);

            modelBuilder.Entity<TransactionUnsortCC>()
                .HasOne(x => x.TransactionRegisterUnsort)
                .WithMany(x => x.TransactionUnsortCCs)
                .HasForeignKey(x => x.RegisterUnsortId);

            modelBuilder.Entity<TransactionUnsortCC>()
                .HasOne(x => x.MasterInstitution)
                .WithMany(x => x.TransactionUnsortCCs)
                .HasForeignKey(x => x.InstId);

            modelBuilder.Entity<TransactionUnsortCC>()
                .HasOne(x => x.MasterDenomination)
                .WithMany(x => x.TransactionUnsortCCs)
                .HasForeignKey(x => x.DenoId);

            modelBuilder.Entity<TransactionUnsortCC>()
                .HasOne(x => x.CreatedByUser)
                .WithMany(x => x.TransactionUnsortCC)
                .HasForeignKey(x => x.CreatedBy);

            #endregion TransactionRegisterUnsort

            #region TransactionSendUnsortData

            modelBuilder.Entity<TransactionSendUnsortData>()
                .HasOne(u => u.TransactionRegisterUnsort)
                .WithOne(c => c.TransactionSendUnsortData)
                .HasForeignKey<TransactionSendUnsortData>(u => u.RegisterUnsortId)
                .IsRequired(false);

            modelBuilder.Entity<TransactionSendUnsortData>()
                .HasOne(x => x.TransactionSendUnsortCC)
                .WithMany(x => x.TransactionSendUnsortData)
                .HasForeignKey(x => x.SendUnsortId);

            #endregion TransactionSendUnsortData

            #region TransactionSendUnsortCCHistory

            modelBuilder.Entity<TransactionSendUnsortCCHistory>()
                .HasOne(u => u.TransactionSendUnsortCC)
                .WithOne(c => c.TransactionSendUnsortCCHistory)
                .HasForeignKey<TransactionSendUnsortCCHistory>(u => u.SendUnsortId)
                .IsRequired(true);

            modelBuilder.Entity<TransactionSendUnsortCCHistory>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionSendUnsortCCHistorys)
                .HasForeignKey(x => x.DepartmentId);

            #endregion TransactionSendUnsortCCHistory

            #region TransactionSendUnsortCC

            modelBuilder.Entity<TransactionSendUnsortCC>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionSendUnsortCCs)
                .HasForeignKey(x => x.DepartmentId);

            modelBuilder.Entity<TransactionSendUnsortCC>()
                .HasOne(x => x.MasterStatus)
                .WithMany(x => x.TransactionSendUnsortCCs)
                .HasForeignKey(x => x.StatusId);

            #endregion TransactionSendUnsortCC

            #region TransactionSendUnsortDataHistory

            modelBuilder.Entity<TransactionSendUnsortDataHistory>()
                .HasOne(x => x.TransactionRegisterUnsort)
                .WithMany(x => x.TransactionSendUnsortDataHistorys)
                .HasForeignKey(x => x.RegisterUnsortId);

            modelBuilder.Entity<TransactionSendUnsortDataHistory>()
                .HasOne(x => x.TransactionSendUnsortCCHistory)
                .WithMany(x => x.TransactionSendUnsortDataHistory)
                .HasForeignKey(x => x.HisUnsortId);

            #endregion TransactionSendUnsortDataHistory

            #region TransactionUnsortCCHistory

            modelBuilder.Entity<TransactionUnsortCCHistory>()
                .HasOne(x => x.TransactionSendUnsortDataHistory)
                .WithMany(x => x.TransactionUnsortCCHistorys)
                .HasForeignKey(x => x.HisDataId);

            modelBuilder.Entity<TransactionUnsortCCHistory>()
                .HasOne(x => x.MasterInstitution)
                .WithMany(x => x.TransactionUnsortCCHistorys)
                .HasForeignKey(x => x.InstId);

            modelBuilder.Entity<TransactionUnsortCCHistory>()
                .HasOne(x => x.MasterDenomination)
                .WithMany(x => x.TransactionUnsortCCHistorys)
                .HasForeignKey(x => x.DenoId);

            #endregion TransactionUnsortCCHistoryv

            #region TransactionMachineData

            modelBuilder.Entity<TransactionSourceFile>()
                .HasOne(x => x.MasterMachine)
                .WithMany()
                .HasForeignKey(x => x.MachineId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionMachineHd>()
                .HasOne(x => x.TransactionSourceFile)
                .WithMany(x => x.TransactionMachineHds)
                .HasForeignKey(x => x.SourceFileId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionMachineHd>()
                .HasOne(x => x.MasterMachine)
                .WithMany()
                .HasForeignKey(x => x.MachineId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionMachineHdData>()
                .HasOne(x => x.TransactionMachineHd)
                .WithMany(x => x.TransactionMachineHdDatas)
                .HasForeignKey(x => x.MachineHdId)
                .OnDelete(DeleteBehavior.NoAction);

            #endregion TransactionMachineData

            #region TransactionReconcile

            modelBuilder.Entity<TransactionReconcileTran>()
                .HasOne(x => x.TransactionPreparation)
                .WithOne(x => x.TransactionReconcileTran)
                .HasForeignKey<TransactionReconcileTran>(x => x.PrepareId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionReconcileTran>()
                .HasOne(x => x.MasterDepartment)
                .WithMany(x => x.TransactionReconcileTran)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionReconcileTran>()
                .HasOne(x => x.TransactionMachineHd)
                .WithMany()
                .HasForeignKey(x => x.MachineHdId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionReconcileTran>()
                .HasOne(x => x.MasterStatus)
                .WithMany(x => x.TransactionReconcileTran)
                .HasForeignKey(x => x.StatusId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionReconcileTran>()
                .HasOne(x => x.MasterShift)
                .WithMany(x => x.TransactionReconcileTran)
                .HasForeignKey(x => x.ShiftId)
                .OnDelete(DeleteBehavior.NoAction);

            #endregion #region TransactionReconcile

            #region BssAuthentication

            modelBuilder.Entity<BssTransactionRefreshToken>()
            .HasOne(x => x.MasterUser)
            .WithMany(x => x.BssTransactionRefreshToken)
            .HasForeignKey(x => x.UserId);

            #endregion BssAuthentication

            #region TransactionManualTmp

            modelBuilder.Entity<TransactionManualTmp>()
                .HasOne(x => x.TransactionReconcileTran)
                .WithMany()
                .HasForeignKey(x => x.ReconcileTranId)
                .OnDelete(DeleteBehavior.NoAction);

            #endregion TransactionManualTmp

            #region TransactionReconcileTmp

            modelBuilder.Entity<TransactionReconcileTmp>()
                .HasOne(x => x.TransactionReconcileTran)
                .WithMany()
                .HasForeignKey(x => x.ReconcileTranId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionReconcileHcTmp>()
                .HasOne(x => x.TransactionReconcileTran)
                .WithMany()
                .HasForeignKey(x => x.ReconcileTranId)
                .OnDelete(DeleteBehavior.NoAction);

            #endregion TransactionReconcileTmp

            #region TransactionVerify

            modelBuilder.Entity<TransactionVerifyTran>()
                .HasOne(x => x.TransactionReconcileTran)
                .WithMany()
                .HasForeignKey(x => x.ReconcileTranId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionVerifyTran>()
                .HasOne(x => x.TransactionPreparation)
                .WithMany()
                .HasForeignKey(x => x.PrepareId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionVerifyTran>()
                .HasOne(x => x.MasterDepartment)
                .WithMany()
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionVerifyTran>()
                .HasOne(x => x.MasterStatus)
                .WithMany()
                .HasForeignKey(x => x.StatusId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionVerifyTran>()
                .HasOne(x => x.MasterShift)
                .WithMany()
                .HasForeignKey(x => x.ShiftId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TransactionVerify>()
                .HasOne(x => x.TransactionVerifyTran)
                .WithMany(x => x.TransactionVerify)
                .HasForeignKey(x => x.VerifyTranId)
                .OnDelete(DeleteBehavior.NoAction);

            #endregion TransactionVerify

            base.OnModelCreating(modelBuilder);
        }
    }
}
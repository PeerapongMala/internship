using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Services;
using AspNetCoreHero.ToastNotification;
using Serilog.Events;
using Serilog;
using Microsoft.AspNetCore.Authentication.Certificate;

namespace BSS_WEB.Infrastructure
{
    public static class ItemServiceCollectionExtensions
    {
        public static IServiceCollection AddItemServices(this IServiceCollection services)
        {

            services.AddOptions();
            //services.AddAuthorization();
            services.AddDistributedMemoryCache();

            //services.AddAuthentication("CustomBssAuthentication")
            //        .AddCookie("CustomBssAuthentication", options =>
            //        {
            //            options.Cookie.HttpOnly = true;
            //            options.Cookie.SecurePolicy = CookieSecurePolicy.None; // ถ้า local http
            //            options.Cookie.SameSite = SameSiteMode.Lax;
            //            options.ExpireTimeSpan = TimeSpan.FromMinutes(AppConfig.JwtExpiryMinutes.AsDouble());
            //            options.LoginPath = "/Login/Index";
            //            options.AccessDeniedPath = "/Login/UnauthorizedPage";
            //        });

            //builder.Services.AddControllersWithViews();
            services.AddControllersWithViews()
                .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null).AddRazorRuntimeCompilation();

            //builder.Services.Configure<AppSetting>(builder.Configuration);
            services.AddScoped<RefreshTokenFilter>();
            //services.AddSignalR();
            services.AddSingleton<BssAdminHub>();
            services.AddSingleton<BssAdminJobs>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpClient<IAppClient, AppClient>();
            services.AddScoped<IAppShare, AppShare>();
            services.AddScoped<IDataAccessService, DataAccessService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IMasterDepartmentService, MasterDepartmentService>();
            services.AddScoped<IMasterCompanyService, MasterCompanyService>();
            services.AddScoped<IMasterCompanyDepartmentService, MasterCompanyDepartmentService>();
            services.AddScoped<IMasterCompanyInstitutionService, MasterCompanyInstitutionService>();
            services.AddScoped<IMasterInstitutionService, MasterInstitutionService>();
            services.AddScoped<IMasterDenominationService, MasterDenominationService>();
            services.AddScoped<IMasterCashTypeService, MasterCashTypeService>();
            services.AddScoped<IMasterCashPointService, MasterCashPointService>();
            services.AddScoped<IMasterRoleService, MasterRoleService>();
            services.AddScoped<IMasterCashCenterService, MasterCashCenterService>();
            services.AddScoped<IMasterUserService, MasterUserService>();
            services.AddScoped<IMasterUserRoleService, MasterUserRoleService>();
            services.AddScoped<IMasterRolePermissionService, MasterRolePermissionService>();
            services.AddScoped<IMasterConfigService, MasterConfigService>();
            services.AddScoped<IMasterConfigTypeService, MasterConfigTypeService>();
            services.AddScoped<IMasterMachineService, MasterMachineService>();
            services.AddScoped<IMasterMachineTypeService, MasterMachineTypeService>();
            services.AddScoped<IMasterM7QualityService, MasterM7QualityService>();
            services.AddScoped<IMasterDenomReconcileService, MasterDenomReconcileService>();
            services.AddScoped<IMasterSeriesDenomService, MasterSeriesDenomService>();
            services.AddScoped<IMasterM7DenominationService, MasterM7DenominationService>();
            services.AddScoped<IMasterBanknoteTypeSendService, MasterBanknoteTypeSendService>();
            services.AddScoped<IMasterBanknoteTypeService, MasterBanknoteTypeService>();
            services.AddScoped<IMasterMachineSevenOutputService, MasterMachineSevenOutputService>();
            services.AddScoped<IMasterStatusService, MasterStatusService>();
            services.AddScoped<IMasterMenuService, MasterMenuService>();
            services.AddScoped<IMasterShiftService, MasterShiftService>();
            services.AddScoped<IRegisterUnsortService, RegisterUnsortService>();
            services.AddScoped<IBssAuthenticationService, BssAuthenticationService>();
            services.AddScoped<IMasterRoleGroupService, MasterRoleGroupService>();
            services.AddScoped<IMasterZoneService, MasterZoneService>();
            services.AddScoped<IMasterZoneCashpoinService, MasterZoneCashpoinService>();
            services.AddScoped<IPreparationUnfitService, PreparationUnfitService>();

            services.AddScoped<ITransactionSendUnsortCCService, TransactionSendUnsortCCService>();

            services.AddScoped<IPreparationUnsortCcService, PreparationUnsortCcService>();
            services.AddScoped<IClaimsUpdaterService, ClaimsUpdaterService>();
            services.AddScoped<IReceiveCbmsTransactionService, ReceiveCbmsTransactionService>();
            services.AddScoped<IMasterDropdownService, MasterDropdownService>();
            services.AddScoped<IPreparationUnsortCaNonMemberService, PreparationUnsortCaNonMemberService>();
            services.AddScoped<IPreparationUnsortCaMemberService, PreparationUnsortCaMemberService>();

            services.AddScoped<INotificationService, NotificationService>();

            services.AddScoped<IUnsortReceiveDeliveryService, UnsortReceiveDeliveryService>();

            services.AddScoped<IReconcileTransactionService, ReconcileTransactionService>();

            services.AddScoped<IReconciliationTransactionService, ReconciliationTransactionService>();

            services.AddScoped<IVerifyTransactionService, VerifyTransactionService>();

            services.AddScoped<IAutoSellingApiService, AutoSellingApiService>();

            services.AddScoped<IApproveManualKeyInTransactionService, ApproveManualKeyInTransactionService>();

            services.AddScoped<IManualKeyInService, ManualKeyInService>();

            services.AddScoped<IHoldingDetailService, HoldingDetailService>();

            services.AddScoped<IRevokeTransactionService, RevokeTransactionService>();

            services.AddScoped<IHoldingService, HoldingService>();

            services.AddNotyf(config =>
            {
                config.DurationInSeconds = 10;
                config.IsDismissable = true;
                config.Position = NotyfPosition.TopRight;
            });

            return services;
        }
    }
}

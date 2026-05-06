namespace BSS_API.Infrastructure.Middlewares
{
    using Helpers;
    using Scrutor;
    using Services;
    using Repositories;
    using Services.Interface;
    using Repositories.Interface;
    
    public static class ItemServiceCollectionExtensions
    {
        public static IServiceCollection AddItemServices(this IServiceCollection services)
        {
            /*
            services.AddAuthentication("BasicAuthentication")
                    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
            */
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpClient<IAppClient, AppClient>();
            services.AddScoped<IAppShare, AppShare>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddMemoryCache();
            services.Scan(scan => scan
                .FromAssemblyOf<Program>()
                .AddClasses(classes => classes.Where(t =>
                    t.Name.EndsWith("Service") ||
                    t.Name.EndsWith("Repository") ||
                    t.Name.EndsWith("Repos")))
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsImplementedInterfaces()
                .WithScopedLifetime()
            );
            return services;
        }
    }
}

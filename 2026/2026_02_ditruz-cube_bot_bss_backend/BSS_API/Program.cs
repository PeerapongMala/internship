using Serilog;
using BSS_API.Models;
using BSS_API.Helpers;
using Newtonsoft.Json;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;
using BSS_API.Infrastructure.Middlewares;
using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);

var appLogger = LogConfigurationHelper.CreateAppLogger();

var efLogger = LogConfigurationHelper.CreateEFLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(appLogger);

#region IsDevelopment

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

#endregion IsDevelopment

builder.Services.AddHttpContextAccessor();

builder.Services.AddHealthChecks();

// Register loggers for DI
builder.Services.AddSingleton<Serilog.ILogger>(appLogger);
builder.Services.AddSingleton<ICurlLogger>(sp => new CurlLoggerWrapper());

builder.Services.AddScoped<CurlLoggingFilter>();

// Add memory cache service
builder.Services.AddMemoryCache();

// Add services to the container.
builder.Services.AddControllers(options =>
    {
        options.Filters.Add<LoggingActionFilter>();
        options.Filters.Add<GlobalExceptionFilter>();
        options.Filters.Add<ValidateModelAttribute>();
    })
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    })
    .AddNewtonsoftJson(options => { options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore; });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Adding Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(c => c.FullName);
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "BOT-BSS API", Version = "v1" });
    options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    options.IgnoreObsoleteActions();
    options.IgnoreObsoleteProperties();

    options.AddSecurityDefinition("x-api-key", new OpenApiSecurityScheme
    {
        Description = "Api key needed to access the endpoints. X-Api-Key: My_API_Key",
        In = ParameterLocation.Header,
        Name = "x-api-key",
        Type = SecuritySchemeType.ApiKey
    });

    var key = new OpenApiSecurityScheme()
    {
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "x-api-key"
        },
        In = ParameterLocation.Header
    };
    var requirement = new OpenApiSecurityRequirement { { key, new List<string>() } };
    options.AddSecurityRequirement(requirement);
});


//builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(AppConfig.DbConnectionString));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    EFConfigHelper.ConfigureSqlServer(
        options,
        AppConfig.DbConnectionString
    );
});
/*
POC EF Log
builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
{
    options.UseSqlServer(AppConfig.DbConnectionString)
            .EnableSensitiveDataLogging() // important for parameter values
           .LogTo(
            msg => efLogger.Information(msg),
            LogLevel.Information,
            DbContextLoggerOptions.SingleLine
        );
});
*/
//builder.Services.AddDbContext<ApplicationDbContext>(options =>{ options.UseInMemoryDatabase("AppBssDb");});

builder.Services.AddItemServices(); // Use the extension method

var app = builder.Build();

RequestContextHelper.Configure(app.Services.GetRequiredService<IHttpContextAccessor>());

// Config App Path Base (required in dev/uat/prod deployment)
string pathBase = AppConfig.PathBase;

if (!string.IsNullOrWhiteSpace(pathBase))
{
    if (!pathBase.StartsWith("/"))
        pathBase = "/" + pathBase;

    app.UsePathBase(pathBase);
}

// --- Add TraceId middleware here ---
app.Use(async (context, next) =>
{
    var traceId = RequestContextHelper.GetRequestId();
    using (Serilog.Context.LogContext.PushProperty("CustomRequestId", traceId))
    {
        await next();
    }
});

CacheHelper.Initialize(app.Services.GetRequiredService<IMemoryCache>(), appLogger);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors();
    app.UseSwagger();
    //app.UseSwaggerUI();


    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint($"{pathBase}/swagger/v1/swagger.json", "BSS Api  V1");
        c.DocExpansion(DocExpansion.None);
    });
}

app.MapHealthChecks("/health");

app.UseRequestLog();
app.UseHttpsRedirection();
//app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
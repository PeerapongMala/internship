using AspNetCoreHero.ToastNotification.Extensions;
using BBSS_WEB.Helpers;
using BSS_WEB.Controllers;
using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Https;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using System.Text.Json;



var builder = WebApplication.CreateBuilder(args);

Log.Logger = LogConfigurationHelper.CreateAppLogger();


builder.Host.UseSerilog();

builder.Services.AddHealthChecks();

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueCountLimit = 10000;
});

builder.Services.AddControllersWithViews();
builder.Services.AddScoped<ReportController>();

// Add services to the container.
string isExternalWeb = AppConfig.IsExternalWeb;
if (isExternalWeb == "Y")
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ConfigureHttpsDefaults(https =>
        {
            https.ClientCertificateMode = ClientCertificateMode.RequireCertificate;
        });
    });
}

// Configure antiforgery to read header for AJAX JSON calls
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "RequestVerificationToken";
});

//// Auto-validate antiforgery tokens globally for Razor Pages
//builder.Services.AddRazorPages(options =>
//{
//    options.Conventions.ConfigureFilter(new Microsoft.AspNetCore.Mvc.AutoValidateAntiforgeryTokenAttribute());
//});


builder.Services.AddHttpContextAccessor();

builder.Services.AddItemServices(); // Use the extension method

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });

//MemoryCache
builder.Services.AddMemoryCache(options =>
{
    options.SizeLimit = 2500;
});

//Timeout
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(5);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);
});

#region /* Configuration JWT Authentication */

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies[CookieNameConstants.AccessToken];
                if (!string.IsNullOrEmpty(token))
                    context.Token = token;
                return Task.CompletedTask;
            }
        };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            ValidIssuer = AppConfig.JwtValidIssuer,
            ValidAudience = AppConfig.JwtValidAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(AppConfig.JwtIssuerSigningKey))
        };
    });

builder.Services.AddAuthorization();

#endregion /* Configuration JWT Authentication */

var app = builder.Build();

//Warmup Playwright
using (var scope = app.Services.CreateScope())
{
    var controller = scope.ServiceProvider.GetRequiredService<ReportController>();
    await controller.WarmupAsync();
}

// Config App Path Base (required in dev/uat/prod deployment)
string pathBase = AppConfig.PathBase;

if (!string.IsNullOrWhiteSpace(pathBase))
{
    if (!pathBase.StartsWith("/"))
        pathBase = "/" + pathBase;

    app.UsePathBase(pathBase);
}

app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
       
        diagnosticContext.Set("RequestId", httpContext.TraceIdentifier);
    };
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");

//app.UseSession();

app.UseNotyf();
//app.MapHub<BssAdminHub>("/NotificationHub");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();

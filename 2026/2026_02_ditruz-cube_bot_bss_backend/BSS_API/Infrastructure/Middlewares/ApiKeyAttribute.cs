using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Infrastructure.Middlewares
{
    public class ApiKeyAttribute : TypeFilterAttribute
    {
        public ApiKeyAttribute(string systemCode)
            : base(typeof(ApiKeyFilter))
        {
            Arguments = new object[] { systemCode };
        }
    }
}
using Microsoft.AspNetCore.SignalR;

namespace BSS_WEB.Services
{
    public class BssAdminHub : Hub
    {
        public async Task SendJobStatus(string type, string message, string status)
        {
            await Clients.Caller.SendAsync("ReceivedMessage", type, message, status);
        }
    }
}

using Microsoft.AspNetCore.SignalR;
namespace LiveShareHubAPI.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var roomId = httpContext?.Request.Query["roomId"].ToString();

            if (!string.IsNullOrEmpty(roomId))
            {
                Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            }

            return base.OnConnectedAsync();
        }

        public async Task SendCode(string roomId, string code)
        {
            // Only send to users in the same room
            await Clients.Group(roomId).SendAsync("ReceiveCode", code);
        }
    }
}
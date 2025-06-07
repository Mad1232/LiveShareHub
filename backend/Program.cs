using LiveShareHubAPI.Hubs; 

var builder = WebApplication.CreateBuilder(args);

// CORS policy to allow Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // For SignalR WebSockets
        });
});

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<OracleDbService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS BEFORE authorization
app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/room");
app.Run();

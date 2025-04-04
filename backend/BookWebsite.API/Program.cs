using BookWebsite.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookDbContext>(options=>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3005",
                    "https://bookwebsitebullockbackend-eefyhae8dgemfue4.eastus-01.azurewebsites.net"
                )
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

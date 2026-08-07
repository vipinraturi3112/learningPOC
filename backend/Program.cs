using backend.Features.Exercise01_CQRS;
using backend.Features.Exercise02_DI_Lifetimes;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<CreateProductService>();
builder.Services.AddScoped<GetProductQueryService>();

// Exercise 2: DI & service lifetimes — same concrete class shape,
// registered three different ways so the behavior differs.
builder.Services.AddTransient<TransientService>();
builder.Services.AddScoped<ScopedService>();
builder.Services.AddSingleton<SingletonService>();
builder.Services.AddScoped<NestedConsumer>();
// NOT registering CaptiveDependencyService here on purpose — see its comments.

builder.Services.AddControllers(); // <-- CRITICAL LINE 1

var app = builder.Build();

// Exercise 2: stash the ROOT service provider so /api/dilifetimes/buggy can
// deliberately misuse it later (see RootProviderHolder.cs for why).
RootProviderHolder.Instance = app.Services;

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // serves the raw spec at /openapi/v1.json
    app.MapScalarApiReference(); // interactive UI reading that spec, at /scalar
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");
app.MapControllers(); // <-- CRITICAL LINE 2 (Must be near the bottom)
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

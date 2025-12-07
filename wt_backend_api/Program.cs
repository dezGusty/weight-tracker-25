using Microsoft.EntityFrameworkCore;
using WeightTrackerAPI.Data;
using WeightTrackerAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<WeightTrackerContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=weighttracker.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WeightTrackerContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngularApp");

// Get all weight entries
app.MapGet("/api/weights", async (WeightTrackerContext db) =>
{
    return await db.WeightEntries.OrderByDescending(w => w.Date).ToListAsync();
})
.WithName("GetWeights")
.RequireCors("AllowAngularApp");

// Get weight entries with pagination/limit
app.MapGet("/api/weights/recent", async (WeightTrackerContext db, int? limit) =>
{
    var query = db.WeightEntries.OrderByDescending(w => w.Date);
    
    if (limit.HasValue && limit.Value > 0)
    {
        return await query.Take(limit.Value).ToListAsync();
    }
    
    var results = await query.Take(40).ToListAsync();
    return results;
})
.WithName("GetRecentWeights")
.RequireCors("AllowAngularApp");

// Get a specific weight entry by ID
app.MapGet("/api/weights/{id}", async (int id, WeightTrackerContext db) =>
{
    return await db.WeightEntries.FindAsync(id)
        is WeightEntry weight
            ? Results.Ok(weight)
            : Results.NotFound();
})
.WithName("GetWeight")
.RequireCors("AllowAngularApp");

// Get weight entry by date
app.MapGet("/api/weights/date/{date}", async (DateTime date, WeightTrackerContext db) =>
{
    var entry = await db.WeightEntries.FirstOrDefaultAsync(w => w.Date.Date == date.Date);
    return entry is not null ? Results.Ok(entry) : Results.NotFound();
})
.WithName("GetWeightByDate")
.RequireCors("AllowAngularApp");

// Create a new weight entry
app.MapPost("/api/weights", async (WeightEntry weight, WeightTrackerContext db) =>
{
    // Normalize date to remove time component
    weight.Date = weight.Date.Date;
    
    // Check if entry already exists for this date
    var existing = await db.WeightEntries.FirstOrDefaultAsync(w => w.Date == weight.Date);
    if (existing is not null)
    {
        return Results.Conflict(new { message = "An entry already exists for this date. Use PUT to update." });
    }
    
    db.WeightEntries.Add(weight);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/weights/{weight.Id}", weight);
})
.WithName("CreateWeight")
.RequireCors("AllowAngularApp");

// Update an existing weight entry
app.MapPut("/api/weights/{id}", async (int id, WeightEntry inputWeight, WeightTrackerContext db) =>
{
    var weight = await db.WeightEntries.FindAsync(id);
    
    if (weight is null)
    {
        return Results.NotFound();
    }
    
    // Normalize date to remove time component
    inputWeight.Date = inputWeight.Date.Date;
    
    // Check if another entry exists for the new date
    if (weight.Date != inputWeight.Date)
    {
        var existing = await db.WeightEntries.FirstOrDefaultAsync(w => w.Date == inputWeight.Date && w.Id != id);
        if (existing is not null)
        {
            return Results.Conflict(new { message = "An entry already exists for this date." });
        }
    }
    
    weight.Date = inputWeight.Date;
    weight.Weight = inputWeight.Weight;
    weight.Notes = inputWeight.Notes;
    
    await db.SaveChangesAsync();
    
    return Results.Ok(weight);
})
.WithName("UpdateWeight")
.RequireCors("AllowAngularApp");

// Delete a weight entry
app.MapDelete("/api/weights/{id}", async (int id, WeightTrackerContext db) =>
{
    var weight = await db.WeightEntries.FindAsync(id);
    
    if (weight is null)
    {
        return Results.NotFound();
    }
    
    db.WeightEntries.Remove(weight);
    await db.SaveChangesAsync();
    
    return Results.NoContent();
})
.WithName("DeleteWeight")
.RequireCors("AllowAngularApp");

app.Run();

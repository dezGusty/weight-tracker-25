using Microsoft.EntityFrameworkCore;
using WeightTrackerAPI.Models;

namespace WeightTrackerAPI.Data;

public class WeightTrackerContext : DbContext
{
    public WeightTrackerContext(DbContextOptions<WeightTrackerContext> options)
        : base(options)
    {
    }

    public DbSet<WeightEntry> WeightEntries { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Ensure Date is unique (one entry per day)
        modelBuilder.Entity<WeightEntry>()
            .HasIndex(w => w.Date)
            .IsUnique();
    }
}

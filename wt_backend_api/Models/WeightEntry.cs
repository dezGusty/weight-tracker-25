namespace WeightTrackerAPI.Models;

public class WeightEntry
{
    public int Id { get; set; }
    
    public DateTime Date { get; set; }
    
    public double Weight { get; set; }
    
    public string? Notes { get; set; }
}

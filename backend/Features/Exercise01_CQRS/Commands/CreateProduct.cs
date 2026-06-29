namespace backend.Features.Exercise01_CQRS;

// --- COMMAND MODELS (WRITE) ---
public record CreateProductCommand(string Name, decimal Price);
public record ProductResult(int Id, string Name, decimal Price, string Status);

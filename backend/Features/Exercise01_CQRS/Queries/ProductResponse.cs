namespace backend.Features.Exercise01_CQRS;


public record ProductQueryResponse(int Id, string Name, decimal Price, DateTime RetrievedAt);
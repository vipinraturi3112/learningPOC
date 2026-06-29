namespace backend.Features.Exercise01_CQRS;

public class GetProductQueryService
{
    public async Task<ProductQueryResponse> ExecuteAsync(GetProductByIdQuery query)
    {
        await Task.Delay(50); // Simulate fast database read delay

        // Mock database fetch match
        return new ProductQueryResponse(
            query.Id, 
            $"Pure CQRS Product #{query.Id}", 
            99.99m, 
            DateTime.UtcNow
        );
    }
}
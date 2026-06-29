namespace backend.Features.Exercise01_CQRS;

public class CreateProductService
{
    private static int _idCounter = 1; // Simulated database auto-increment ID

    public async Task<ProductResult> ExecuteAsync(CreateProductCommand command)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(command.Name))
            throw new ArgumentException("Product name cannot be empty.");
        if (command.Price <= 0)
            throw new ArgumentException("Price must be greater than zero.");

        await Task.Delay(100); // Simulate database write delay

        int newId = _idCounter++;

        return new ProductResult(newId, command.Name, command.Price, "Created Successfully via Pure CQRS Service!");
    }
}
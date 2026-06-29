using backend.Features.Exercise01_CQRS;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly CreateProductService _writeService;
    private readonly GetProductQueryService _readService;

    // We inject the explicit read and write services directly
    public ProductsController(CreateProductService writeService, GetProductQueryService readService)
    {
        _writeService = writeService;
        _readService = readService;
    }

    // READ Pathway
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetProductByIdQuery(id);
        var result = await _readService.ExecuteAsync(query);
        return Ok(result);
    }

    // WRITE Pathway
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
    {
        var result = await _writeService.ExecuteAsync(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}
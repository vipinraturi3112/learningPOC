using backend.Features.Exercise03_ModernCSharp;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModernCSharpController : ControllerBase
{
    // GET api/moderncsharp
    //
    // One call, every feature demonstrated at once. Read the JSON field by
    // field against the comments in OrderModels.cs:
    //
    //   recordsEqualByValue      -> true, even though addr1/addr2 are two
    //                                separate objects (see referenceEquals)
    //   withExpressionResult     -> a NEW Address, only City changed,
    //                                addr1 itself is untouched
    //   collectionExpressionCombined -> Items plus "Extra", built with the
    //                                [.. items, "Extra"] spread syntax
    //   listPatternDescriptions  -> DescribeItems() matched on array shape
    //                                (empty / one / two / many) with no
    //                                manual .Length checks
    [HttpGet]
    public IActionResult Get()
    {
        var addr1 = new Address("Seattle", "USA");
        var addr2 = new Address("Seattle", "USA");
        var addr3 = addr1 with { City = "Portland" }; // non-destructive — addr1 unchanged

        var order = new Order("Vipin", addr1) { Items = ["Widget", "Gadget"] };
        string[] combined = [.. order.Items, "Extra"]; // spread a collection expression

        return Ok(new
        {
            recordsEqualByValue = addr1 == addr2,
            recordsAreDifferentObjects = !ReferenceEquals(addr1, addr2),
            withExpressionResult = addr3,
            originalAddressUnchanged = addr1,
            primaryConstructorOrder = new { order.CustomerName, order.Address, order.Items },
            collectionExpressionCombined = combined,
            listPatternDescriptions = new[]
            {
                OrderDescriber.DescribeItems([]),
                OrderDescriber.DescribeItems(["Solo"]),
                OrderDescriber.DescribeItems(["A", "B"]),
                OrderDescriber.DescribeItems(["A", "B", "C", "D"]),
            },
        });
    }

    // GET api/moderncsharp/exercise
    //
    // Calls OrderFactory.BuildVipOrder — currently throws NotImplementedException,
    // so this returns 501 with a hint. Fill it in (see the "Try it" comment
    // in OrderModels.cs) and this flips to 200 with passed: true.
    [HttpGet("exercise")]
    public IActionResult GetExercise()
    {
        try
        {
            var order = OrderFactory.BuildVipOrder("Test Customer");
            var passed = order.CustomerName == "Test Customer" && order.Items.Count > 0;
            return Ok(new { passed, order.CustomerName, order.Address, order.Items });
        }
        catch (NotImplementedException ex)
        {
            return StatusCode(501, new { passed = false, hint = ex.Message });
        }
    }
}

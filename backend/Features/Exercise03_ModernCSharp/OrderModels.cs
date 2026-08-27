namespace backend.Features.Exercise03_ModernCSharp;

// This exercise is a tour of C#/.NET features added since .NET 6 (this repo
// targets net10.0, but each feature below is annotated with the version it
// actually shipped in). All of it is exercised live through
// ModernCSharpController — hit the endpoints and read the JSON to see each
// feature's effect, rather than just reading source.

// RECORD (C# 9 / .NET 5 — the baseline everything else here builds on):
// value-based equality instead of reference equality (two records with the
// same property values are `==`, even though they're different objects in
// memory), plus a `with` expression for non-destructive mutation — copy the
// record, changing only the fields you name, leaving the original intact.
public record Address(string City, string Country);

// PRIMARY CONSTRUCTOR for a CLASS (C# 12 / .NET 8). Records have had this
// shorthand since C# 9; .NET 8 extended it to ordinary classes. The
// parameters (customerName, address) are usable directly in the class body
// AND can be assigned straight into properties below — no hand-written
// `public Order(string customerName, Address address) { CustomerName = ... }`
// boilerplate needed.
public class Order(string customerName, Address address)
{
    public string CustomerName { get; } = customerName;
    public Address Address { get; } = address;

    // REQUIRED MEMBERS (C# 11 / .NET 7): a property marked `required` MUST
    // be set via object-initializer syntax at the call site, or the code
    // simply doesn't compile. This replaces a whole category of "forgot to
    // set this field, got a null reference at runtime three layers away"
    // bugs with a compile error at the one place that actually needs fixing.
    public required List<string> Items { get; init; }
}

// LIST PATTERNS (C# 11 / .NET 7): pattern-match directly on an array's
// shape and contents, instead of checking .Length and indexing manually.
public static class OrderDescriber
{
    public static string DescribeItems(string[] items) => items switch
    {
        [] => "empty order",
        [var only] => $"single item: {only}",
        [var first, var second] => $"two items: {first} and {second}",
        [var first, .., var last] => $"{items.Length} items, from \"{first}\" to \"{last}\"",
    };
}

// --- Try it ---
//
// Implement BuildVipOrder so it returns an Order for the given customer,
// using:
//   - the primary-constructor call: new Order(customerName, someAddress)
//   - a COLLECTION EXPRESSION (C# 12 / .NET 8) for Items — e.g. ["A", "B"]
//     instead of new List<string> { "A", "B" }
//   - object-initializer syntax to satisfy the `required Items` property
//
// Hit GET api/moderncsharp/exercise once you're done — it self-checks and
// tells you pass/fail (currently fails with a 501, since this throws).
public static class OrderFactory
{
    public static Order BuildVipOrder(string customerName)
    {
        throw new NotImplementedException(
            "Replace this with: new Order(customerName, new Address(\"Metropolis\", \"USA\")) " +
            "{ Items = [\"Priority Pass\", \"Gift Basket\"] };");
    }
}

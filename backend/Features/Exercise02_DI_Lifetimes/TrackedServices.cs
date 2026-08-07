namespace backend.Features.Exercise02_DI_Lifetimes;

// Every class below does the same thing: stamp itself with a Guid the
// moment it's constructed. Comparing Guids across two calls is how the
// lifetimes become visible instead of theoretical. They're registered
// directly as concrete types (see Program.cs) — one per lifetime — so
// injecting TransientService vs ScopedService vs SingletonService is what
// selects the behavior, not any shared interface.

// TRANSIENT: a brand new instance every single time it's requested from the
// container — even twice within the same HTTP request.
public class TransientService
{
    public Guid Id { get; } = Guid.NewGuid();
}

// SCOPED: one instance per HTTP request (per "scope"). Every class that asks
// for ScopedService during the same request gets the SAME instance; the
// next request gets a fresh one.
public class ScopedService
{
    public Guid Id { get; } = Guid.NewGuid();
}

// SINGLETON: exactly one instance for the entire lifetime of the app —
// created on first use, then reused by every request forever, until the
// app restarts.
public class SingletonService
{
    public Guid Id { get; } = Guid.NewGuid();
}

// A second, independent consumer of all three services — standing in for
// "some other class deeper in the call graph that also needs these deps."
// Comparing its Ids against the controller's own Ids is what proves scoped
// services are shared WITHIN a request, not just within one class.
public class NestedConsumer
{
    public Guid TransientId { get; }
    public Guid ScopedId { get; }
    public Guid SingletonId { get; }

    public NestedConsumer(TransientService transient, ScopedService scoped, SingletonService singleton)
    {
        TransientId = transient.Id;
        ScopedId = scoped.Id;
        SingletonId = singleton.Id;
    }
}

// THE FOOTGUN, for reference only — NOT registered anywhere. A singleton
// that captures a scoped service in its constructor. A singleton is built
// once and lives forever, so the scoped instance it captures would "leak"
// past the request it belongs to and get silently reused by every future
// request. If you register this with builder.Services.AddSingleton
// <CaptiveDependencyService>() in Program.cs, the app won't even start —
// ASP.NET Core's ValidateOnBuild (on by default in Development) inspects
// the whole DI graph at builder.Build() and refuses to construct it. Try
// uncommenting that registration to see the crash, then revert it — that's
// the framework protecting you at the earliest possible point, BEFORE any
// request lands, not just when the buggy service happens to get resolved.
public class CaptiveDependencyService
{
    public Guid Id { get; } = Guid.NewGuid();
    public Guid CapturedScopedId { get; }

    public CaptiveDependencyService(ScopedService scoped)
    {
        CapturedScopedId = scoped.Id;
    }
}

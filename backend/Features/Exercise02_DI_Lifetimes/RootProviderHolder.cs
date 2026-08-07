namespace backend.Features.Exercise02_DI_Lifetimes;

// Holds a reference to the app's ROOT service provider — the one that lives
// for the whole app, as opposed to the per-request provider a controller
// normally gets injected with. Captured once at startup in Program.cs.
//
// This exists purely so the /buggy endpoint can reproduce the captive
// dependency error live, over HTTP, WITHOUT crashing the app at startup:
// asking the root provider directly for a Scoped service is the same
// illegal operation a singleton's constructor would be doing internally —
// "give me a scoped instance with no request/scope to attach it to" — and
// it throws at that GetRequiredService call, not at app startup.
public static class RootProviderHolder
{
    public static IServiceProvider? Instance { get; set; }
}

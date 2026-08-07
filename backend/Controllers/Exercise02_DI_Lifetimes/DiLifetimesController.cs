using backend.Features.Exercise02_DI_Lifetimes;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiLifetimesController : ControllerBase
{
    // These are resolved once, when THIS controller is constructed — which
    // itself happens once per request (controllers are scoped by default).
    private readonly TransientService _transient;
    private readonly ScopedService _scoped;
    private readonly SingletonService _singleton;
    private readonly NestedConsumer _nested;

    public DiLifetimesController(
        TransientService transient,
        ScopedService scoped,
        SingletonService singleton,
        NestedConsumer nested)
    {
        _transient = transient;
        _scoped = scoped;
        _singleton = singleton;
        _nested = nested;
    }

    // GET api/dilifetimes
    //
    // Call this endpoint TWICE (two separate requests) and compare the JSON:
    //
    //   controller.transientId vs nested.transientId  -> ALWAYS different,
    //     even within the same request — transient means "new every ask".
    //
    //   controller.scopedId vs nested.scopedId -> SAME within one request
    //     (the controller and NestedConsumer share one scope), but the
    //     whole pair changes on the next request.
    //
    //   controller.singletonId vs nested.singletonId -> ALWAYS the same,
    //     request after request, until the app restarts.
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            controller = new
            {
                transientId = _transient.Id,
                scopedId = _scoped.Id,
                singletonId = _singleton.Id,
            },
            nested = new
            {
                transientId = _nested.TransientId,
                scopedId = _nested.ScopedId,
                singletonId = _nested.SingletonId,
            },
        });
    }

    // GET api/dilifetimes/buggy
    //
    // A singleton capturing a scoped service in its constructor (see
    // CaptiveDependencyService's comments) is the classic version of this
    // bug, but registering it that way makes the WHOLE APP refuse to start
    // (ValidateOnBuild). To demonstrate the same underlying problem live,
    // over HTTP, this asks the app's ROOT provider — not this request's
    // scoped provider — directly for a ScopedService. That's exactly what
    // a singleton's constructor would be doing internally, and it throws
    // at THIS call instead of at startup.
    [HttpGet("buggy")]
    public IActionResult GetBuggy()
    {
        try
        {
            var scoped = RootProviderHolder.Instance!.GetRequiredService<ScopedService>();
            return Ok(new { scoped.Id });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                explanation = "This is the captive dependency error, caught on purpose.",
                exceptionMessage = ex.Message,
            });
        }
    }
}

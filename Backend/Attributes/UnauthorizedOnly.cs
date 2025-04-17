using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class UnauthorizedOnly : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var user = context.HttpContext.User;

        if (user.Identity != null && user.Identity.IsAuthenticated)
        {
            context.Result = new JsonResult(new { message = "You must log out to perform this action" })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}

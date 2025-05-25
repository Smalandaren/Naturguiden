using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Backend.Interfaces;

public class AdminOnlyAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var profileService = context.HttpContext.RequestServices.GetRequiredService<IProfileService>();
        var user = context.HttpContext.User;
        var userIdString = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdString, out int userId)) // Variabeln userId skapas bara om userIdString går att omvandla till en int
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        bool isAdmin = await profileService.GetUserAdminStatusAsync(userId);
        if (!isAdmin)
        {
            context.Result = new JsonResult(new { message = "You must be an admin to perform this action" })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
            return;
        }

        await next(); // Fortsätt till Controllern
    }
}

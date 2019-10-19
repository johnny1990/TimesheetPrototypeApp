using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TimesheetPrototypeApp.Startup))]
namespace TimesheetPrototypeApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

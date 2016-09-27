using System.Web;
using System.Web.Optimization;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Helpers
{
    public static class LCScripts
    {
        public static IHtmlString Render(string path)
        {
            return Scripts.Render(string.Format("{0}/{1}", CDNHelper.JavaScriptStaticContentUrl, path));
        }
    }
}
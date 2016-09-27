using System;
using System.Web;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Helpers.ActionFilters
{
    /// <summary>
    /// Action or controller caching attribute
    /// </summary>
    public class CacheFilterAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Gets or sets the cache duration in seconds. The default is 15 seconds.
        /// </summary>
        /// <value>The cache duration in seconds.</value>
        public int Duration
        {
            get;
            set;
        }

        /// <summary>
        /// Default Constructor with 15 sec duration
        /// </summary>
        public CacheFilterAttribute()
        {
            Duration = 15;
        }

        /// <summary>
        /// Event handled method caching for the given duration
        /// </summary>
        /// <param name="filterContext">Context for the action executed method</param>
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (Duration <= 0)
                return;

            HttpCachePolicyBase cache = filterContext.HttpContext.Response.Cache;
            TimeSpan cacheDuration = TimeSpan.FromSeconds(Duration);

            cache.SetCacheability(HttpCacheability.Public);
            cache.SetExpires(DateTime.Now.Add(cacheDuration));
            cache.SetMaxAge(cacheDuration);
            cache.AppendCacheExtension("must-revalidate, proxy-revalidate");
        }
    }
}
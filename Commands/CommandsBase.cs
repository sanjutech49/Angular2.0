using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.Facade;

namespace MML.Web.LoanCenter.Commands
{
    public class CommandsBase : ICommand
    {
        #region # Private

        public String ViewName { get; set; }
        public dynamic ViewData { get; set; }
        public Dictionary<string, object> InputParameters { get; set; }
        public HttpContextBase HttpContext { get; set; }
        public UserAccount User { get; set; }

        public System.Web.WebPages.Html.SelectListItem GenericItem = new System.Web.WebPages.Html.SelectListItem()
        {
            Text = "(Select One)",
            Value = "0"
        };

        public System.Web.WebPages.Html.SelectListItem ViewAllItem = new System.Web.WebPages.Html.SelectListItem()
        {
            Text = "View All",
            Value = "-1"
        };
        
        #endregion

        public virtual void Execute()
        {
            if ( HttpContext == null || HttpContext.Session == null )
                throw new NullReferenceException( "Session is empty!" );

            if ( HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )HttpContext.Session[ SessionHelper.UserData ] ).Username == HttpContext.User.Identity.Name )
                User = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            else
                User = UserAccountServiceFacade.GetUserByName( HttpContext.User.Identity.Name );

            if ( User == null )
                throw new InvalidOperationException( "User is null" );
        }
    }
}
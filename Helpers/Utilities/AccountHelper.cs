using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using System.Configuration;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class AccountHelper
    {
        /// <summary>
        /// Get User Account
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static UserAccount GetUserAccount( HttpContextBase context )
        {
            if( context == null || context.Session == null || context.Session[ SessionHelper.UserData ] == null )
                throw new UnauthorizedAccessException( "User is not authorized!" );

            return ( UserAccount )context.Session[ SessionHelper.UserData ];
        }

        /// <summary>
        /// Gets first and last name for currently logged in user
        /// </summary>
        /// <returns></returns>
        public static string GetUserFullName()
        {
            if (HttpContext.Current.Session[ SessionHelper.UserData ] == null)
                return null;

            var user = (UserAccount)HttpContext.Current.Session[ SessionHelper.UserData ];

            if (user.Party == null)
                return null;
            else return user.Party.FirstName + " " + user.Party.LastName;
        }

        /// <summary>
        /// Check if user is in role
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public static bool IsInRole(string role)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
                return false;

            if (HttpContext.Current.Session[ SessionHelper.UserData ] == null)
                return false;

            var user = (UserAccount)HttpContext.Current.Session[ SessionHelper.UserData ];

            return user.Roles != null && user.Roles.Any(r => r.RoleName.Equals(role));
        }

        /// <summary>
        /// Check if user has privilege
        /// </summary>
        /// <param name="privilege"></param>
        /// <returns></returns>
        public static bool HasPrivilege( string privilege, HttpContext httpContext = null )
        {
            if ( httpContext == null )
                httpContext = HttpContext.Current ?? null;

            if ( httpContext == null || !httpContext.User.Identity.IsAuthenticated || httpContext.Session[ SessionHelper.UserData ] == null)
                return false;             

            List<RolePrivilege> privileges;
            if ( httpContext.Session[ SessionHelper.PrivilegeForUser ] == null )
            {
                var user = ( UserAccount )httpContext.Session[ SessionHelper.UserData ];
                privileges = ( UserAccountServiceFacade.GetRolePrivileges( user.UserAccountId ) ).ToList();
                httpContext.Session[ SessionHelper.PrivilegeForUser ] = privileges;
            }
            else
            {
                privileges = ( List<RolePrivilege> )httpContext.Session[ SessionHelper.PrivilegeForUser ];
            }

            return privileges != null && privileges.Any(p => p.Name != null && p.Name.Trim().ToLower() == privilege.Trim().ToLower());
        }

        /// <summary>
        /// Checks if user has the AccessToActivities privilege
        /// </summary>
        /// <returns></returns>
        public static bool HasPrivilegeForAccessToActivities()
        {
            bool hasPrivilegeForAccessToActivities = false;

            if ( HttpContext.Current == null || !HttpContext.Current.User.Identity.IsAuthenticated || HttpContext.Current.Session[ SessionHelper.UserData ] == null )
                return hasPrivilegeForAccessToActivities;

            if ( HttpContext.Current.Session[ SessionHelper.PrivilegeForAccessToActivities ] is bool )
            {
                hasPrivilegeForAccessToActivities = ( bool )HttpContext.Current.Session[ SessionHelper.PrivilegeForAccessToActivities ];
            }
            else
            {
                hasPrivilegeForAccessToActivities = HasPrivilege( PrivilegeName.AccessToActivities );
                HttpContext.Current.Session[ SessionHelper.PrivilegeForAccessToActivities ] = hasPrivilegeForAccessToActivities;                
            }

            return hasPrivilegeForAccessToActivities;
        }

        /// <summary>
        /// Check if user is in role
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public static bool IsConciergeOnly()
        {
            if ( !HttpContext.Current.User.Identity.IsAuthenticated )
                return false;

            if ( HttpContext.Current.Session[ SessionHelper.UserData ] == null )
                return false;

            var user = ( UserAccount )HttpContext.Current.Session[ SessionHelper.UserData ];

            if (user == null)
                return false;

            return user.Roles != null && user.Roles.Any( r => r.RoleName.Equals( RoleName.Concierge ) ) && user.Roles.Count() == 1;
        }

        /// <summary>
        /// GetUserAccountId
        /// </summary>
        /// <returns></returns>
        public static int GetUserAccountId()
        {
            try
            {
                if ( HttpContext.Current == null )
                    return -1;

                if ( HttpContext.Current.Session[ SessionHelper.UserData ] != null )
                    return ( ( UserAccount )HttpContext.Current.Session[ SessionHelper.UserData ] ).UserAccountId;
                
                var temporaryUserAccountId = HttpContext.Current.Session[ SessionHelper.TemporaryUserAccountId ];

                if ( temporaryUserAccountId != null )
                {
                    return Convert.ToInt32( EncryptionHelper.DecryptRijndael( temporaryUserAccountId.ToString(), EncriptionKeys.Default ) );
                }

                return -1;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.Global,
                                  "Error in AccountHelper.GetUserAccountId(). Error message: " + ex.Message, ex );
                return -1;
            }
        }

        public static List<int> PopulateUserAccountIdsList( UserAccount user)
        {
            if( user.Roles != null && !user.Roles.Any( r => r.RoleName.Equals( RoleName.Administrator ) ) && 
                    !user.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) &&
                     !user.Roles.Any( r => r.RoleName.Equals( RoleName.DivisionManager ) ) &&
                      !user.Roles.Any( r => r.RoleName.Equals( RoleName.Hvm ) ) && 
                    !user.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ))
            {
                return  new List<int> { user.UserAccountId };
            }

            return new List<int>();
        }
    }
}

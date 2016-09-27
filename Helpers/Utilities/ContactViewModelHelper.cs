using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.WebPages.Html;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class ContactViewModelHelper
    {
        private static SelectListItem _emptyItem = new SelectListItem()
        {
            Text = " ",
            Value = "0"
        };

        public static void PopulateProspectStatuses( ContactViewModel contactViewModel )
        {
            if ( contactViewModel.StatusList == null )
                contactViewModel.StatusList = new List<SelectListItem>();

            if ( contactViewModel.StatusList.Count > 0 )
                contactViewModel.StatusList.Clear();

            foreach ( ContactStatus contactStatus in Enum.GetValues( typeof( ContactStatus ) ) )
            {
                if ( !contactViewModel.StatusList.Any( s => s.Value == ( ( int )contactStatus ).ToString() ) && contactStatus != ContactStatus.None )
                {
                    contactViewModel.StatusList.Add( new SelectListItem()
                    {
                        Text = contactStatus.GetStringValue(),
                        Value = ( ( int )contactStatus ).ToString()
                    } );
                }
            }
        }

        public static List<SelectListItem> PopulateProspectStatusList( ContactViewModel contactViewModel )
        {
            if ( contactViewModel.StatusList == null )
                contactViewModel.StatusList = new List<SelectListItem>();

            if ( contactViewModel.StatusList.Count > 0 )
                contactViewModel.StatusList.Clear();

            List<SelectListItem> selectListItems = new List<SelectListItem>();


            foreach ( ContactStatus contactStatus in Enum.GetValues( typeof( ContactStatus ) ) )
            {
                if ( !contactViewModel.StatusList.Any( s => s.Value == ( ( int )contactStatus ).ToString() ) && contactStatus != ContactStatus.None )
                {
                    selectListItems.Add( new SelectListItem()
                    {
                        Text = contactStatus.GetStringValue(),
                        Value = ( ( int )contactStatus ).ToString()
                    } );
                }
            }

            return selectListItems.OrderBy(r => r.Text ).ToList();
        }

        public static List<SelectListItem> PopulateProspectLoanOfficers( FilterViewModel userFilterViewModel, HttpContextBase _httpContext )
        {
            Guid branchId = Guid.Empty;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.BranchId ] is Guid ) )
            {
                branchId = ( Guid )_httpContext.Session[ SessionHelper.BranchId ];
            }

            if ( ( _httpContext != null ) && ( _httpContext.Session[ "FilterViewModel" ] != null ) && branchId != Guid.Empty )
            {
                userFilterViewModel.UsersForProspect.Clear();

                userFilterViewModel.UsersForProspect.Add( _emptyItem );

                var result = UserAccountServiceFacade.GetUsersFullName( branchId, false );

                if ( result != null )
                {
                    foreach ( var userAccount in result.OrderBy( r => r.FullName ) )
                    {
                        userFilterViewModel.UsersForProspect.Add( new SelectListItem()
                        {
                            Text = userAccount.FullName,
                            Value = userAccount.UserAccountId.ToString()

                        } );
                    }
                }

                return userFilterViewModel.UsersForProspect.ToList();
            }

            return new List<SelectListItem>();
        }

    }
}

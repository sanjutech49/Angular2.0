using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class ContactGridHelper
    {
        public static void ProcessPagingOptions(ContactListState contactListState, ContactViewModel contactViewModel)
        {
            if (contactViewModel.PageCount % 10 == 0)
            {
                contactViewModel.PageGroups = (contactViewModel.PageCount / 10);
            }
            else
            {
                contactViewModel.PageGroups = (contactViewModel.PageCount / 10) + 1;
            }

            contactViewModel.PageGroups = (int)contactViewModel.PageGroups;
            if (contactViewModel.PageCount % 10 != 0)
            {
                contactViewModel.LastPageItems = contactViewModel.PageCount % 10;
            }
            else
            {
                contactViewModel.LastPageItems = 10;
            }

            contactViewModel.CurrentPage = contactListState.CurrentPage;

            if (contactViewModel.CurrentPage % 10 != 0)
            {
                contactViewModel.StartPage = (int)(contactViewModel.CurrentPage / 10) * 10 + 1;
                if (((int)((contactViewModel.CurrentPage) / 10) + 1) == contactViewModel.PageGroups)
                {
                    contactViewModel.EndPage = (int)(contactViewModel.CurrentPage / 10) * 10 + contactViewModel.LastPageItems;
                    contactViewModel.LastPageDots = true;
                }
                else
                {
                    contactViewModel.EndPage = (int)(contactViewModel.CurrentPage / 10) * 10 + 10;
                    contactViewModel.LastPageDots = false;
                }
            }
            else
            {
                contactViewModel.StartPage = (int)((contactViewModel.CurrentPage - 1) / 10) * 10 + 1;
                if (((int)((contactViewModel.CurrentPage - 1) / 10) + 1) == contactViewModel.PageGroups)
                {
                    contactViewModel.EndPage = (int)(contactViewModel.CurrentPage / 10) * 10;
                    contactViewModel.LastPageDots = true;
                }
                else
                {
                    contactViewModel.EndPage = (int)((contactViewModel.CurrentPage - 1) / 10) * 10 + 10;
                    contactViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( ContactViewModel contactViewModel )
        {
            if ( contactViewModel.Contacts != null )
            {
                // Business rule
                foreach ( var contactItem in contactViewModel.Contacts )
                {
                    foreach ( var item in contactItem.ContactViewItems )
                    {
                        item.ClassCollection = "prospecttablelist";

                        if ( item.ExceptionItemMaxWeight != -1 )
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }

                        if ( item == contactItem.ContactViewItems.First() )
                        {
                            item.ClassCollection = item.ClassCollection + " first last";
                        }

                        if ( item == contactItem.ContactViewItems.Last() )
                        {
                            item.ClassCollection = item.ClassCollection + " last";
                        }
                    }
                }
            }
        }
    }
}

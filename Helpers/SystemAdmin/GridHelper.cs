using System;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.SystemAdmin
{
    public class GridHelper
    {
        public static T GetStartEndPage<T>( GridCommonBaseViewModel model, int pageSize = 10, bool? requestMultiplePages = null, bool? getNextPages = null )
        {
            if ( model.CurrentPage > 0 )
            {
                int startPage = model.CurrentPage % pageSize == 0 ? ( model.CurrentPage - pageSize ) + 1 : ( ( model.CurrentPage / pageSize ) * pageSize ) + 1;
                int endPage = model.PageCount > ( startPage + pageSize ) - 1 ? ( startPage + pageSize ) - 1 : model.PageCount;

                model.StartPage = startPage;
                model.EndPage = endPage;
            }
            else
            {
                model.StartPage = 1;
                model.EndPage = model.PageCount > 10 ? 10 : model.PageCount;
            }
            
            return ( T )Convert.ChangeType( model, typeof( T ) );
        }
    }
}
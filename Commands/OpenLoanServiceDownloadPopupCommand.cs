using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;

namespace MML.Web.LoanCenter.Commands
{
    public class OpenLoanServiceDownloadPopupCommand: ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }


        public void Execute()
        {
            
            try
            {
                Guid loanServiceId=Guid.Empty;
                string eventType=String.Empty;
                Int64 eventId=0;

                if ( InputParameters.ContainsKey( "LoanServiceId" ) )
                {
                    Guid.TryParse( InputParameters[ "LoanServiceId" ].ToString(), out loanServiceId );
                }

                if ( InputParameters.ContainsKey( "EventType" ) )
                {
                    eventType=InputParameters[ "EventType" ].ToString();
                }

                if ( InputParameters.ContainsKey( "EventId" ) )
                {
                    Int64.TryParse(InputParameters[ "EventId" ].ToString(), out eventId);
                }

                LoanServiceContract loanServContract = null;

                if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.LoanServiceList ] != null ) )
                {
                    List<LoanServiceContract> loanServiceList = null;
                    loanServiceList = new List<LoanServiceContract>().FromXml( _httpContext.Session[ SessionHelper.LoanServiceList ].ToString() );
                    loanServContract = loanServiceList.FirstOrDefault( x => x.LoanServiceId == loanServiceId );
                }
                else
                {
                    loanServContract = LoanServiceFacade.RetrieveLoanService( loanServiceId );
                }
               
                LoanServiceDocumentDownload model = new LoanServiceDocumentDownload();
                if ( eventId != 0 )
                {
                    LoanServiceEventsContract loanServEventContract = loanServContract.LoanServiceEventsList.FirstOrDefault( x => x.EventId == eventId && x.EventType.ToLower() == eventType.ToLower() );
                    model.LoanServiceEventsList = new List<LoanServiceEventsContract>();
                    model.LoanServiceEventsList.Add( loanServEventContract );
                }
                else
                {
                    model.LoanServiceEventsList = loanServContract.LoanServiceEventsList;
                }

                _viewName = "Log/_loanServiceDocumentDownload";
                _viewModel = model;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "There is some issues in method OpenLoanServiceDownloadPopupCommand.Execute(): " + ex.Message, ex );
                throw;
            }
        }
    }
}
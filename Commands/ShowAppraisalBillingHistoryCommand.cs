using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using APS.ServiceProxy;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Commands
{
    public class ShowAppraisalBillingHistoryCommand : ICommand
    {
        public string ViewName
        {
            get;
            private set;
        }

        public dynamic ViewData
        {
            get;
            private set;
        }

        public Dictionary<string, object> InputParameters
        {
            get;
            set;
        }

        public HttpContextBase HttpContext
        {
            get;
            set;
        }

        public void Execute()
        {
            Guid orderAppraisalId;

            if ( !InputParameters.ContainsKey( "OrderAppraisalId" ) )
                throw new ArgumentException( "OrderAppraisalId was expected!" );

            Guid.TryParse( InputParameters[ "OrderAppraisalId" ].ToString().TrimEnd(), out orderAppraisalId );

            var request = new RetrieveOrderAppraisalBillingHistory()
                              {
                                  OrderAppraisalId = orderAppraisalId
                              };

            var appraisalBillingHistoryViewModel = new AppraisalBillingHistoryViewModel
            {
                CurrentDate = DateTime.Now,
                OrderAppraisalBillingHistories = new List<OrderAppraisalBillingHistory>()
            };

            if ( orderAppraisalId != Guid.Empty )
            {
                // Call iMP platform
                var results = new Proxy().Send( "RetrieveOrderAppraisalBillingInformationHistory", new Dictionary<string, object> { { "Request", request } } );

                // Get results
                object responseMessageSuccess;
                results.TryGetValue( "Response", out responseMessageSuccess );
                List<OrderAppraisalBillingHistory> history = responseMessageSuccess as List<OrderAppraisalBillingHistory>;

                appraisalBillingHistoryViewModel.OrderAppraisalBillingHistories = history;

            }

            ViewName = "_appraisalbillinghistory";
            ViewData = appraisalBillingHistoryViewModel;
        }
    }
}
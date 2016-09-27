using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Models;

namespace MML.Web.LoanCenter.Commands
{
    public class EmailDataLoadCommand : ICommand
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
            _viewName = "_mailbox";
            _viewModel = CreateTestEmails(); // TODO: switch with Web.Facade service calls
        }

        private MailboxViewModel CreateTestEmails()
        {
            MailboxViewModel mailboxViewModel = new MailboxViewModel();

            mailboxViewModel.Inbox = new List<EMail>()
            { 
                new EMail(){ From = "Bill Gates", Subject = "Loan question", DateReceived = DateTime.Now.Date.AddDays(-2).AddHours(10).AddMinutes(28).AddSeconds(46) },
                new EMail(){ From = "Mark Zuckerberg", Subject = "When?", DateReceived = DateTime.Now.Date.AddDays(-1).AddHours(12).AddMinutes(36).AddSeconds(18) },
                new EMail(){ From = "Steven Spielberg", Subject = "I would like to sign it.", DateReceived = DateTime.Now }

            };

            mailboxViewModel.Sent = new List<EMail>()
            { 
                new EMail(){ From = "Mark Zuckerberg", Subject = "On monday at 11am", DateReceived = DateTime.Now.Date.AddDays(-2).AddHours(8).AddMinutes(35).AddSeconds(18) },
                new EMail(){ From = "Steven Spielberg", Subject = "Contract", DateReceived = DateTime.Now.Date.AddDays(-1).AddHours(6).AddMinutes(54).AddSeconds(22) },
                new EMail(){ From = "Bill Gates", Subject = "Loan answer.", DateReceived = DateTime.Now.Date.AddHours(-1).AddMinutes(2).AddSeconds(37) }

            };

            mailboxViewModel.Draft = new List<EMail>()
            { 
                new EMail(){ From = "John Smith", Subject = "Draft", DateReceived = DateTime.Now.Date.AddDays(-2).AddHours(10).AddMinutes(32).AddSeconds(23) },
                new EMail(){ From = "Tom Johanson", Subject = "Draft", DateReceived = DateTime.Now.Date.AddDays(-1).AddHours(13).AddMinutes(13).AddSeconds(41) },
                new EMail(){ From = "Justin McGreg", Subject = "Draft", DateReceived = DateTime.Now.Date.AddDays(-1).AddHours(16).AddMinutes(19).AddSeconds(50) }

            };

            return mailboxViewModel;
        }
    }
}
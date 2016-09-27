using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Models;

namespace MML.Web.LoanCenter.ViewModels
{
    [Serializable]
    public class MailboxViewModel
    {
        public List<EMail> Inbox
        {
            get;
            set;
        }

        public List<EMail> Sent
        {
            get;
            set;
        }

        public List<EMail> Draft
        {
            get;
            set;
        }
    }
}
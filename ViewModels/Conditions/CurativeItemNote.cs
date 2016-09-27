using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels.Conditions
{
    [Serializable]
    public class CurativeItemNote
    {
        public string Content { get; set; }
        public int UserAccountCreatedId { get; set; }
        public string UserAccountCreatedUserName { get; set; }
        public string DateCreated { get; set; }
        public bool AddNoteToFile { get; set; }
        public bool MarkAsUnread { get; set; }
        public Guid CurativeItemNoteId { get; set; }
        public Guid CurativeItemId { get; set; }
    }
}
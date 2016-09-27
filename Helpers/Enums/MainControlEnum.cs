using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum MainControl
    {
        _unsupportedCommandError = -1,
        OfficerTask = 0,
        Prospect,
        Pipeline,
        PendingApproval,
        Contact,
        Alert,
        Referal,
        Dashboard,
        Appointment,
        Mailbox,
        TaskSubject,
        ContactTooltip,
        ContactTooltipOnContact,
        LoanPurpose,
        LoanPurposeOnContact,
        SourceOfBusinessTooltip,
        UserFilter,
        None
    }
}
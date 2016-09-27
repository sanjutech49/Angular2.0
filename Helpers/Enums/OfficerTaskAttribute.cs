using System;
using MML.Common.Helpers;
using System.Xml.Serialization;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    /// <summary>
    /// 
    /// </summary>
    public enum OfficerTaskAttribute
    {
        [XmlEnum(Name = "Task.CreationTime")]
        [StringValue("Task.CreationTime")]
        DateAndTime = 1,

        [XmlEnum(Name = "Task.DueDate")]
        [StringValue("Task.DueDate")]
        DueDate,

        [XmlEnum(Name = "Task.Subject")]
        [StringValue("Task.Subject")]
        Subject,

        [XmlEnum(Name = "Contact.FirstName")]
        [StringValue("Contact.FirstName")]
        Contact,

        [XmlEnum(Name = "ContactLoan.LoanType")]
        [StringValue("ContactLoan.LoanType")]
        LoanPurpose,

        [XmlEnum(Name = "Task.Status")]
        [StringValue("Task.Status")]
        Status,

        [XmlEnum(Name = "Task.LastModificationTime")]
        [StringValue("Task.LastModificationTime")]
        LastActivityOn,

        [XmlEnum(Name = "Party.FirstName")]
        [StringValue("Party.FirstName")]
        Owner,

        [XmlEnum(Name = "Task.LoanOfficerId")]
        [StringValue("Task.LoanOfficerId")]
        OwnerId,
        
        [XmlEnum(Name = "Task.TaskId")]
        [StringValue("Task.TaskId")]
        TaskId,
    }
}

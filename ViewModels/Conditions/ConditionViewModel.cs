using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels.Conditions;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType]

    [Serializable]
    public class ConditionViewModel
    {
        public Guid ConditionId { get; set; }
        public bool NewCondition { get; set; }

        public string OwnerNames { get; set; }
        public bool IsOwnerOccupied { get; set; }

        public string CategoryDescription { get; set; }
        public int CategoryId { get; set; }

        public ConditionConfiguration ConfigurationCode { get; set; }

        public int UserAccountCreatedId { get; set; }
        public DateTime? DateCreated { get; set; }
        public string Status { get; set; }
        public int StatusId { get; set; }
        
        public string Gate { get; set; }
        public int GateId { get; set; }
        
        public bool CommentHistoryExists { get; set; }
        public string Comment { get; set; }
       
        public int OpenitemsCount { get; set; }
        public int ReadyForReviewItemsCount { get; set; }

        public Role AssignedTo { get; set; }

        public EnumerationValue ConditionSource { get; set; }

        public Role SignOff { get; set; }
        public UserInfo UserSignedOff { get; set; }
        public String SignOffDate { get; set; }
        public bool IsSignedOff { get; set; }
       
        public ConditionConfiguration Code { get; set; }
       
        public EnumerationValue Due { get; set; }

       
        public string ConditionComment { get; set; }
        public bool InternalOnly { get; set; }

        public bool IsRemoved { get; set; }
        public List<ConditionItemViewModel> CurativeItems { get; set; }
        public bool CurativeItemsVisible { get; set; }

        public String SectionName { get; set; }

    }
}
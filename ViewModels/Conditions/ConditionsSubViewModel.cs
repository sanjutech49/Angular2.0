using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.Contracts;
using System.Collections.Generic;
using System;
using MML.Web.LoanCenter.ViewModels.Conditions;
using MML.iMP.DocumentVault.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType]
    [Serializable]
    public class ConditionsSubViewModel
    {
       
        public List<ConditionViewModel> Conditions { get; set; }

        public ConditionViewModel NewCondition { get; set; }

        public List<Role> AssignedToList { get; set; }
        public List<EnumerationValue> CategoryList { get; set; }
        public List<Role> SignedOffList { get; set; }
        public List<ConditionConfiguration> CodesList { get; set; }
        public List<EnumerationValue> DueList { get; set; }
        public List<EnumerationValue> ItemsList { get; set; }
        public List<ForConditionMenuModel> ForList { get; set; }
        public List<EnumerationValue> DocumentList { get; set; }
        public List<EnumerationValue> SourceList { get; set; }
        public List<EnumerationValue> StatusList { get; set; }
        public List<EnumerationValue> DecisionsList { get; set; }
        public List<Int32> BorrowerConditionList { get; set; }
        public List<Int32> PropertyConditionList { get; set; }



    }
}
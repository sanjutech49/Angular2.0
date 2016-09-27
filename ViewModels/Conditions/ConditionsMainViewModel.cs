using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels.Conditions;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType]

    [Serializable]
    public class ConditionsMainViewModel
    {
        public ConditionsMainViewModel()
        {
            Init();
        }

        /// <summary>
        /// Initializes child viewmodels.
        /// </summary>
        private void Init()
        {
            LoanSummary = new ConditionsLoanSummaryViewModel();
            ConditionsSub = new ConditionsSubViewModel { Conditions = new List<ConditionViewModel>() };
            ConditionsDocuments = new List<ConditionsDocument>();
            DeliveryVault = new ConditionsDeliveryVaultViewModel();
            Privileges = new Privileges();
            ConditionFilter = new List<EnumerationValue>();
        }

        public Guid LoanId { get; set; }
        
        public ConditionsLoanSummaryViewModel LoanSummary { get; set; }
        public ConditionsSubViewModel ConditionsSub { get; set; }
        public List<ConditionsDocument> ConditionsDocuments { get; set; }
        public ConditionsDocVaultViewModel DocVault { get; set; }
        public ConditionsDeliveryVaultViewModel DeliveryVault { get; set; }
        public LoanDecisionStatusHistoryViewModel LastChange { get; set; }
        public Privileges Privileges { get; set; }
        public UserInfo CurrentUser { get; set; }
        public IEnumerable<Role> CurrentUserRoles { get; set; }
        public List<EnumerationValue> ConditionFilter { get; set; }
        public bool Error { get; set; }
        public bool IsOwnerOccupied { get; set; }
    }
}

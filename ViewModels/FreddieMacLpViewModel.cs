using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using MML.Common;
using MML.iMP.Aus.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType(Namespace = Namespaces.Default, TypeName = "FreddieMacLpViewModel")]
    [XmlRoot(Namespace = Namespaces.Default)]
    [DataContract(Namespace = Namespaces.Default, Name = "FreddieMacLpViewModel")]
    public class FreddieMacLpViewModel
    {
        [XmlElement(ElementName = "LoanId")]
        [DataMember()]
        public Guid LoanId
        {
            get;
            set;
        }

        [XmlElement(ElementName = "LpResults")]
        [DataMember()]
        public List<ServiceTrackingContract> LpResults
        {
            get;
            set;
        }

        [XmlElement(ElementName = "LpValidation")]
        [DataMember()]
        public List<ServiceValidationContract> LpValidation
        {
            get;
            set;
        }

        [XmlElement(ElementName = "LpResultsTitle")]
        [DataMember()]
        public ServiceTrackingContract LpResultsTitle
        {
            get;
            set;
        }

        [XmlElement(ElementName = "ProcessingItem")]
        [DataMember()]
        public bool ProcessingItem
        {
            get;
            set;
        }

        [XmlElement(ElementName = "CaseIds")]
        [DataMember()]
        public List<string> CaseIds
        {
            get;
            set;
        }

        public FreddieMacLpViewModel this[string caseId]
        {
            get
            {
                var model = new FreddieMacLpViewModel()
                {
                    LoanId = LoanId,
                    CaseIds = new List<string>() { caseId },
                    LpResults = (from r in LpResults
                                 where r.CaseId == caseId
                                 orderby r.StartTime.Value descending
                                 select r).ToList()
                };

                model.LpResultsTitle = model.LpResults[0];

                if (model.LpResultsTitle == null)
                    model.ProcessingItem = false;
                else
                    model.ProcessingItem = model.LpResultsTitle.EndTime == null ||
                                model.LpResultsTitle.EndTime == DateTime.MinValue;

                return model;
            }
        }

    }
}
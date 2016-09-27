using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using MML.Common;
using MML.iMP.Aus.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "FannieMaeDuViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "FannieMaeDuViewModel" )]
    public class FannieMaeDuViewModel
    {
        [XmlElement( ElementName = "LoanId" )]
        [DataMember()]
        public Guid LoanId 
        { 
            get; 
            set; 
        }

        [XmlElement( ElementName = "DuResults" )]
        [DataMember()]
        public List<ServiceTrackingContract> DuResults
        {
            get;
            set;
        }

        [XmlElement( ElementName = "DuValidation" )]
        [DataMember()]
        public List<ServiceValidationContract> DuValidation
        {
            get;
            set;
        }

        [XmlElement( ElementName = "DuResultsTitle" )]
        [DataMember()]
        public ServiceTrackingContract DuResultsTitle
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ProcessingItem" )]
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

        public FannieMaeDuViewModel this[string caseId]
        {
            get
            {
                var model = new FannieMaeDuViewModel()
                {
                    LoanId = LoanId,
                    CaseIds = new List<string>() { caseId },
                    DuResults = (from r in DuResults
                                 where r.CaseId == caseId 
                                 orderby r.StartTime.Value descending
                                 select r).ToList()
                };

                model.DuResultsTitle = model.DuResults[0];

                if (model.DuResultsTitle == null)
                    model.ProcessingItem = false;
                else
                    model.ProcessingItem = model.DuResultsTitle.EndTime == null ||
                                model.DuResultsTitle.EndTime == DateTime.MinValue;

                return model;
            }
        }
    }
}

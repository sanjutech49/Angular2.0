using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.iMP.Common;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType(Namespace = Namespaces.Default, TypeName = "BorrowerInformationViewModel")]
    [XmlRoot(Namespace = Namespaces.Default)]
    [DataContract(Namespace = Namespaces.Default, Name = "BorrowerInformationViewModel")]
    public class BorrowerInformationViewModel : MML.Contracts.ContractBase
    {
        /// <summary>
        /// Borrowers
        /// </summary>
        [XmlElement(ElementName = "Borrowers")]
        [DataMember]
        public List<MML.Contracts.Borrower> Borrowers
        {
            get; 
            set;
        }

        /// <summary>
        /// Section Title
        /// </summary>
        [XmlElement(ElementName = "SectionTitle")]
        [DataMember]
        public String SectionTitle
        {
            get;
            set;
        }

        /// <summary>
        /// Collapse Details
        /// </summary>
        [XmlElement(ElementName = "CollapseDetails")]
        [DataMember]
        public Boolean CollapseDetails
        {
            get;
            set;
        }
    }
}
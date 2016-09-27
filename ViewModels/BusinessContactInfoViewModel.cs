using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.iMP.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "BusinessContactInfoViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "BusinessContactInfoViewModel" )]
    public class BusinessContactInfoViewModel : MML.Contracts.ContractBase
    {
        /// <summary>
        /// Business contact
        /// </summary>
        [XmlElement( ElementName = "BusinessContact" )]
        [DataMember]
        public BusinessContact BusinessContact
        {
            get;
            set;
        }

        /// <summary>
        /// Business Contact Types
        /// </summary>
        [XmlElement( ElementName = "ContactBusinessTypes" )]
        [DataMember]
        public LookupCollection ContactBusinessTypes
        {
            get;
            set;
        }

        /// <summary>
        /// Phone types
        /// </summary>
        [XmlElement( ElementName = "PhoneTypes" )]
        [DataMember]
        public LookupCollection PhoneTypes
        {
            get;
            set;
        }

        /// <summary>
        /// States
        /// </summary>
        [XmlElement( ElementName = "States" )]
        [DataMember]
        public LookupCollection States
        {
            get;
            set;
        }
    }
}
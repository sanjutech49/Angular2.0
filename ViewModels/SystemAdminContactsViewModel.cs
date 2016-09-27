using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Web;
using System.Web.WebPages.Html;
using System.Xml.Serialization;
using MML.Common;
using MML.Contacts;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "SystemAdminContactsViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "SystemAdminContactsViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class SystemAdminContactsViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "ContactCompaniesAndUsers" )]
        [DataMember()]
        public List<CCompaniesAndContacts> ContactCompaniesAndUsers
        {
            get;
            set;
        }

        [XmlElement( ElementName = "CurrentContactType" )]
        [DataMember()]
        public Int32 CurrentContactType
        {
            get;
            set;
        }

        [XmlElement( ElementName = "CurrentActivity" )]
        [DataMember()]
        public Int32 CurrentActivity
        {
            get;
            set;
        }

        [XmlElement( ElementName = "LoanCompaniesAndContacts" )]
        [DataMember()]
        public List<LoanCompaniesAndContacts> LoanCompaniesAndContacts
        {
            get;
            set;
        }
    }
}

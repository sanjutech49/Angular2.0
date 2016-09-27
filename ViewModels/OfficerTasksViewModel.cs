using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts.DomainModels;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "OfficerTasksViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "OfficerTasksViewModel" )]
    [Serializable]
    public class OfficerTasksViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "OfficerTasks" )]
        [DataMember()]
        public List<OfficerTask> OfficerTasks
        {
            get;
            set;
        }

        [XmlElement( ElementName = "TaskOwners" )]
        [DataMember()]
        public List<SelectListItem> TaskOwners
        {
            get;
            set;
        }
    }
}
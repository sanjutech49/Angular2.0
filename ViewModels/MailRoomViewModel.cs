using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Web;
using System.Web.WebPages.Html;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "MailRoomViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "MailRoomViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class MailRoomViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "MailRoomItems" )]
        [DataMember()]
        public List<MailRoomView> MailRoomItems { get; set; }

        [XmlElement( ElementName = "ActivityType" )]
        [DataMember()]
        public Int32 ActivityType { get; set; }

        [XmlElement( ElementName = "DocumentTypeList" )]
        [DataMember()]
        public List<DocumentClass> DocumentTypeList { get; set; }

    }
}
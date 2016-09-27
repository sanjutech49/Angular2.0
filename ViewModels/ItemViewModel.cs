using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using MML.iMP.Common;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlTypeAttribute( Namespace = Namespaces.Default, TypeName = "ItemViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "ItemViewModel" )]
    [Serializable]
    public class ItemViewModel
    {
        [XmlAttribute( AttributeName = "Id" )]
        [DataMember]
        public Int32 Id
        {
            get;
            set;
        }

        [XmlAttribute( AttributeName = "Name" )]
        [DataMember]
        public string Name
        {
            get;
            set;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.iMP.Common;
using System.Runtime.Serialization;
using Telerik.Web.Mvc.UI;
using System.ComponentModel.DataAnnotations;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "UploadFileViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "UploadFileViewModel" )]
    [Serializable]
    public class UploadFileViewModel
    {
        [XmlElement( ElementName = "DocumentCategories" )]
        [DataMember()]
        public List<ItemViewModel> DocumentCategories 
        { 
            get; 
            set; 
        }

        [XmlElement( ElementName = "SelectedDocumentCategory" )]
        [DataMember()]
        public String SelectedDocumentCategory
        {
            get;
            set;
        }

        [XmlElement( ElementName = "LoanID" )]
        [DataMember()]
        public Guid LoanID
        {
            get;
            set;
        }

        [XmlElement( ElementName = "UserAccountID" )]
        [DataMember()]
        public int UserAccountID
        {
            get;
            set;
        } 
    }
}
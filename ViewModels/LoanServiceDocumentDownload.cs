using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.iMP.Common;
using System.Runtime.Serialization;
using Telerik.Web.Mvc.UI;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "LoanServiceDocumentDownload" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "LoanServiceDocumentDownload" )]
    [Serializable]
    public class LoanServiceDocumentDownload
    {
        [XmlElement( ElementName = "LoanServiceEventsList" )]
        [DataMember()]
        public List<LoanServiceEventsContract> LoanServiceEventsList
        {
            get;
            set;
        }
        
        [NonSerialized]
        private Dictionary<string, string> _documents = null;
        /// <summary>
        /// Gets or sets a dictionary containing key and value for documents
        /// by the associated integration service.
        /// </summary>
        [XmlIgnore]
        [IgnoreDataMember]
        public Dictionary<string, string> Documents
        {
            get { return _documents; }
            set { _documents = value; }
        }


        [EditorBrowsable( EditorBrowsableState.Never )]
        public byte[] SerializedDocuments
        {
            get { return ( Documents != null ? MML.Common.SerializationHelper.SerializeToByteArray( Documents ) : null ); }
            set
            {
                if ( value == null )
                {
                    Documents = null;
                }
                else
                {
                    Documents = ( Dictionary<string, string> )MML.Common.SerializationHelper.DeserializeFromByteArray( value );
                }
            }
        }

        private byte[] _serializedDocuments = null;

        /// <summary>
        /// Called when the object is about to be serialized.
        /// </summary>
        /// <param name="context">StreamingContext that the object serialization is takeing place in.</param>
        [OnSerializing]
        private void OnSerializing( StreamingContext context )
        {

            _serializedDocuments = SerializedDocuments;
        }

        /// <summary>
        /// Called when the object is fully deserialized.
        /// </summary>
        /// <param name="context">StreamingContext that the object serialization is takeing place in.</param>
        [OnDeserialized]
        private void OnDeserialized( StreamingContext context )
        {


            SerializedDocuments = _serializedDocuments;
            _serializedDocuments = null;
        }
    }
}
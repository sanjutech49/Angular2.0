using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.Common;
using System.Runtime.Serialization;
using System.Web.WebPages.Html;
using System.ComponentModel.DataAnnotations;
using MML.Common.Helpers;
using MML.Contracts;
using Telerik.Web.Mvc.UI;

namespace MML.Web.LoanCenter.ViewModels
{

    [XmlType( Namespace = Namespaces.Default, TypeName = "AppraisalViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "AppraisalViewModel" )]
    [Serializable]
    public class AppraisalViewModel
    {

        public AppraisalViewModel()
        {
            this.States = new List<SelectListItem>();
            this.PropertyTypes = new List<SelectListItem>();
            this.OcupancyTypes = new List<SelectListItem>();
            this.PhoneTypes = new List<SelectListItem>();
            this.CrediCardTypes = new List<SelectListItem>();
            this.AppraisalAccessInfo = new List<SelectListItem>();
            this.AppraisalProducts = new List<SelectListItem>();
            this.Years = new List<SelectListItem>();
            this.Loan = new Loan();
            this.BillingInformations = new List<SelectListItem>();
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Loan" )]
        [DataMember()]
        public Loan Loan
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "UserAccount" )]
        [DataMember()]
        public UserAccount UserAccount
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "HomePhone" )]
        [DataMember()]
        public String HomePhone
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "WorkPhone" )]
        [DataMember()]
        public String WorkPhone
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "CellPhone" )]
        [DataMember()]
        public String CellPhone
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Preferred" )]
        [DataMember()]
        public Int32 Preferred
        {
            get;
            set;
        }


        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "States" )]
        [DataMember()]
        public List<SelectListItem> States
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "PropertyTypes" )]
        [DataMember()]
        public List<SelectListItem> PropertyTypes
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "OcupancyTypes" )]
        [DataMember()]
        public List<SelectListItem> OcupancyTypes
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "PhoneTypes" )]
        [DataMember()]
        public List<SelectListItem> PhoneTypes
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "CrediCardTypes" )]
        [DataMember()]
        public List<SelectListItem> CrediCardTypes
        {
            get;
            set;
        }


        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "AppraisalAccessInfoId" )]
        [DataMember()]
        public int AppraisalAccessInfoId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "AppraisalAccessInfo" )]
        [DataMember()]
        public List<SelectListItem> AppraisalAccessInfo
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "AppraisalProducts" )]
        [DataMember()]
        public List<SelectListItem> AppraisalProducts
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "RushApplied" )]
        [DataMember()]
        public bool RushApplied
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "RushFee" )]
        [DataMember()]
        public decimal? RushFee
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "TotalFee" )]
        [DataMember()]
        public decimal TotalFee
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Years" )]
        [DataMember()]
        public List<SelectListItem> Years
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "BillingInformations" )]
        [DataMember()]
        public List<SelectListItem> BillingInformations
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "DisclosuresSummaryInfo" )]
        [DataMember()]
        public DisclosuresSummaryInfo DisclosuresSummaryInfo
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "LeadSourceInformation" )]
        [DataMember()]
        public String LeadSourceInformation
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "TitleInformation" )]
        [DataMember()]
        public String TitleInformation
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "PaidById" )]
        [DataMember()]
        public int PaidById
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "PaymentMethodId" )]
        [DataMember()]
        public int PaymentMethodId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Documents" )]
        [DataMember()]
        public List<Document> Documents
        {
            get;
            set;
        }

        [XmlElement( ElementName = "DocumentCategoryTypes" )]
        [DataMember()]
        public List<DropDownItem> DocumentCategoryTypes
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ActualInvestor" )]
        [DataMember()]
        public String ActualInvestor
        {
            get;
            set;
        }

        [XmlElement( ElementName = "TargetedInvestor" )]
        [DataMember()]
        public String TargetedInvestor
        {
            get;
            set;
        }

        [XmlElement( ElementName = "Conforming" )]
        [DataMember()]
        public Boolean? Conforming
        {
            get;
            set;
        }

        [XmlElement( ElementName = "SellerName" )]
        [DataMember()]
        public String SellerName
        {
            get
            {
                var seller = Loan.BusinessContacts.Where( bc => bc.BusinessContactCategory == BusinessContactCategory.SellerAgent ).FirstOrDefault();

                if ( seller != null )
                {
                    if ( seller.SellerType == SellerType.Individual )
                        return seller.FirstName + " " + seller.LastName;
                    
                    return seller.CompanyName;
                }

                return "";
            }
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "SellerTypeId" )]
        [DataMember()]
        public int SellerTypeId
        {
            get
            {
                var seller = Loan.BusinessContacts.Where( bc => bc.BusinessContactCategory == BusinessContactCategory.Seller ).FirstOrDefault();

                if ( seller != null )
                    return (int)seller.SellerType;

                return -1;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "AppraisalStatus" )]
        [DataMember()]
        public String AppraisalStatus
        {
            get
            {
                if ( Loan != null && Loan.OrderAppraisals != null && Loan.OrderAppraisals.Count > 0 && Loan.OrderAppraisals[ 0 ].AppraisalStatus != null )
                    return Loan.OrderAppraisals[0].AppraisalStatus.GetStringValue();

                return "";
            }
        }

        [XmlElement(ElementName = "IsAppraisalDisabled")]
        [DataMember()]
        public bool IsAppraisalDisabled
        {
            get;
            set;
        }
    }
}
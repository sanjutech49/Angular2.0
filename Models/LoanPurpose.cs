using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class LoanPurpose
    {
        /// <summary>
        /// 
        /// </summary>
        public LoanPurpose()
        {
            this.LoanType = Helpers.Enums.LoanType.PrePurchase;
        }
        
        /// <summary>
        /// 
        /// </summary>
        public LoanType LoanType
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String LoanProgram
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? LoanAmount
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? InterestRate
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? APR
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? LoanPointsPercent
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? LoanPointsAmount
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String PropertyAdress
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? EstimatedValue
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? LTV
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Decimal? CLTV
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public DateTime? LockDate
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String LoanNumber
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String Concierge
        {
            get;
            set;
        }
    }
}
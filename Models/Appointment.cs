using System;

namespace MML.Web.LoanCenter.Models
{
    /// <summary>
    /// 
    /// </summary>
    [Serializable]
    public class Appointment
    {
        /// <summary>
        /// 
        /// </summary>
        public DateTime Start
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public DateTime End
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String Note
        {
            get;
            set;
        }
    }
}
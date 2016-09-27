using System;

namespace MML.Web.LoanCenter.Models
{
    public class ConciergeCommandEmbedded
    {
        public String ConciergeUrl { get; set; }

        public String Title { get; set; }

        public string TitleInformation { get; set; }

        public string AdditionalInformation { get; set; }

        public string LeadSourceInformation { get; set; }

        public string HearAboutUs { get; set; }

        public bool HideHeader { get; set; }
    }
}
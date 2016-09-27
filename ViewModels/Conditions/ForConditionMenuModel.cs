using System;

namespace MML.Web.LoanCenter.ViewModels.Conditions
{
    [Serializable]
    public class ForConditionMenuModel
    {
        public String Id { get; set; }
       
        public String JointId { get; set; }
        public bool IsCoborrower { get; set; }

        public String Value { get; set; }
        public String Section { get; set; }
       
        public int SourceId { get; set; }
        public String SourceDescription { get; set; }
        public String ForValue { get; set; }

        public String SectionName { get; set; }
    }
}

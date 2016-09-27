using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [Serializable]
    public class ConditionsDeliveryVaultViewModel
    {
        public DeliveryVaultStackingOrder DeliveryVaultStackingOrder { get; set; }
    }
}
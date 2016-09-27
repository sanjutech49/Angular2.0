using MML.Common;
using System;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Helpers.ModelBinders
{
    public class DecimalModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            ValueProviderResult valueResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            var modelState = new ModelState { Value = valueResult };
            object actualValue = null;
            try
            {                
                if (!(bindingContext.ModelMetadata.IsNullableValueType && string.IsNullOrEmpty(valueResult.AttemptedValue)))
                {
                    actualValue = Convert.ToDecimal(valueResult.AttemptedValue, CultureInfo.CurrentCulture);
                }

            }
            catch (FormatException e)
            {
                modelState.Errors.Add(e);
            }

            bindingContext.ModelState.Add(bindingContext.ModelName, modelState);
            return actualValue;
        }
    }
}
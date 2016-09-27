using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace MML.Web.LoanCenter.Helpers.Attributes
{

    public class UrlAttribute : ValidationAttribute
    {         
        public override bool IsValid(object value)
        {          
            if ( value == null )
            {
                return true;
            }

            Regex regex = new Regex( @"(http|https)://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?" );

            if ( !regex.IsMatch( value.ToString() ) )
            {
                return false;
            }

            return true;
        }
    } 
}
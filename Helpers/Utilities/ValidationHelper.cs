using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    /// <summary>
    ///  Validation helper methods
    /// </summary>
    [Serializable]
    public class ValidationHelper
    {
        #region <<< Public implementation >>>

        /// <summary>
        /// Validates credit card number
        /// </summary>
        /// <param name="cardNumber">CC number</param>
        /// <param name="cardType">CC type</param>
        /// <returns>CC valid?</returns>
        public bool ValidateCreditCard( String cardNumber, int cardType )
        {
            bool IsValid = false;

            if ( String.IsNullOrWhiteSpace( cardNumber ) )
                return IsValid;

            if ( cardNumber.Length > 12 && cardNumber.Substring( 0, 12 ).Equals( "************" ) )
                return true;
            CreditCardType cardTypeEnum = ( CreditCardType )cardType;

            switch ( cardTypeEnum )
            {
                case CreditCardType.MasterCard:
                    IsValid = IsValidMasterCard( cardNumber.Trim() );
                    break;
                case CreditCardType.Discover:
                    IsValid = IsValidDiscover( cardNumber.Trim() );
                    break;
                case CreditCardType.Visa:
                case CreditCardType.VisaElectron:
                    IsValid = IsValidVisa( cardNumber.Trim() );
                    break;
                default:
                    break;
            }

            return IsValid;
        }

        #endregion

        #region <<< Private implementation >>>

        /// <summary>
        /// Check visa card number validity
        /// </summary>
        /// <param name="cardNumber"></param>
        /// <returns></returns>
        private bool IsValidVisa( string cardNumber )
        {
            bool isLuhnValid = false;

            if ( ( cardNumber.Length == 16 || cardNumber.Length == 13 ) &&
                cardNumber.StartsWith( "4" ) )
            {
                isLuhnValid = IsLuhnValid( cardNumber );
                return isLuhnValid;
            }
            else
            {
                return isLuhnValid;
            }
        }

        /// <summary>
        /// Check master card number validity
        /// </summary>
        /// <param name="cardNumber"></param>
        /// <returns></returns>
        private bool IsValidMasterCard( string cardNumber )
        {
            bool isLuhnValid = false;

            if ( cardNumber.Length == 16 && ( cardNumber.StartsWith( "51" ) ||
                cardNumber.StartsWith( "52" ) || cardNumber.StartsWith( "53" ) ||
                cardNumber.StartsWith( "54" ) || cardNumber.StartsWith( "55" ) ) )
            {
                isLuhnValid = IsLuhnValid( cardNumber );
                return isLuhnValid;
            }
            else
            {
                return isLuhnValid;
            }
        }

        private bool IsValidDiscover( string cardNumber )
        {
            bool isLuhnValid = false;

            if ( ( cardNumber.Length == 16 || cardNumber.Length == 13 ) &&
                cardNumber.StartsWith( "65" ) || cardNumber.StartsWith( "6011" ) )
            {
                isLuhnValid = IsLuhnValid( cardNumber );
                return isLuhnValid;
            }
            else
            {
                return isLuhnValid;
            }
        }

        // <summary>
        /// Luhn Formula / mod 10 validation of primary account nubmer
        /// </summary>
        /// <returns></returns>
        private bool IsLuhnValid( string number )
        {
            int counter = 1;
            int currentNumber = 0;
            int numbersSum = 0;

            for ( int i = number.Length - 1; i >= 0; i-- )
            {
                bool isParsed = Int32.TryParse( number[ i ].ToString(), out currentNumber );

                if ( isParsed )
                {
                    if ( counter % 2 == 0 )
                    {
                        string currentNumberString = ( currentNumber * 2 ).ToString();

                        foreach ( char numberChar in currentNumberString )
                        {
                            numbersSum += Int32.Parse( numberChar.ToString() );
                        }
                    }
                    else
                    {
                        numbersSum += currentNumber;
                    }
                }
                else
                {
                    return false;
                }

                counter++;
            }

            //check mod10 validity
            if ( numbersSum % 10 == 0 )
                return true;
            else
                return false;
        }

        #endregion
    }
}
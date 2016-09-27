using System;
using System.Collections.Generic;
using System.Linq;
using MML.Contracts;
using MML.Common;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    /// <summary>
    /// 
    /// </summary>
    public class AddressHelper
    {
        public static bool BorrowerAndCoborrowerAddressesAreSame( List<Address> borrowerAddresses, List<Address> coBorrowerAddresses )
        {
            try
            {
                foreach ( var borrowerAddress in borrowerAddresses )
                {
                    if ( !coBorrowerAddresses.Any( a => a.AddressType == borrowerAddress.AddressType ) || !AddressesAreSame( borrowerAddress, coBorrowerAddresses.Where( a => a.AddressType == borrowerAddress.AddressType ).FirstOrDefault() ) )
                        return false;
                }

                return true;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "Exception in  BorrowerAndCoborrowerAddressesAreSame()", ex );
                return false;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <returns></returns>
        private static bool AddressesAreSame( Address a, Address b )
        {
            if ( a == null || b == null )
            {
                return false;
            }

            if ( a.StreetName != b.StreetName || a.CityName != b.CityName || a.ZipCode != b.ZipCode )
            {
                return false;
            }

            return a.AddressType == AddressType.Mailing || ( a.IsOwn == b.IsOwn && a.IsRent == b.IsRent && a.NumberOfYears == b.NumberOfYears );
        }
    }
}
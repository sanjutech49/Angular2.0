using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Classes
{
    public class LoginHelper
    {
        public void SetBranding( UserAccount currentUser )
        { 

            if ( currentUser != null )
            {
                BrandingConfiguration brandingConfiguration = CompanyProfileServiceFacade.RetrieveBrandingConfigurationByHierarchy( new BrandingConfigurationHierarchy()
                {
                    BranchId = currentUser.BranchId,
                    ChannelId = currentUser.ChannelId,
                    DivisionId = currentUser.DivisionId
                } );

                if ( brandingConfiguration != null )
                {
                    HttpContext.Current.Session[ SessionHelper.BrandName ] = brandingConfiguration.DisplayName;
                    HttpContext.Current.Session[ SessionHelper.StyleSheetTheme ] = brandingConfiguration.Theme;
                    HttpContext.Current.Session[ SessionHelper.BrandNameShort ] = brandingConfiguration.NameShort;
                    HttpContext.Current.Session[ SessionHelper.BrandNameDomain ] = brandingConfiguration.Url;
                    HttpContext.Current.Session[ SessionHelper.BrandPhone ] = brandingConfiguration.Phone;
                    HttpContext.Current.Session[ SessionHelper.CompanyCopyrightName ] = brandingConfiguration.CopyrightName;
                    HttpContext.Current.Session[ SessionHelper.CompanyProfileId ] = brandingConfiguration.CompanyProfileId;
                    HttpContext.Current.Session[ SessionHelper.BrandingConfiguration ] = brandingConfiguration;
                    HttpContext.Current.Session[ SessionHelper.BrandNameCssFile ] = brandingConfiguration.BrandNameCssFile;
                    HttpContext.Current.Session[ SessionHelper.BrandingConfiguration ] = brandingConfiguration;
                }
            }

        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using System.Web.Optimization;
using WebGrease;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class CDNHelper
    {
        public static String ImagesStaticContentUrl
        {
            get { return GetFromSession( SessionHelper.LoanCenterImagesStaticContentServerUrl ); }
        }

        public static String CssStaticContentUrl
        {
            get { return GetFromSession( SessionHelper.LoanCenterCssStaticContentServerUrl ); }
        }

        public static String JavaScriptStaticContentUrl
        {
            get { return GetFromSession( SessionHelper.LoanCenterJavascriptStaticContentServerUrl ); }
        }

        public static void SetCdnSettingInSession()
        {            
            var keyList = new[]
                              {
                                  SessionHelper.LoanCenterImagesStaticContentServerUrl, 
                                  SessionHelper.LoanCenterCssStaticContentServerUrl,
                                  SessionHelper.LoanCenterJavascriptStaticContentServerUrl
                              };

            var isSettingsInSession = true;

            foreach ( var key in keyList )
            {
                if( HttpContext.Current.Session[ key ] == null )
                {
                    isSettingsInSession = false;
                    break;
                }
            }

            if ( isSettingsInSession ) return;

            var cdnSettings = CompanyProfileServiceFacade.RetrieveCdnSetting( CdnType.LoanCenter );
            var version = AssemblyHelper.GetAssemblyVersion();

            if( cdnSettings != null )
            {
                foreach( var key in keyList )
                {
                    if ( !String.IsNullOrEmpty( key ) )
                    {
                        var url = cdnSettings.FirstOrDefault( c => c.ServerUrlType == key );

                        if ( url != null && !String.IsNullOrEmpty( url.ServerUrl ) )
                        {
                            HttpContext.Current.Session[ key ] = url.ServerUrl.Replace( "##path&&version##",
                                                                                        String.Format( "LoanCenter/{0}/", version ) );
                        }
                    }
                }
            }
        }

        private static String GetFromSession( String key )
        {
            var session = HttpContext.Current.Session[ key ];

            var toReturn = session != null ? session.ToString() : String.Empty;

            var index = toReturn.Length - 1;

            if ( toReturn != String.Empty && toReturn[ index ] == '/' ) toReturn = toReturn.Remove( index );

            return toReturn;
        }

        public static void ResetBundlesAndSessionVariables()
        {
            BundleTable.Bundles.ResetAll();
            HttpContext.Current.Session[ SessionHelper.LoanCenterImagesStaticContentServerUrl ] = null;
            HttpContext.Current.Session[ SessionHelper.LoanCenterCssStaticContentServerUrl ] = null;
            HttpContext.Current.Session[ SessionHelper.LoanCenterJavascriptStaticContentServerUrl ] = null;
        }
    }
}

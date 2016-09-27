using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using System.Text;
using System.Reflection;
using System.Security.Cryptography;
using MML.Web.LoanCenter.Helpers.Classes;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class MinifierHelper
    {
        public static MvcHtmlString MinifyCollection( bool isCssMinified, params string[] partialFiles )
        {
            string hash = CollectionHash( partialFiles );
            string singleLink = string.Empty;

            try
            {
                var path = string.Empty;
                
                if ( isCssMinified )
                    path = HttpContext.Current.Server.MapPath( "/Content/" + hash + ".css" );
                else
                    path = HttpContext.Current.Server.MapPath( "/Scripts/" + hash + ".js" );


                if ( !File.Exists( path ) )
                {
                    using ( var outFile = File.OpenWrite( path ) )
                    {
                        using ( var outWriter = new StreamWriter( outFile ) )
                        {
                            foreach ( var f in partialFiles )
                            {
                                using ( var inFile = File.OpenRead( HttpContext.Current.Server.MapPath( f ) ) )
                                {
                                    using ( var inReader = new StreamReader( inFile ) )
                                    {
                                        try
                                        {
                                            if ( isCssMinified )
                                                new CssMin().Minify( inReader, outWriter );
                                            else
                                            {
                                                JavaScriptMin.Compress(inReader, outWriter);
                                            }
                                        }
                                        catch
                                        {
                                            outWriter.Write( inReader.ReadToEnd() );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if ( isCssMinified )
                    singleLink = string.Format( "<link href='/Content/{0}.css' rel='stylesheet' media='all'/>", hash );
                else
                    singleLink = string.Format( "<script src='/Scripts/{0}.js' type='text/javascript'></script>", hash );

                return new MvcHtmlString(singleLink);
            }
            catch
            {
                if ( isCssMinified )
                    return new MvcHtmlString( string.Format( "\r\n<link href='{0}' rel='stylesheet' media='all'/>", partialFiles.Select( f => f ) ));
                else
                    return new MvcHtmlString( string.Format( "\r\n<script src='{0}' type='text/javascript'></script>", partialFiles.Select( f => f ) ) );

            }
        }

        private static string CollectionHash( string[] partialFiles )
        {
            var sb = new StringBuilder();

            foreach ( var f in partialFiles )
                sb.Append( f );

            sb.Append( Assembly.GetExecutingAssembly().GetHashCode() );

            using ( var md5 = MD5.Create() )
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes( sb.ToString() );
                byte[] h = md5.ComputeHash( inputBytes );

                var sb2 = new StringBuilder();
                for ( int i = 0; i < h.Length; i++ )
                    sb2.Append( h[ i ].ToString( "X2" ) );

                return sb2.ToString();
            }
        }
    }
}
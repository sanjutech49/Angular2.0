using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MML.Web.LoanCenter.Helpers.MvcHelpers
{
    public class Fieldset : IDisposable
    {
        protected HtmlHelper _helper;

        private string _legend;

        private string _fieldset;


        public Fieldset( HtmlHelper helper, string legend, object fieldsetAttributes = null, object legendAttributes = null )
        {
            _helper = helper;

            // legend 
            var legendBuilder = new TagBuilder( "legend" );

            if ( legendAttributes != null )
                legendBuilder.MergeAttributes( new RouteValueDictionary( legendAttributes ) );

            legendBuilder.InnerHtml = legend ?? "Legend";

            _legend = legendBuilder.ToString();

            // fieldset

            var fieldsetBuilder = new TagBuilder( "fieldset" );

            if ( fieldsetAttributes != null )
                fieldsetBuilder.MergeAttributes( new RouteValueDictionary( fieldsetAttributes ) );

            _fieldset = fieldsetBuilder.ToString( TagRenderMode.StartTag );


            // result
            _helper.ViewContext.Writer.Write( _fieldset + _legend );
        }

        public void Dispose()
        {
            _helper.ViewContext.Writer.Write( "</fieldset>" );
        }
    }
}
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;
using Microsoft.Practices.EnterpriseLibrary.Common.Utility;
using MML.Calculator;
using MML.Common;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Extensions
{

    public static class HtmlExtensions
    {
        #region  RadioButtonForEnum

        public static MvcHtmlString RadioButtonForEnum<TModel, TProperty>(
            this HtmlHelper<TModel> htmlHelper,
            Expression<Func<TModel, TProperty>> expression,
           object htmlAttributes
        )
        {
            var enums = Enum.GetValues( typeof( TProperty ) ).Cast<Enum>().ToList();

            var metaData = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            var sb = new StringBuilder();
            foreach ( var enumeration in enums )
            {
                if ( !enumeration.IsHiddenOnUI(  ))
                {
                    var id = string.Format(
                        "{0}_{1}_{2}",
                        htmlHelper.ViewData.TemplateInfo.HtmlFieldPrefix,
                        metaData.PropertyName,
                        enumeration
                        );
                    //Create a unique id based on the radio button value
                    var valueDictionary = new RouteValueDictionary(htmlAttributes);
                    if (!valueDictionary.ContainsKey("id"))
                    {
                        valueDictionary.Add("id", id);
                    }
                    

                    var radio = htmlHelper.RadioButtonFor(expression, enumeration, valueDictionary).ToHtmlString();
                    sb.AppendFormat(
                        "{0}<label for=\"{1}\" class= \"imp-lbl-radio\">{2}</label> ",
                        radio,
                        id,
                        HttpUtility.HtmlEncode( enumeration.GetStringValue() )
                        );
                }
            }
            return MvcHtmlString.Create(sb.ToString());
        }

        #endregion

        #region CheckBoxListFor

        /// <summary>
        /// Returns a checkbox for each of the provided <paramref name="items"/>.
        /// </summary>
        public static MvcHtmlString CheckBoxListFor<TModel, TValue>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, IEnumerable<SelectListItem> items, object htmlAttributes = null)
        {
            var listName = ExpressionHelper.GetExpressionText(expression);
            var metaData = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            items = GetCheckboxListWithDefaultValues(metaData.Model, items);
            return htmlHelper.CheckBoxList(listName, items, htmlAttributes);
        }

        #endregion

        #region GetCheckboxListWithDefaultValues

        private static IEnumerable<SelectListItem> GetCheckboxListWithDefaultValues(object defaultValues, IEnumerable<SelectListItem> selectList)
        {
            var defaultValuesList = defaultValues as IEnumerable;
            if (defaultValuesList == null)
                return selectList;
            IEnumerable<string> values = from object value in defaultValuesList
                                         select Convert.ToString(value, CultureInfo.CurrentCulture);
            var selectedValues = new HashSet<string>(values, StringComparer.OrdinalIgnoreCase);
            var newSelectList = new List<SelectListItem>();
            selectList.ForEach(item =>
            {
                item.Selected = (item.Value != null) ? selectedValues.Contains(item.Value) : selectedValues.Contains(item.Text);
                newSelectList.Add(item);
            });
            return newSelectList;
        }

        #endregion

        #region CheckBoxList

        /// <summary>
        /// Returns a checkbox for each of the provided <paramref name="items"/>.
        /// </summary>
        public static MvcHtmlString CheckBoxList(this HtmlHelper htmlHelper, string listName, IEnumerable<SelectListItem> items, object htmlAttributes = null)
        {
            var container = new TagBuilder("div");
            foreach (var item in items)
            {
                var divContainer = new TagBuilder("div");
                divContainer.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);

                var cb = new TagBuilder("input");
                cb.MergeAttribute("type", "checkbox");
                cb.MergeAttribute("name", listName);
                cb.MergeAttribute("value", item.Value ?? item.Text.Replace(" ", string.Empty));
                cb.MergeAttribute("class", "imp-checkbox");
                cb.MergeAttribute("id", listName.Replace('.', '_') + "." + item.Text.Replace(" ", string.Empty));
                if (item.Selected)
                {
                    cb.MergeAttribute("checked", "checked");
                }
                var hidden = new TagBuilder("input");
                hidden.MergeAttribute("type", "hidden");
                hidden.MergeAttribute("value", "false");
                hidden.MergeAttribute("name", listName + "_" + item.Text.Replace(" ", string.Empty));

                var label = new TagBuilder("label");
                label.MergeAttribute("class", "imp-lb-checkbox"); // default class
                label.MergeAttribute("for", listName.Replace('.', '_') + "." + item.Text.Replace(" ", string.Empty));
                
                label.InnerHtml = item.Text;

                divContainer.InnerHtml = cb.ToString(TagRenderMode.SelfClosing) + hidden.ToString(TagRenderMode.SelfClosing) + label;
                container.InnerHtml += divContainer.ToString();
            }
            return new MvcHtmlString(container.ToString());
        }
       

        /// <summary>
        /// Converts IEnumerable Enum to LookupItem
        /// </summary>
        /// <typeparam name="TEnum"></typeparam>
        /// <param name="enumList"></param>
        /// <returns></returns>
        public static IEnumerable<SelectListItem> ToSelectList<TEnum>( this List<TEnum> enumList )
        {           
            if ( enumList == null )
            {
                return new[] { new SelectListItem() };
            }

            var enumerable = enumList.Cast<Enum>() as Enum[] ?? enumList.Cast<Enum>().ToArray();
            var enums = Enum.GetValues( typeof( TEnum ) ).Cast<Enum>().ToList();

            return ( from t in enums
                where !t.IsHiddenOnUI( )
                select new SelectListItem
                {
                    Text = t.GetStringValue( ), Value = t.ToString( ), Selected = enumerable.Contains( t )
                } ).ToList( );                  
        }

        #endregion

        #region LabelFor


        public static MvcHtmlString LabelForRadio<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string labelText, object htmlAttributes, string id = "")
        {
            return LabelForRadio(html, expression, labelText, new RouteValueDictionary(htmlAttributes), id);
        }

        public static MvcHtmlString LabelForRadio<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string labelText, IDictionary<string, object> htmlAttributes, string id = "")
        {
             
 
            string htmlFieldName = ExpressionHelper.GetExpressionText(expression);

            if (String.IsNullOrEmpty(labelText))
            {
                return MvcHtmlString.Empty;
            }

            TagBuilder tag = new TagBuilder("label");
            tag.MergeAttributes(htmlAttributes);
            tag.Attributes.Add("for", html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldId(htmlFieldName) + (string.IsNullOrEmpty(id) ? "" : "_" + id));
            tag.SetInnerText(labelText);
            return MvcHtmlString.Create(tag.ToString(TagRenderMode.Normal));
        }


        #endregion

        #region RadioButtonWithTextBoxForSelectList

        /// <summary>
        /// Creates radio button list with labels, and replaces predefined text in labels with textboxes
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <typeparam name="TProperty"></typeparam>
        /// <typeparam name="TTxtBoxProperty"></typeparam>
        /// <param name="htmlHelper"></param>
        /// <param name="expression"></param>
        /// <param name="expressionTextBox"></param>
        /// <param name="selectListItems">List of items used to create radio button list</param>
        /// <param name="substringToReplace">If found, this will be replaced with texboxes</param>
        /// <param name="htmlAttributesRadioButton"></param>
        /// <param name="htmlAttributesTxtBox"></param>
        /// <param name="htmlAttributesLabel"></param>
        /// <returns></returns>
        public static MvcHtmlString RadioButtonListForInvestorMatrix<TModel, TProperty, TTxtBoxProperty>(
           this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression,
           Expression<Func<TModel, TTxtBoxProperty>> expressionTextBox, IEnumerable<SelectListItem> selectListItems,
           string substringToReplace, object htmlAttributesRadioButton, object htmlAttributesLabel, object htmlAttributesTxtBox = null)
        {
            try
            {
                var sb = new StringBuilder();

                if ( selectListItems != null )
                {
                    string fullNameRadioButton = ExpressionHelper.GetExpressionText( expression );
                    List<int> userDefinedValuesFromModel = ( ModelMetadata.FromLambdaExpression( expressionTextBox, htmlHelper.ViewData ).Model as List<int> );
                    string fullNameTextBox = ExpressionHelper.GetExpressionText( expressionTextBox );


                    // Create a radio button for each item in the list 
                    foreach ( SelectListItem item in selectListItems )
                    {
                        int id; // id will be used to generate html attributes (id, name)

                        if ( !int.TryParse( item.Value, out id ) )
                        {
                            TraceHelper.Warning( TraceCategory.LoanCenter, "Could not parse Id" );
                            continue;
                        }
                        --id;

                        // Generate an id which will be asigned to radio button 
                        var radioButtonId = string.Format( "{0}_{1}", fullNameRadioButton.Replace( "[", "" ).Replace( "]", "" ).Replace( ".", "_" ), id );
 
                        // make the label for radio button
                        StringBuilder label = new StringBuilder(htmlHelper.LabelForRadio(expression, HttpUtility.HtmlEncode(item.Text), htmlAttributesLabel, id.ToString()).ToString());

                    
                        int numberOfOccurences = new Regex( Regex.Escape( substringToReplace ) ).Matches( label.ToString( ) ).Count;

                        if (numberOfOccurences > 0)
                        {
                            label = ReplaceCustomValuesWithTextBox(htmlHelper, substringToReplace, htmlAttributesTxtBox, label, fullNameTextBox, id, item, userDefinedValuesFromModel, numberOfOccurences, htmlAttributesLabel);
                        }


                        // Create and populate radio button 
                        RouteValueDictionary radioButtonAttributes = HtmlHelper.AnonymousObjectToHtmlAttributes( htmlAttributesRadioButton );
                        radioButtonAttributes.Add( "id", radioButtonId );
                        var radio = htmlHelper.RadioButton( fullNameRadioButton, item.Value, item.Selected, radioButtonAttributes ).ToHtmlString();


                        // Create the html string that will be returned to the client. 
                        // Div, and radio button and label for rb with textboxes in div
                        // e.g. <div class="RadioButton">
                        // <input type="radio" value="3" name="InvestorProduct.InvestorProductRule.InvestorRulesConfigurationId" 
                        // id="rb_InvestorProduct_InvestorProductRule_InvestorRulesConfigurationId_2" data-val="False">
                        // <label for="rb_InvestorProduct_InvestorProductRule_InvestorRulesConfigurationId_2">Greater of Note Rate + 
                        // <input type="text" value="" style="width:50px; font-size: inherit;" name="InvestorProduct.InvestorProductRule.UserDefinedValues[0]" 
                        // id="InvestorProduct_InvestorProductRule_UserDefinedValues_2_0" data-val="false" disabled=""> 
                        // or Fully Indexed Rate</label></div>
                        sb.AppendFormat("<div class=\"{0}\">{1}{2}</div>", "imp-sa-investor-rb-list", radio, label);
                    }
                }
                return MvcHtmlString.Create( sb.ToString() );
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "LoanCenter::HtmlExtensions::RadioButtonWithTextBoxForSelectList", ex, Guid.Empty, IdentityManager.GetUserAccountId() );
                return new MvcHtmlString( "" );
            }
        }

        #endregion

        #region ReplaceCustomValuesWithTextBox

        private static StringBuilder ReplaceCustomValuesWithTextBox<TModel>( HtmlHelper<TModel> htmlHelper, string substringToReplace,
            object htmlAttributesTxtBox, StringBuilder label, string fullNameTextBox, int id, SelectListItem item,
            List<int> userDefinedValuesFromModel, int numberOfOccurences, object htmlAttributesLabel)
        {
            try
            {
                var userDefinedValuesTextboxes = new List<string>();

                // Replace all occurences of specified text with textboxes
                for ( int i = 0; i < numberOfOccurences; i++ )
                {
                    var textBoxId = string.Format( "{0}_{1}_{2}", fullNameTextBox.Replace( "[", "" ).Replace( "]", "" ).Replace( ".", "_" ), id, i + 1 );
                    RouteValueDictionary textBoxAttributes = HtmlHelper.AnonymousObjectToHtmlAttributes( htmlAttributesTxtBox );
                    textBoxAttributes.Add( "id", textBoxId );
                    RouteValueDictionary labelAttributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributesLabel);

                    string textBoxName = string.Format( "{0}[{1}]", fullNameTextBox, i );

                    string styleForLabel = labelAttributes.Keys.Where(k=>k=="style").FirstOrDefault()==null ? string.Empty:labelAttributes["style"].SafeToString();
                    // Add textbox with values to div for selected radio button            
                    if ( item.Selected && userDefinedValuesFromModel != null && userDefinedValuesFromModel.Count > 0 )
                    {
                        string txtBoxValue = i < userDefinedValuesFromModel.Count ? userDefinedValuesFromModel[ i ].ToString() : string.Empty;
                        string textBox = htmlHelper.TextBox( textBoxName, txtBoxValue, textBoxAttributes ).ToString();
                        userDefinedValuesTextboxes.Add(string.Concat("</label>", " ", textBox, "<label style=\"" + styleForLabel + "\" >"));
                    }
                    else
                    {
                        // Add textbox with values to div for selected radio button            
                        string textBox = htmlHelper.TextBox( textBoxName, "", textBoxAttributes ).ToString();
                        userDefinedValuesTextboxes.Add(string.Concat("</label>", " ", textBox, "<label style=\"" + styleForLabel + "\" >"));
                    }
                }

                QualifyingRateCalculator qualifyingRateCalculator = new QualifyingRateCalculator();

                //replace text with user defined values
                string labelReplaced = qualifyingRateCalculator.ReplaceOccurencesOfTextInString( label.ToString( ), substringToReplace, userDefinedValuesTextboxes );

                return new StringBuilder( labelReplaced );
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "LoanCenter::HtmlExtensions::ReplaceCustomValuesWithTextBox", ex, Guid.Empty, IdentityManager.GetUserAccountId() );
                return new StringBuilder( "" );
            }
        }

        #endregion

        #region RadioButtonForSelectList

        public static MvcHtmlString RadioButtonForSelectList<TModel, TProperty>(
           this HtmlHelper<TModel> htmlHelper,
           Expression<Func<TModel, TProperty>> expression,
           IEnumerable<SelectListItem> selectListItems, 
            bool disableValidation = false)
        {
            string fullName = ExpressionHelper.GetExpressionText( expression );
            var sb = new StringBuilder();

            if ( selectListItems != null )
            {
                // Create a radio button for each item in the list 
                foreach ( SelectListItem item in selectListItems )
                {
                    // Generate an id to be given to the radio button field 
                    var id = string.Format( "rb_{0}_{1}", fullName.Replace( "[", "" ).Replace( "]", "" ).Replace( ".", "_" ),  item.Value );
         
                    var label = ( htmlHelper.Label( id, HttpUtility.HtmlEncode( item.Text ) ) ).ToString();

                    // Create and populate a radio button using the existing html helpers 
                    var radio =  htmlHelper.RadioButton( fullName, item.Value, item.Selected, new {id, data_val = !disableValidation } ).ToHtmlString( );


                    // Create the html string that will be returned to the client 
                    // e.g. <input data-val="true" data-val-required=
                    //   "You must select an option" id="TestRadio_1" 
                    //   name="TestRadio" type="radio"
                    //   value="1" /><label for="TestRadio_1">Line1</label> 
                    sb.AppendFormat( "<div class=\"RadioButton\">{0}{1}</div>", radio, label );
                }
            }
            //sb.Replace( "[User Defined Value]", "<input type=\"text\" name=\"InvestorProduct.InvestorRule.UserDefinedValue\"><br>" );
            return MvcHtmlString.Create( sb.ToString() );
        }

        #endregion
    }
}

using MML.Web.LoanCenter.Helpers.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace MML.Web.LoanCenter.App_Start
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jQuery/jquery-{version}.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
        //                "~/Scripts/jquery-ui-{version}.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
        //                "~/Scripts/jquery.unobtrusive*",
        //                "~/Scripts/jquery.validate*"));

        //    bundles.Add(new ScriptBundle("~/bundles/angular").Include(
        //                "~/Scripts/angular.js",
        //                "~/Scripts/angular-ng-grid.js",
        //                "~/Scripts/angular-resource.js",
        //                "~/Scripts/angular-route.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/app").Include(
        //                "~/Scripts/app/app.js",
        //                "~/Scripts/app/services.js",
        //                "~/Scripts/app/directives.js",
        //                "~/Scripts/app/main.js",
        //                "~/Scripts/app/contact.js",
        //                "~/Scripts/app/about.js",
        //                "~/Scripts/app/demo.js"
        //                ));

        //    // Use the development version of Modernizr to develop with and learn from. Then, when you're
        //    // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
        //    bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
        //                "~/Scripts/modernizr-*"));

        //    bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
        //        "~/Content/bootstrap.css",
        //        "~/Content/bootstrap-responsive.css"
        //        ));


        //    bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css",
        //        "~/Content/ng-grid.css"));

        //    bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
        //                "~/Content/themes/base/jquery.ui.core.css",
        //                "~/Content/themes/base/jquery.ui.resizable.css",
        //                "~/Content/themes/base/jquery.ui.selectable.css",
        //                "~/Content/themes/base/jquery.ui.accordion.css",
        //                "~/Content/themes/base/jquery.ui.autocomplete.css",
        //                "~/Content/themes/base/jquery.ui.button.css",
        //                "~/Content/themes/base/jquery.ui.dialog.css",
        //                "~/Content/themes/base/jquery.ui.slider.css",
        //                "~/Content/themes/base/jquery.ui.tabs.css",
        //                "~/Content/themes/base/jquery.ui.datepicker.css",
        //                "~/Content/themes/base/jquery.ui.progressbar.css",
        //                "~/Content/themes/base/jquery.ui.theme.css"));

            if (bundles.Any(b => b.Path == "~/Content/LayoutBundleCss") && bundles.Any(b => b.Path == "~/Scripts/LayoutBundleJavascript"))
                return;

            CDNHelper.SetCdnSettingInSession();


            if (string.IsNullOrWhiteSpace(CDNHelper.JavaScriptStaticContentUrl) || string.IsNullOrWhiteSpace(CDNHelper.CssStaticContentUrl))
                bundles.UseCdn = false;
            else
                bundles.UseCdn = true;

            Bundle cssBundle = new StyleBundle("~/Content/LayoutBundleCss", string.Format("{0}/Content/LayoutCss-3.css", CDNHelper.CssStaticContentUrl))
                                    .Include("~/Content/LayoutCss-3.css");

            Bundle javascriptBundle = new ScriptBundle("~/Scripts/LayoutBundleJavascript", string.Format("{0}/Scripts/LayoutJavascript.js", CDNHelper.JavaScriptStaticContentUrl))
                                    .Include("~/Scripts/LayoutJavascript.js");

            bundles.Add(cssBundle);
            bundles.Add(javascriptBundle);

            BundleTable.EnableOptimizations = true;
        }
    }
}
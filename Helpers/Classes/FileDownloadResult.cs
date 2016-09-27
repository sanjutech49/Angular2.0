using Ionic.Zip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;

namespace MML.Web.LoanCenter.Classes
{
    public class FileDownloadResult : ActionResult
    {
        private string _packageFileName = "DownloadPackage";
        private IEnumerable<DownloadItem> _files;

        public FileDownloadResult(IEnumerable<DownloadItem> files, string packageFileName = "DownloadPackage")
        {
            _files = files;
            _packageFileName = packageFileName;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            int fileCount = _files.Count();

            if( fileCount == 1 )
            {
                DownloadFile(context.HttpContext, _files.FirstOrDefault());
            }
            else if (fileCount > 1)
            {
                DownloadZippedFiles(context.HttpContext, _files);
            }
            //else
            //{
            //    throw new Exception("There are no files for download.");
            //}
            
        }

        private void DownloadFile(HttpContextBase httpContext, DownloadItem item)
        {
            if (httpContext == null)
                throw new ArgumentNullException("httpContext", "Cannot be null.");
            if (item == null)
                throw new ArgumentNullException("item", "Cannot be null.");

            string fileName = GetFullFileName(item.FileName, item.Extension);
                
            httpContext.Response.ContentType = item.MimeType;
            httpContext.Response.AppendHeader("content-disposition", "attachment; filename=" + fileName);
            httpContext.Response.BinaryWrite(item.Data);
            httpContext.Response.Flush();
            httpContext.Response.End();
        }

        private void DownloadZippedFiles(HttpContextBase httpContext, IEnumerable<DownloadItem> items)
        {
            if (httpContext == null)
                throw new ArgumentNullException("httpContext", "Cannot be null.");
            if (items == null)
                throw new ArgumentNullException("items", "Cannot be null.");

            using (ZipFile zf = new ZipFile())
            {
                Dictionary<string, int> duplicateNames = new Dictionary<string, int>();

                foreach (DownloadItem item in items)
                {
                    string fileName = GetFullFileName(item.FileName, item.Extension);

                    // Handle duplicates:
                    if (zf.Any(i => i.FileName == fileName))
                    {
                        if (duplicateNames.ContainsKey(fileName))
                            duplicateNames[fileName]++;
                        else
                            duplicateNames.Add(fileName, 2);

                        fileName = GetFullFileName(item.FileName + string.Format(" ({0})", duplicateNames[fileName]), item.Extension);
                    }

                    zf.AddEntry(fileName, item.Data);
                }
                
                httpContext.Response.ContentType = "application/zip";
                httpContext.Response.AppendHeader("content-disposition", string.Format("attachment; filename={0}.zip", _packageFileName));
                zf.Save(httpContext.Response.OutputStream);
            }
        }

        /// <summary>
        /// Helper method to create filename as name + extension. It defaults these components if not provided.
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="extension"></param>
        /// <returns></returns>
        private string GetFullFileName(string fileName, string extension)
        {
            string fullName = string.Format("{0}{1}",
                !string.IsNullOrWhiteSpace(fileName) ? fileName : "File",
                !string.IsNullOrWhiteSpace(extension) ? "." + extension : "");

            return fullName;
        }
    }
}
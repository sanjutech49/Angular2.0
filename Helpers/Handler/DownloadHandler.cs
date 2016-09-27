using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Security.Authentication;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Xml;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using System.Threading;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Helpers.Handlers
{
    public class DownloadHandler : IHttpHandler, IRequiresSessionState
    {
        #region IHttpHandler Members

        public bool IsReusable
        {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                // Check identity of current user
                if (!IdentityManager.IsAuthenticated())
                    throw new AuthenticationException("Not authenticated into the system!");

                string documentType = (context.Request.QueryString["documentType"] ?? string.Empty).Trim().ToLower();

                // Special case handling to export a loan into an xml file
                if (documentType == "loanxml")
                {
                    // it brings in query string parameters
                    string t_loanId = context.Request.QueryString["loanId"];
                    string t_encryptssn = context.Request.QueryString["encryptssn"];

                    Guid _loanId = new Guid(t_loanId);

                    // it grabs loan's XML 
                    String _loanXml = LoanServiceFacade.GetLoanXml(_loanId, AccountHelper.GetUserAccountId(), Boolean.Parse(t_encryptssn));

                    // flushes loan's XML into the context response
                    if (!string.IsNullOrWhiteSpace(_loanXml))
                    {
                        context.Response.ContentType = "text/xml-downloaded-only";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=loan_data.xml");
                        context.Response.Write(_loanXml);
                        context.Response.Flush();
                        context.Response.End();
                    }
                    return;
                }

                // Special case handling
                if (documentType == "loanservicecontentxml" || documentType == "loanservicefailuremessage")
                {
                    string data = String.Empty;
                    string filename = "data.xml";

                    try
                    {
                        string eventType = (context.Request.QueryString["eventType"] ?? string.Empty).Trim();
                        if (String.IsNullOrEmpty(eventType))
                            throw new Exception("Valid Loan Service Event Type must be provided.");

                        string rawEventId = String.Empty;

                        long eventId = 0;
                        if (!long.TryParse(context.Request.QueryString["eventId"], out eventId)){
                            rawEventId = EncryptionHelper.DecryptRijndael((context.Request.QueryString["eventId"] ?? string.Empty).Trim(), EncriptionKeys.Default);
                        }
                        if (rawEventId !=String.Empty)
                        {
                            long.TryParse(rawEventId, out eventId);
                        }
                            
                        if (eventId == 0)
                        { 
                            throw new Exception("Valid Loan Service Event Id must be provided.");
                        }
                        var loanServiceEvent = LoanServiceFacade.GetLoanServiceEvent(eventType, eventId);
                        if (loanServiceEvent == null)
                        {
                            data = "<Error>Unable to retrieve service event</Error>";
                        }
                        else if (String.IsNullOrWhiteSpace(loanServiceEvent.ContentXml))
                        {
                            data = "<Error>Unable to retrieve service event parameters</Error>";
                        }
                        else
                        {
                            switch (documentType)
                            {
                                case "loanservicecontentxml":
                                    data = loanServiceEvent.ContentXml;
                                    break;
                                case "loanservicefailuremessage":
                                    data = loanServiceEvent.FailureMessage + Environment.NewLine + Environment.NewLine + loanServiceEvent.FailureStackTrace;
                                    filename = "ErrorDetails.txt";
                                    break;
                                default:
                                    data = "<Error>Unknown documentType parameter</Error>";
                                    break;
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        TraceHelper.Error(TraceCategory.ConciergeDocumentDownloader, ex.ToString(), ex, Guid.Empty, IdentityManager.GetUserAccountId());
                        data = "<Error>Unknown Error</Error>";
                    }

                    context.Response.ContentType = "text/xml-downloaded-only";
                    context.Response.AddHeader("Content-Disposition", "attachment; filename=" + filename);
                    context.Response.Write(data);
                    context.Response.Flush();
                    context.Response.End();

                    return;
                }
                else if (!String.IsNullOrEmpty(context.Request.QueryString["documentType"]) && context.Request.QueryString["documentType"] == "logItem"
                    && !String.IsNullOrEmpty(context.Request.QueryString["loanId"])
                    && !String.IsNullOrEmpty(context.Request.QueryString["userId"]))
                {
                    Guid loanId = Guid.Empty;
                    if (!Guid.TryParse(context.Request.QueryString["loanId"], out loanId)){
                        loanId = new Guid(EncryptionHelper.DecryptRijndael(context.Request.QueryString["loanId"], EncriptionKeys.Default));
                    }

                    if (loanId == Guid.Empty){
                       throw new Exception("Error while getting LoanId!");

                    }

                    int userId = 0;
                    if (!Int32.TryParse(context.Request.QueryString["userId"], out userId)){
                        userId = Int32.Parse(EncryptionHelper.DecryptRijndael(context.Request.QueryString["userId"], EncriptionKeys.Default));
                    }
                    if (userId == 0){
                        throw new Exception("Error while getting UserId!");
                    }
                    
                    var name = context.Server.UrlDecode(context.Request.QueryString["name"]);

                    string loanNumber = null;
                    int outLoanNumber = 0;

                    if( context.Request.QueryString["loanNumber"] == "Pending" || context.Request.QueryString["loanNumber"] == String.Empty) {
                      loanNumber = context.Request.QueryString["loanNumber"];
                    }

                    if (loanNumber == null)
                    {
                        if (!Int32.TryParse(context.Request.QueryString["loanNumber"], out outLoanNumber)){
                            loanNumber = EncryptionHelper.DecryptRijndael(context.Request.QueryString["loanNumber"], EncriptionKeys.Default);
                        } else {
                            loanNumber = outLoanNumber.ToString();
                        }
                    }

                    if (loanNumber == null){
                        throw new Exception("Error while getting loanNumber!");
                    }
                    
                   
                    List<IntegrationLogFolder> integrationDocuments = IntegrationLogServiceFacade.GetIntegrationLogItems(loanId, userId, loanNumber.ToString());

                    String xml = null;
                    String fileName = String.Empty;

                    var isFnm = false;

                    if (integrationDocuments != null)
                    {
                        foreach (IntegrationLogFolder integrationLogItems in integrationDocuments)
                        {
                            bool isBreak = false;

                            foreach (IntegrationLogItem integrationLogItem in integrationLogItems.Items)
                            {
                                if (integrationLogItem.Name.Equals(name))
                                {
                                    fileName = integrationLogItem.Name;
                                    xml = integrationLogItem.Data;

                                    if (integrationLogItem.EventId == "503")
                                    {
                                        isFnm = true;
                                    }

                                    isBreak = true;
                                    break;
                                }
                            }

                            if (isBreak)
                                break;
                        }
                    }

                    if (xml != null)
                    {
                        var utf8Encoding = new System.Text.UTF8Encoding();

                        context.Response.Clear();

                        context.Response.ContentType = isFnm ? DocumentContentType.TXT.GetStringValue() : DocumentContentType.XML.GetStringValue();

                        fileName += isFnm ? ".fnm" : ".xml";

                        context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName);
                        context.Response.BufferOutput = true;
                        context.Response.AddHeader("Content-Length", utf8Encoding.GetByteCount(xml).ToString());
                        context.Response.BinaryWrite(utf8Encoding.GetBytes(xml));
                        context.Response.Flush();
                        context.Response.End();
                    }

                    return;
                }


                if (!String.IsNullOrEmpty(context.Request.QueryString["repositoryItemId"]))
                {
                    // download document from manage documents
                    Guid repositoryItemId = Guid.Empty;
                    if (!Guid.TryParse(context.Request.QueryString["repositoryItemId"], out repositoryItemId))
                        repositoryItemId = new Guid(EncryptionHelper.DecryptRijndael(context.Request.QueryString["repositoryItemId"], EncriptionKeys.Default));

                    if (repositoryItemId == Guid.Empty)
                        throw new Exception("Error while getting RepositoryItemId!");

                    FileStoreItem item = FileStoreServiceFacade.GetFileStoreItemById(repositoryItemId, -1);

                    if (item.FileStoreItemFile == null)
                        throw new Exception("Error while getting file from repository. RepositoryItemId='" + repositoryItemId + "'");

                    string fileName = String.IsNullOrEmpty(Path.GetExtension(item.FileStoreItemFile.Filename)) ?
                                             String.Format("\"{0}.{1}\"", item.FileStoreItemFile.Filename, item.FileStoreItemFile.ContentType.ToString().ToLower()) :
                                             String.Format("\"{0}\"", item.FileStoreItemFile.Filename);

                    bool openInBrowser = false;
                    Boolean.TryParse(context.Request.QueryString["browser"], out openInBrowser);

                    using (var stream = new MemoryStream())
                    {
                        try
                        {
                            context.Response.Clear();
                            context.Response.ContentType = item.FileStoreItemFile.ContentType.GetStringValue();
                            if (!openInBrowser)
                                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName);
                            context.Response.BufferOutput = true;
                            context.Response.AddHeader("Content-Length", item.FileStoreItemFile.Data.Length.ToString());
                            context.Response.BinaryWrite(item.FileStoreItemFile.Data);
                            context.Response.Flush();
                            context.Response.End();
                        }
                        catch // Suppress response flushing errors
                        {
                        }

                    }
                }
                else
                {
                    // download document from export to los form
                    Guid loanId = new Guid(EncryptionHelper.DecryptRijndael(context.Request.QueryString["loanId"], EncriptionKeys.Default));
                    int userAccountId = IdentityManager.GetUserAccountId();
                    int selectedFormatValue = int.Parse(context.Request.QueryString["selectedFormatValue"]);

                    var borrowers = BorrowerServiceFacade.GetBorrowerIdAndCoborrowerId(loanId, userAccountId);
                    string borrowerLastName = borrowers.BorrowerLastName;

                    // If selected file format is 0, Filename will be todayDate_borrower_URLA1003.fnm, otherwise todayDate_borrower_URLA1003.xnm
                    StringBuilder fileNameBuilder = new StringBuilder();
                    fileNameBuilder.Append(DateTime.Now.Year);
                    fileNameBuilder.Append(DateTime.Now.Month);
                    fileNameBuilder.Append(DateTime.Now.Day);
                    fileNameBuilder.Append(borrowerLastName);
                    fileNameBuilder.Append("_URLA1003.");
                    fileNameBuilder.Append(selectedFormatValue == 0 ? "fnm" : "xml");

                    // Get 1003 file from URLA service
                    string urlaFile = URLADeliveryServiceFacade.DeliverURLA(loanId, (URLADeliveryFormat)selectedFormatValue, userAccountId);

                    if (String.IsNullOrEmpty(urlaFile))
                        throw new Exception("Urla file could not be generated!");

                    using (var stream = new MemoryStream())
                    {
                        // Write out urla xml
                        using (var xmlWriter = new XmlTextWriter(stream, Encoding.ASCII))
                        {
                            xmlWriter.WriteRaw(urlaFile);

                            // Wlush the document to the memory stream
                            xmlWriter.Flush();

                            // Get a byte array from the memory stream
                            byte[] byteArray = stream.ToArray();

                            try
                            {
                                // Populate context response with data
                                context.Response.Clear();
                                context.Response.ContentType = "application/octet-stream";
                                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileNameBuilder);
                                context.Response.BufferOutput = true;
                                context.Response.AddHeader("Content-Length", byteArray.Length.ToString());
                                context.Response.BinaryWrite(byteArray);
                                context.Response.Flush();
                                context.Response.End();
                                xmlWriter.Close();
                            }
                            catch // Suppress response flushing errors
                            {
                            }
                        }
                    }
                }
            }
            catch (ThreadAbortException)
            {
                // TODO: figure out why is throwing this exception after response headers have been sent
                // Suppress for now
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.ConciergeDocumentDownloader, ex.ToString(), ex, Guid.Empty, IdentityManager.GetUserAccountId());

                context.Session.Add("DocumentDownloadError", ex.Message);
                // context.Response.Redirect(@"~\ConciergeHome.aspx?errorCode=210", true);
            }
        }

        #endregion
    }
}

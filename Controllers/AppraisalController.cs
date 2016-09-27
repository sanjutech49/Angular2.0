using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using APS.ServiceProxy;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.LoanCenter.Helpers.Classes;
using MML.iMP.AppraisalProducts.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.LoanCenter.ViewModels;
using Telerik.Web.Mvc.UI;
using MML.Web.Borrower.Helpers;
using System.Text;
using iMP.Streetlinks.DataContracts;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.Helpers.Utilities;
using System.Xml.Linq;
using System.Xml.XPath;
using iMP.Streetlinks.DataContracts.Enums;
using DocumentType = iMP.Streetlinks.Utilities.DocumentType;
using MML.iMP.BiDirectional.Common;
using AppraisalFormFields = iMP.Streetlinks.Utilities.Entities.AppraisalFormFields;
using AppraisalFormField = iMP.Streetlinks.Utilities.AppraisalFormField;
using LXAppraisalOrderType = iMP.Streetlinks.Utilities.OrderType;
using System.ServiceModel;
using LXReportType = iMP.Streetlinks.DataContracts.ReportType;

namespace MML.Web.LoanCenter.Controllers
{
    public class AppraisalController : Controller
    {
        //
        // GET: /Appraisal/
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadAppraisalDocument()
        {
            string loanNumber = String.Empty;
            try
            {
                String fileContent = String.Empty;
                using ( Stream stream = Request.InputStream )
                {
                    StreamReader reader = new StreamReader( stream );
                    fileContent = reader.ReadToEnd();
                }

                // Upload to MML
                OriginationSystem originationSystem = OriginationSystem.MML;
                IDictionary<string, object> results = new Dictionary<string, object>();
                try
                {
                    results = new Proxy().Send( "ProcessResponse",
                                                                        new Dictionary<string, object>
                                                                        {
                                                                            {"RequestXml", fileContent},
                                                                            {"OriginationSystem", originationSystem}
                                                                        } );
                }
                catch ( Exception ex )
                {
                    try
                    {
                        if ( !String.IsNullOrWhiteSpace( fileContent ) )
                        {
                            XElement xmlTemp = XElement.Parse( fileContent );
                            if ( xmlTemp == null )
                                throw new NullReferenceException( "Unable to parse lenderx notification in catch block. XML object is null." );

                            loanNumber = xmlTemp.XPathSelectElement( "//loanNumber" ).Value ?? String.Empty;
                            Guid? loanID = LoanServiceFacade.RetrieveLoanIdByLoanNumber( loanNumber, -1 );

                            if ( loanID != null && loanID.HasValue )
                            {
                                ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.UploadAppraisalDocsFailed,
                                                                                "Appraisal Upload Integration Failed.",
                                                                                loanID.Value, IdentityManager.GetUserAccountId() );
                            }
                        }
                    }
                    catch ( Exception exception )
                    {
                        const string errorMessage = "Failed to create exception item for UploadDocuments!";
                        TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessage, exception );
                    }
                    

                    const string errorMessageFormat = "ProcessResponse service failed!";
                    TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessageFormat, ex );
                }

                // Get results
                object responseMessageSuccess;
                results.TryGetValue( "AppraisalDocumentRecived", out responseMessageSuccess );

                Boolean appraisalDocumentRecived = responseMessageSuccess != null ? ( Boolean )responseMessageSuccess : false;

                // Parse xml
                XElement xml = XElement.Parse( fileContent );
                if ( xml == null )
                    throw new NullReferenceException( "Unable to parse lenderx notification. XML object is null." );

                loanNumber = xml.XPathSelectElement( "//loanNumber" ).Value ?? String.Empty;
                Guid? loanId = LoanServiceFacade.RetrieveLoanIdByLoanNumber( loanNumber, -1 );

                // Update status
                if ( loanId != null )
                {
                    try
                    {
                        // Insert LenderX log
                        OrderAppraisalServiceFacade.InsertLenderXLog( ( Guid )loanId, "Appraisal document uploaded",
                            ( Int32 )IntegrationLogEvent.UploadAppraisalDocumentRequest, fileContent );
                    }
                    catch ( Exception e )
                    {
                        const string errorMessageFormat = "Failed to save LenderX integration logs. Loan number: {0}.";
                        TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), e );
                    }

                    if ( appraisalDocumentRecived )
                    {
                        DocumentsServiceFacade.UpdateLenderXOrderStatus( ( Guid )loanId, ( int )LXAppraisalOrderStatus.Finnished );

                        try
                        {
                            // Send alerts to borrower
                            Activity activity = ActivitiesServiceFacade.RetrieveActivity( ( Guid )loanId, ActivityType.ApproveDocuments, IdentityManager.GetUserAccountId() );
                            if ( activity != null )
                                ActivitiesServiceFacade.ExecuteActivityRulesConcierge( activity.Id, ActivityStatus.None, ActivityMode.None,
                                    false, ActionIntent.AppraisalUploaded, Guid.Empty, IdentityManager.GetUserAccountId(), "Appraisal" );
                        }
                        catch ( Exception ex )
                        {
                            const string errorMessageFormat = "Unable to send alerts to borrower. Loan number: {0}.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), ex );
                        }

                        //var audit = new Audit()
                        //{
                        //    AuditEventType = AuditEventType.AppraisalOrderDelivered,
                        //    AuditEventCategory = AuditEventCategory.AppraisalRelated,
                        //    Message = "Appraisal report delivered to borrower",
                        //    Title = "Appraisal Delivered",
                        //    LoanId = ( Guid )loanId,
                        //    UserAccountId = IdentityManager.GetUserAccountId()
                        //};
                        //AuditServiceFacade.CreateAuditEvent( audit );
                    }
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( "Failed to process lenderx notification. Loan number: {0}", loanNumber ), ex );
            }

            JsonResult jsonData = Json( new
            {
                Succes = "OK"
            }, JsonRequestBehavior.AllowGet );

            return jsonData;
        }

        public ActionResult GetProductsAndFees( AppraisalProductRequest appraisalProductRequest )
        {

            // Call iMP platform
            var results = new Proxy().Send( "GETAppraisalProductsWithFees", new Dictionary<string, object> { { "AppraisalProductRequest", appraisalProductRequest }, { "RequiresConversion", false } } );

            // Get results
            object responseMessageSuccess;
            results.TryGetValue( "AppraisalProductResponse", out responseMessageSuccess );
            AppraisalProductResponse response = responseMessageSuccess as AppraisalProductResponse;

            JsonResult jsonData = Json( new
            {
                Response = response
            }, JsonRequestBehavior.AllowGet );

            return jsonData;
        }

        public ActionResult GetFee( GetAppraisalProductFee appraisalFeeRequest )
        {
            var messageModel = new ErrorMessage();

            try
            {
                // Call iMP platform
                var results = new Proxy().Send( "GETAppraisalProductFee", new Dictionary<string, object> { { "GetAppraisalProductFee", appraisalFeeRequest } } );

                // Get results
                object responseMessageSuccess;
                results.TryGetValue( "AppraisalProductFeeRetrieved", out responseMessageSuccess );
                AppraisalProductFeeRetrieved response = responseMessageSuccess as AppraisalProductFeeRetrieved;

                if ( response == null || response.AppraisalProductFee == null )
                {
                    messageModel.Message = "Fee for selected Appraisal product not found.";
                    messageModel.Title = "Fee Not Found";

                    return PartialView( "Message/_customMessage", messageModel );
                }

                JsonResult jsonData = Json( new
                {
                    OrderAppraisalFee = response.AppraisalProductFee.Fee,
                    OrderAppraisalFeeComment = response.AppraisalProductFee.Comment,
                    OrderAppraisalFeeMessage = response.AppraisalProductFee.Message,
                    OrderAppraisalFeeStatus = response.AppraisalProductFee.Status
                }, JsonRequestBehavior.AllowGet );

                return jsonData;
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to retrieve fee for appraisal product", exception );
                messageModel.Message = "Failed to retrieve fee for appraisal product";
                messageModel.Title = "Failed to retrieve fee";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }

        public ActionResult GetBusinessContact( int contactType, Guid loanId )
        {
            var messageModel = new ErrorMessage();

            try
            {
                JsonResult jsonData = new JsonResult();
                BusinessContact businessContact = null;
                Contracts.Borrower borrower = null;

                // Business contacts
                if ( contactType > 0 )
                {
                    BusinessContactCategory bc = ( BusinessContactCategory )contactType;
                    businessContact = BusinessContactServiceFacade.RetrieveBusinessContactByTypeAndLoan( bc, loanId );
                }

                // Borrower and Coborrower
                else if ( contactType < -1 )
                {
                    BorrowerCollection borrowerCol = BorrowerServiceFacade.GetBorrowers( loanId );

                    if ( contactType == -2 )
                    {
                        // Borrower
                        borrower = borrowerCol.Where( b => !b.IsCoBorrower ).FirstOrDefault();
                    }
                    else
                    {
                        // Coborrower
                        borrower = borrowerCol.Where( b => b.IsCoBorrower ).FirstOrDefault();
                    }
                }

                if ( businessContact != null )
                {
                    BusinessContactPhoneNumber preferredPhoneNumber = GetBusinessContactPreferredPhoneNumber( businessContact );
                    jsonData = Json( new
                    {
                        FirstName = businessContact.FirstName,
                        LastName = businessContact.LastName,
                        Email = businessContact.Email,
                        PreferredPhone = preferredPhoneNumber.Number,
                        Preferred = ( int )preferredPhoneNumber.NumberType,
                        ContactId = businessContact.BusinessContactId
                    }, JsonRequestBehavior.AllowGet );
                }

                else if ( borrower != null && borrower.BorrowerPersonalInfo != null )
                {
                    PreferredPhone preferredPhone = GetPreferredPhone( borrower );
                    jsonData = Json( new
                    {
                        FirstName = borrower.BorrowerPersonalInfo.FirstName,
                        LastName = borrower.BorrowerPersonalInfo.LastName,
                        Email = borrower.BorrowerPersonalInfo.EmailAddress,
                        PreferredPhone = preferredPhone.Number,
                        Preferred = preferredPhone.Type,
                        ContactId = borrower.BorrowerId
                    }, JsonRequestBehavior.AllowGet );
                }

                return jsonData;
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.Global, "Failed to retrieve business contact", exception );
                messageModel.Message = "Failed to retrieve business contact";
                messageModel.Title = "Failed to retrieve business contact";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }

        public ActionResult GetBillingInformation( Guid billingInformationId )
        {
            var messageModel = new ErrorMessage();
            string creditCardNumber = String.Empty;
           

            try
            {
                BillingInformation billingInfo = UserAccountServiceFacade.GetBillingInfoByID( billingInformationId );

                if ( AccountHelper.HasPrivilege( MML.Common.PrivilegeName.ViewCreditCard ) )
                    creditCardNumber = billingInfo.UnmaskedCreditCardNumber;
                else
                    creditCardNumber = billingInfo.CreditCardNumber;

                JsonResult jsonData = Json( new
                {                   
                    CreditCardNumber = creditCardNumber,
                    CreditCardCCV = billingInfo.CCV,
                    NameOnCard = billingInfo.NameOnCard,
                    ExpirationYear = billingInfo.ExpirationDate.Year,
                    ExpirationMonth = billingInfo.ExpirationDate.Month,
                    CreditCardType = ( int )billingInfo.CreditCardType
                }, JsonRequestBehavior.AllowGet );

                return jsonData;
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to retrieve billing information", exception );
                messageModel.Message = "Failed to retrieve billing information";
                messageModel.Title = "Failed to retrieve billing information";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }

        public ActionResult GetPaymentInformation( string appraisalOrderId, string loanId )
        {
            var messageModel = new AppraisalConfirmationMessage();
            messageModel.LoanId = loanId;
            IDictionary<string, object> results = null;

            try
            {
                Guid loanIdValue;
                Guid.TryParse( loanId, out loanIdValue );

                OriginationSystem originationSystem = OriginationSystem.MML;
                results = new Proxy().Send( "Payment", new Dictionary<string, object> { { "OrderId", appraisalOrderId }, { "OriginationSystem", originationSystem } } );

                object paymentStatusValue;
                object paymentDateValue;
                object paymentReferenceNumberValue;
                object amountValue;
                object responseXmlValue;

                results.TryGetValue( "PaymentStatus", out paymentStatusValue );
                results.TryGetValue( "PaymentDate", out paymentDateValue );
                results.TryGetValue( "PaymentReferenceNumber", out paymentReferenceNumberValue );
                results.TryGetValue( "Amount", out amountValue );
                results.TryGetValue( "ResponseXML", out responseXmlValue );

                String paymentStatus = paymentStatusValue as String;
                String paymentDate = paymentDateValue as String;
                String paymentReferenceNumber = paymentReferenceNumberValue as String;
                String amount = amountValue as String;
                String responseXml = responseXmlValue as String;

                try
                {
                    OrderAppraisalServiceFacade.InsertLenderXLog( loanIdValue, "Check payment initiated",
                        ( Int32 )IntegrationLogEvent.CheckOrderStatusRequest, string.Format( "<OrderId>{0}</OrderId>", appraisalOrderId ) );


                    OrderAppraisalServiceFacade.InsertLenderXLog( loanIdValue, "Order Payment Status Retreived",
                        ( Int32 )IntegrationLogEvent.CheckOrderStatusResponse, responseXml );
                }
                catch ( Exception e )
                {
                    const string errorMessageFormat = "Failed to save LenderX integration logs. LoanId: {0}.";
                    TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                }

                if ( !String.IsNullOrWhiteSpace( paymentStatus ) )
                {
                    AppraisalOrderHelper appraisalOrderHelper = new AppraisalOrderHelper();
                    PaymentStatus status = appraisalOrderHelper.GetPaymentStatus( paymentStatus );
                    DateTime date;
                    DateTime.TryParse( paymentDate, out date );
                    OrderAppraisalServiceFacade.UpdatePaymentStatus( status, date, paymentReferenceNumber, amount,
                                                                    appraisalOrderId );

                    messageModel.Title = "Update successful.";
                    messageModel.Message = "Payment information updated successfully.";

                    // Update Queue lists
                    int userAccountId = default(int);
                    Guid _loanId = new Guid(loanId);
                    if (HttpContext != null && HttpContext.Session != null && HttpContext.Session[SessionHelper.UserData] != null)
                    {
                        UserAccount loggedUser = (UserAccount)HttpContext.Session[SessionHelper.UserData];
                        if (loggedUser != null)
                            userAccountId = loggedUser.UserAccountId;

                        try
                        {
                            LoanServiceFacade.ProcessQueueItems(_loanId, userAccountId);
                        }
                        catch (InvalidOperationException exception)
                        {
                            //Just log data and do not throw exception
                            TraceHelper.Error(TraceCategory.LoanService, "Failed to update queue items.", exception, _loanId, userAccountId);
                        }
                    }
                }
                else
                {
                    messageModel.Title = "Update failed.";
                    messageModel.Message = "No payment information are received from LenderX system for this order.";
                }

            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.Global, "Failed to update payment information.", ex );
                Guid parsedLoanId;

                try
                {
                    if ( Guid.TryParse( loanId, out parsedLoanId ) )
                    {
                        if ( results == null && ex.ToString().ToLower().Contains( "the operation has timed out" ) )
                        {
                            int userAccountId = default( int );
                            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
                            {
                                UserAccount loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
                                if ( loggedUser != null )
                                    userAccountId = loggedUser.UserAccountId;
                            }

                            ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.CheckCreditCardStatusFailed,
                                                                        "LenderX service is down or experiencing heavy traffic",
                                                                        parsedLoanId, userAccountId );
                        }
                        OrderAppraisalServiceFacade.InsertLenderXLog( parsedLoanId, "Appraisal document uploaded",
                            ( Int32 )IntegrationLogEvent.LenderXException, ex.ToString() );
                    }
                }
                catch ( Exception e )
                {
                    const string errorMessageFormat = "Failed to save LenderX integration logs. Loan ID: {0}.";
                    TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                }

                messageModel.Title = "Update failed.";
                messageModel.Message = "Failed to update payment information.";
            }

            return PartialView( "Message/_customMessageReloadAppraisal", messageModel );
        }

        public ActionResult GetAppraisalOrderStatus( string appraisalOrderId, string loanId )
        {
            int userAccountId = default( int );
            IDictionary<string, object> results = null;

            try
            {
                Guid currentLoanId = new Guid( loanId );

                UserAccount loggedUser = null;
                if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
                {
                    loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
                    if ( loggedUser != null )
                        userAccountId = loggedUser.UserAccountId;
                }
                else
                {
                    // TODO: Handle if user don't have priviledges to see this log
                    throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
                }

                // Return message
                var messageModel = new AppraisalConfirmationMessage();
                messageModel.LoanId = loanId;

                // Retrieve appraisal order status
                OriginationSystem originationSystem = OriginationSystem.MML;

                try
                {
                    OrderAppraisalServiceFacade.InsertLenderXLog( new Guid( loanId ), "Check status initiated",
                        ( Int32 )IntegrationLogEvent.CheckOrderStatusRequest, "<OrderId>" + appraisalOrderId + "</OrderId>" );
                }
                catch ( Exception e )
                {
                    const string errorMessageFormat = "Failed to save LenderX integration logs. Loan ID: {0}.";
                    TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                }

                results = new Proxy().Send( "CheckOrderStatus", new Dictionary<string, object> { { "OrderId", appraisalOrderId }, { "OriginationSystem", originationSystem } } );

                object response;
                results.TryGetValue( "ResponseXml", out response );
                String xml = response as String;
             
              if ( String.IsNullOrWhiteSpace( xml ) )
                {
                    messageModel.Message = "Unable to update appraisal order data. No data retrieved from LenderX system.";
                    messageModel.Title = "Failed to update appraisal order status";

                    try
                    {
                        OrderAppraisalServiceFacade.InsertLenderXLog( new Guid( loanId ), "Failed To Check Order Status",
                            ( Int32 )IntegrationLogEvent.CheckOrderStatusResponse, xml );
                    }
                    catch ( Exception e )
                    {
                        const string errorMessageFormat = "Failed to save LenderX integration logs. Loan ID: {0}.";
                        TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                    }
                }
                else
                {
                    DateTime? previousScheduledAppraisalDate = OrderAppraisalServiceFacade.RetrieveOrderAppraisalScheduledDate( appraisalOrderId, loggedUser.UserAccountId );

                    // Create domain object
                    AppraisalOrderHelper orderHelper = new AppraisalOrderHelper();
                    AppraisalOrderCommonHelper commonOrderHelper = new AppraisalOrderCommonHelper();
                    OrderAppraisalInfo orderInfo = commonOrderHelper.GetAppraisalInfoRequest( xml );

                    if ( orderInfo == null )
                        throw new NullReferenceException( "OrderAppraisalInfo object is null." );

                    try
                    {
                        OrderAppraisalServiceFacade.InsertLenderXLog( new Guid( loanId ), "Order Status Retreived",
                            ( Int32 )IntegrationLogEvent.CheckOrderStatusResponse, xml );                   
                        
                    }
                    catch ( Exception e )
                    {
                        const string errorMessageFormat = "Failed to save LenderX integration logs. Loan ID: {0}.";
                        TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                    }

                    Contracts.Property subjectProperty = null;

                    // Retrieve old Appraised Value from Subject Property
                    if ( orderInfo.AppraisedValue != null && orderInfo.AppraisedValue != 0 )
                    {
                        subjectProperty = PropertyServiceFacade.RetrieveSubjectProperty( currentLoanId, loggedUser.UserAccountId );
                    }

                    // Update repository
                    IDictionary<string, object> updateAppraisalInfo = new Proxy().Send( "UpdateOrderAppraisalInfoWorkflow", new Dictionary<string, object> { { "Request", orderInfo } } );
                    object updateAppraisalInfoResult;
                    updateAppraisalInfo.TryGetValue( "Updated", out updateAppraisalInfoResult );
                    Boolean orderAppraisalUpdated = ( Boolean )updateAppraisalInfoResult;

                    if ( orderAppraisalUpdated )
                    {
                        bool notificationsEnabled = GeneralSettingsServiceFacade.RetrieveStatusByGeneralSettingsName( "Enable Appraisal Appointment Notifications", currentLoanId, userAccountId );

                        // if appraisal date is scheduled, schedule alerts
                        if ( notificationsEnabled && orderInfo.AppraisalScheduledInspection != null && previousScheduledAppraisalDate != orderInfo.AppraisalScheduledInspection )
                        {
                            DateTime orderAppraisalDate;
                            DateTime.TryParse( orderInfo.AppraisalScheduledInspection.ToString(), out orderAppraisalDate );

                            commonOrderHelper.ExecuteScheduleAppraisalRules( new Guid( loanId ), loggedUser.UserAccountId, orderAppraisalDate );
                        }

                        // Save Appraised Value History as Appraised value is changed
                        if ( subjectProperty != null && subjectProperty.AppraisedValue.HasValue && subjectProperty.AppraisedValue != ( decimal? )orderInfo.AppraisedValue )
                        {
                            LoanServiceFacade.SaveAppraisalValueHistory( currentLoanId, ( decimal )subjectProperty.AppraisedValue, ( decimal )orderInfo.AppraisedValue, -1, AppraisedValueHistoryChangedType.AppraisedValue );
                        }

                        // Update Queue lists
                        try
                        {
                            LoanServiceFacade.ProcessQueueItems(currentLoanId, loggedUser.UserAccountId);
                        }
                        catch (InvalidOperationException exception)
                        {
                            //Just log data and do not throw exception
                            TraceHelper.Error(TraceCategory.LoanService, "Failed to update queue items.", exception, currentLoanId, loggedUser.UserAccountId);
                        }

                        messageModel.Message = "Appraisal order status is successfully updated.";
                        messageModel.Title = "Appraisal order status updated";

                    }
                    else
                    {
                        messageModel.Message = "Unable to update appraisal order data in the Web iMP system.";
                        messageModel.Title = "Failed to update appraisal order status";
                    }
                }

                return PartialView( "Message/_customMessageReloadAppraisal", messageModel );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.Global, "Failed to update appraisal order status.", exception );

                try
                {
                    if ( results == null && exception.ToString().ToLower().Contains( "the operation has timed out" ) )
                    {
                        Guid loanID = Guid.Empty;
                        Guid.TryParse( loanId, out loanID );
                        if ( loanID != Guid.Empty )
                        {
                            ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.CheckAppraisalOrderStatusFailed,
                                                                        "LenderX service is down or experiencing heavy traffic.",
                                                                        loanID, userAccountId );
                        }
                    }
                    OrderAppraisalServiceFacade.InsertLenderXLog( new Guid( loanId ), "Failed to update appraisal order status",
                        ( Int32 )IntegrationLogEvent.LenderXException, exception.ToString() );
                }
                catch ( Exception e )
                {
                    const string errorMessageFormat = "Failed to save LenderX integration logs. Loan ID: {0}.";
                    TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanId ), e );
                }

                var messageModel = new ErrorMessage();

                messageModel.Message = "Unable to update appraisal order status.";
                messageModel.Title = "Appraisal order status update error";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }

        /// <summary>
        /// Credit card validation
        /// </summary>
        /// <param name="bInformations">Credit card info</param>
        /// <returns>Is valid</returns>
        bool CreditCardValidation( BillingInformation bInformations, out String errorMessage )
        {
            errorMessage = String.Empty;

            try
            {
                if ( bInformations == null )
                {
                    errorMessage = "Please fill credit card inforamtions.";
                    return false;
                }

                if ( String.IsNullOrEmpty( bInformations.CreditCardNumber ) )
                {
                    errorMessage = "Please enter credit card number";
                    return false;
                }

                if ( String.IsNullOrEmpty( bInformations.CCV ) )
                {
                    errorMessage = "Please enter CCVN";
                    return false;
                }

                if ( bInformations.CCV.Length < 3 || bInformations.CCV.Length > 4 )
                {
                    errorMessage = "Please enter valid CCVN";
                    return false;
                }

                if ( String.IsNullOrEmpty( bInformations.NameOnCard ) )
                {
                    errorMessage = "Please enter name of the card";
                    return false;
                }

                if ( bInformations.ExpirationDate.Year < DateTime.UtcNow.Year || ( bInformations.ExpirationDate.Year == DateTime.UtcNow.Year && bInformations.ExpirationDate.Month < DateTime.UtcNow.Month ) )
                {
                    errorMessage = "Your credit card has expired";
                    return false;
                }

                ValidationHelper validationHelper = new ValidationHelper();
                Boolean result = validationHelper.ValidateCreditCard( bInformations.CreditCardNumber, ( int )bInformations.CreditCardType );

                if ( !result )
                {
                    errorMessage = "Invalid credit card!";
                    return false;
                }

                return true;

            }
            catch ( Exception ex )
            {
                // Write logs
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to validate credit card.", ex );

                // Response message - error
                errorMessage = "Failed to validate credit card.";
                return false;
            }
        }

        public ActionResult SubmitAppraisalOrder( UpdateOrderAppraisalDataFull data )
        {
            var messageModel = new ErrorMessage();
            IDictionary<string, object> results = null;
            messageModel.Message = "Appraisal order is successfully submitted to HVM.";
            messageModel.Title = "Appraisal order submitted.";

            UserAccount loggedUser = null;
            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            }
            else
            {
                // TODO: Handle if user don't have priviledges to see this log
                throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
            }

            try
            {
                if ( data.PaymentMethod == PaymentMethod.CreditCard )
                {
                    String errorMessage = String.Empty;
                    Boolean isCreditCardValid = false;
                    isCreditCardValid = CreditCardValidation( data.BillingInformation, out errorMessage );
                    if ( !isCreditCardValid )
                    {
                        messageModel.Message = errorMessage;
                        messageModel.Title = "Failed to submit appraisal order to HVM.";

                        return PartialView( "Message/_customMessage", messageModel );
                    }
                }

                // Save to DB
                results = new Proxy().Send( "UpdateOrderAppraisalWorkflow", new Dictionary<string, object> { { "Request", data } } );

                // Call iMP
                String loanNumber = LoanServiceFacade.RetrieveLoanNumber( data.LoanId, loggedUser.UserAccountId );

                // Get results
                object response;
                results.TryGetValue( "Updated", out response );
                bool updated = ( bool )response;

                if ( updated )
                {
                    // Update appraisal status
                    DocumentsServiceFacade.UpdateLenderXOrderStatus( data.LoanId,
                                                ( int )LXAppraisalOrderStatus.SentToHVM );

                    // Send email
                    IDictionary<string, object> sendEmailResults = null;
                    try
                    {
                        IDictionary<string, object> retrieveAppraisalDifferencesResults = new Proxy().Send( "RetrieveAppraisalDifferences", new Dictionary<string, object> { { "LoanNumber", loanNumber }, { "LoanId", data.LoanId } } );
                        object updatedFieldsresponse;
                        retrieveAppraisalDifferencesResults.TryGetValue( "UpdatedFields", out updatedFieldsresponse );
                        List<UpdatedField> updatedFields = updatedFieldsresponse as List<UpdatedField>;

                        AppraisalFormFields formFields = new AppraisalFormFields();
                        formFields.Fields = new List<AppraisalFormField>();

                        if ( updatedFields != null )
                        {
                            if ( updatedFields.Count == 1 ) //is only snapshottime exist in differences, remove it
                            {
                                UpdatedField snapshotTime = updatedFields.FirstOrDefault( x => x.FieldName == "SnapshotTimestamp" );
                                if ( snapshotTime != null )
                                    updatedFields.Remove( snapshotTime );
                            }

                            UpdatedField docs = updatedFields.FirstOrDefault( x => x.FieldName == "Documents" );
                            if ( docs != null )
                            {
                                updatedFields.AddRange( GenerateFileFields( docs ) );
                                updatedFields.Remove( docs );
                            }


                            foreach ( UpdatedField item in updatedFields )
                            {
                                
                                formFields.Fields.Add( new AppraisalFormField( item.FieldName, item.OldValue, item.NewValue ) );
                            }
                        }

                        AppraisalOrderType appraisalOrderType = ( AppraisalOrderType )data.OrderType;
                        try
                        {
                            LXAppraisalOrderType lxOrderType = LXAppraisalOrderType.New;
                            if ( appraisalOrderType == AppraisalOrderType.Update )
                                lxOrderType = LXAppraisalOrderType.Update;

                            sendEmailResults = new Proxy().Send( "SendEmail", new Dictionary<string, object> { { "LoanNumber", loanNumber },
                            { "OriginationSystem", OriginationSystem.MML },
                            { "DocumentType", DocumentType.AppraisalRequest },
                            { "ReportType", LXReportType.AppraisalRequest },
                            { "Fields", formFields },
                            { "OrderType", lxOrderType } } );
                        }
                        catch ( Exception ex )
                        {
                            string errorMessageFormat = "Failed to call iMP Send Email workflow /w snapshots. Loan number: {0}";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ) , ex );
                        }
                    }
                    catch ( Exception ex )
                    {
                        TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to send an email notification to HVM.", ex );

                        if ( sendEmailResults == null )
                        {
                            try
                            {
                                ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitAppraisalOrderSendMailToHVMFailed,
                                                                                                        "SendMail Service is down or unavailable.",
                                                                                                        data.LoanId, data.UserAccountId );
                            }
                            catch ( Exception exc )
                            {
                                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to add exception when SendEmail service failed.", exc );
                            }
                            
                        }
                    }

                    // Update audit logs
                    int userAccountId = IdentityManager.GetUserAccountId();
                    var userFullName = UserAccountServiceFacade.GetUserFullNameByUserAccountId(userAccountId);
                    var audit = new Audit()
                    {
                        AuditEventType = AuditEventType.AppraisalOrderRequested,
                        AuditEventCategory = AuditEventCategory.AppraisalRelated,
                        Message = String.Format("Appraisal Order Request sent to HVM by {0}.", userFullName),
                        Title = "Appraisal Requested",
                        LoanId = data.LoanId,
                        UserAccountId = userAccountId
                    };
                    AuditServiceFacade.CreateAuditEvent( audit );

                    // Response message
                    messageModel.Message = "Appraisal order is successfully submitted to HVM.";
                    messageModel.Title = "Appraisal order submitted.";

                //Create seller contact if it doesn'e exist
                    PopulateSellerData(data);

                    ActivitiesServiceFacade.UpdateActivityStatusByLoanId(data.LoanId, ActivityType.OrderAppraisal, ActivityStatus.Completed, IdentityManager.GetUserAccountId(), true);
                }

                // Update Queue lists
                try
                {
                    LoanServiceFacade.ProcessQueueItems(data.LoanId, data.UserAccountId);
                }
                catch (InvalidOperationException exception)
                {
                    //Just log data and do not throw exception
                    TraceHelper.Error(TraceCategory.LoanService, "Failed to update queue items.", exception, data.LoanId, data.UserAccountId);
                }
            }
            catch ( TimeoutException timeExc )
            {
                // Write logs
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to submit appraisal order.", timeExc );

                try
                {
                    // Response message - error
                    messageModel.Message = "Failed to submit appraisal order to HVM.";
                    messageModel.Title = "Failed to submit appraisal order.";

                    if ( results == null )
                    {
                        ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitAppraisalOrderToHVMFailed,
                                                                        "Web iMP Service is down or unavailable.",
                                                                        data.LoanId, data.UserAccountId );
                    }
                }
                catch ( Exception ex )
                {
                    // Write logs
                    TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to add exception.", ex );
                }
            }
            catch ( CommunicationException exc )
            {
                // Write logs
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to submit appraisal order.", exc );

                try
                {
                    // Response message - error
                    messageModel.Message = "Failed to submit appraisal order to HVM.";
                    messageModel.Title = "Failed to submit appraisal order.";

                    if ( results == null )
                    {
                        ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitAppraisalOrderToHVMFailed,
                                                                        "Web iMP Service is down or unavailable.",
                                                                        data.LoanId, data.UserAccountId );
                    }
                }
                catch ( Exception ex )
                {
                    // Write logs
                    TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to add exception.", ex );
                }

            }
            catch ( Exception ex )
            {
                // Write logs
                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to submit appraisal order.", ex );

                // Response message - error
                messageModel.Message = "Failed to submit appraisal order to HVM.";
                messageModel.Title = "Failed to submit appraisal order.";
            }

            return PartialView( "Message/_customMessage", messageModel );
        }

        /// <summary>
        /// Split string and create list of UpdatedFields, this is used for uploaded files
        /// </summary>
        /// <param name="fileNames"></param>
        /// <returns></returns>
        private List<UpdatedField> GenerateFileFields( UpdatedField fileNames )
        {
            List<UpdatedField> uploadedFiles = new List<UpdatedField>();
            if ( !String.IsNullOrWhiteSpace( fileNames.NewValue ) )
            {
                char[] spliter = new char[] { '|' };

                String[] names = fileNames.NewValue.Split( spliter, StringSplitOptions.RemoveEmptyEntries );
                if ( names != null && names.Count() > 0 )
                {
                    String[] oldNames = fileNames.OldValue.Split( spliter, StringSplitOptions.RemoveEmptyEntries );

                    if ( oldNames == null || oldNames.Count() == 0 )
                        oldNames = new String[ 0 ];

                    int counter = default(int);
                    foreach ( String name in names )
                    {
                        if ( !oldNames.Contains( name ) && name.Contains("*") )
                        {
                            String[] fileName = name.Split( new char[] { '*' }, StringSplitOptions.RemoveEmptyEntries );
                            if ( fileName != null && fileName.Count() > 0 )
                            {
                                counter++;
                                UpdatedField updatedField = new UpdatedField();
                                updatedField.FieldName = String.Format( "Document {0}", counter );
                                updatedField.NewValue = fileName[0];
                                updatedField.OldValue = String.Empty;

                                uploadedFiles.Add( updatedField );
                            }
                        }
                    }
                }
            }

            return uploadedFiles;
        }

        /// <summary>
        /// Populating simple seller with data from form
        /// </summary>
        /// <param name="data"></param>
        public void PopulateSellerData( UpdateOrderAppraisalDataFull data )
        {
            if ( data != null && data.Seller != null && data.Seller.Insert )
            {
                AppraisalOrderHelper appraisalHelper = new AppraisalOrderHelper();
                BusinessContact insertedContact = appraisalHelper.InsertSimpleSeller( data.LoanId, data.Seller );
                if ( insertedContact == null )
                    TraceHelper.Information( TraceCategory.OrderAppraisal, "Could not insert a new Business Contact on Manage Appraisal - SubmitAppraisalOrder" );
            }
        }

        public ActionResult SubmitToLenderX( UpdateOrderAppraisalDataFull data )
        {
            try
            {
                var messageModel = new AppraisalConfirmationMessage();
                messageModel.LoanId = data.LoanId.ToString();

                var audit = new Audit()
                {
                    AuditEventType = AuditEventType.AppraisalOrderOrdered,
                    AuditEventCategory = AuditEventCategory.AppraisalRelated,
                    LoanId = data.LoanId,
                    UserAccountId = IdentityManager.GetUserAccountId()
                };

                UserAccount loggedUser = null;
                if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
                {
                    loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
                }
                else
                {
                    // TODO: Handle if user don't have priviledges to see this log
                    throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
                }

                if ( data.PaymentMethod == PaymentMethod.CreditCard )
                {
                    String errorMessage = String.Empty;
                    Boolean isCreditCardValid = false;
                    isCreditCardValid = CreditCardValidation( data.BillingInformation, out errorMessage );
                    if ( !isCreditCardValid )
                    {
                        messageModel.Message = errorMessage;
                        messageModel.Title = "Failed to submit appraisal order to HVM.";

                        return PartialView( "Message/_customMessage", messageModel );
                    }
                }

                // Call iMP platform
                var results = new Proxy().Send( "UpdateOrderAppraisalWorkflow", new Dictionary<string, object> { { "Request", data } } );

                AppraisalOrderType orderType = ( AppraisalOrderType )data.OrderType;

                // Get results
                object response;
                results.TryGetValue( "Updated", out response );
                bool updated = ( bool )response;

                if ( updated )
                {
                    OriginationSystem originationSystem = OriginationSystem.MML;
                    if ( orderType == AppraisalOrderType.New || orderType == AppraisalOrderType.Update )
                    {
                        String loanNumber = LoanServiceFacade.RetrieveLoanNumber( data.LoanId, loggedUser.UserAccountId );

                        // Call iMP
                        IDictionary<string, object> lxResults = new Proxy().Send( "Submit", new Dictionary<string, object> { { "LoanNumber", loanNumber }, { "ClientId", "1" }, { "OriginationSystem", originationSystem } } );

                        object resultOrderId;
                        object resultRequestId;
                        object resultRequestXml;
                        object resultResponseXml;
                        lxResults.TryGetValue( "OrderId", out resultOrderId );
                        lxResults.TryGetValue( "RequestId", out resultRequestId );
                        lxResults.TryGetValue( "RequestXML", out resultRequestXml );
                        lxResults.TryGetValue( "ResponseXML", out resultResponseXml );

                        String orderId = ( String )resultOrderId;
                        Int64 requestId = ( Int64 )resultRequestId;
                        String requestXML = ( String )resultRequestXml;
                        String responseXML = ( String )resultResponseXml;

                        try
                        {

                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Appraisal to lenderX Request",
                                (Int32)IntegrationLogEvent.SubmitAppraisalOrderRequest, StringHelper.maskCreditCardNode(requestXML));

                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Appraisal to lenderX Response",
                                ( Int32 )IntegrationLogEvent.SubmitAppraisalOrderResponse, responseXML );
                        }
                        catch ( Exception e )
                        {
                            const string errorMessageFormat = "Failed to save LenderX integration logs. Loan number: {0}.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), e );
                        }

                        const string heavyTrafficMessage = "LenderX service is down or experiencing heavy traffic";
                        if ( responseXML != null && responseXML.Contains( "<success>0</success>" ) )
                        {
                            String errorMsg = String.Empty;
                            XElement xml = XElement.Parse( responseXML );
                            if ( xml != null )
                            {
                                XElement xmlError = xml.XPathSelectElement( "/error" );
                                errorMsg = xmlError != null ? xmlError.Value : String.Empty;
                                if ( errorMsg.EndsWith( "\n" ) )
                                    errorMsg = errorMsg.Substring( 0, errorMsg.Length - 1 );
                            }
                            throw new Exception( errorMsg );
                        }
                        else if ( responseXML != null && responseXML.Contains( heavyTrafficMessage ) )
                        {
                            // Add exception item to logs
                            ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitToLenderXFailed,
                                                                            heavyTrafficMessage,
                                                                            data.LoanId, data.UserAccountId );

                            // Throw exception
                            throw new Exception( heavyTrafficMessage );
                        }

                        // Save order id to MML DB
                        OrderAppraisalServiceFacade.UpdateAppraisalOrderId( data.LoanId, orderId );
                        DocumentsServiceFacade.UpdateLenderXOrderStatus( data.LoanId,
                                                                        ( int )LXAppraisalOrderStatus.ConfirmedFromLenderX );

                        AppraisalOrderCommonHelper commonOrderHelper = new AppraisalOrderCommonHelper();
                        OrderAppraisalInfo orderInfo = commonOrderHelper.ParseSubmitLenderXResponse( responseXML );

                        if ( orderInfo != null )
                        {
                            Boolean orderAppraisalUpdated = false;

                            try
                            {
                                // Update repository
                                IDictionary<string, object> updateAppraisalInfo = new Proxy().Send( "UpdateOrderAppraisalInfoWorkflow", new Dictionary<string, object> { { "Request", orderInfo } } );
                                object updateAppraisalInfoResult;
                                updateAppraisalInfo.TryGetValue( "Updated", out updateAppraisalInfoResult );
                                orderAppraisalUpdated = ( Boolean )updateAppraisalInfoResult;
                            }
                            catch( Exception e)
                            {
                                const string errorMessageFormat = "Failed to update order appraisal info. Loan number: {0}.";
                                TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), e );
                            }

                            if ( !orderAppraisalUpdated )
                            {
                                const string errorMessageFormat = "Failed to update order appraisal info. Loan number: {0}.";
                                TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), new Exception() );
                            }
                        }

                        if ( orderType == AppraisalOrderType.New )
                        {
                            audit.Message = messageModel.Message = "Appraisal Order successfully submitted to LenderX";
                            audit.Title = messageModel.Title = "Appraisal Ordered";
                        }
                        else
                        {
                            audit.Message = messageModel.Message = "Appraisal Order successfully updated on LenderX";
                            audit.Title = messageModel.Title = "Appraisal Updated";
                        }

                        ActivitiesServiceFacade.UpdateActivityStatusByLoanId(data.LoanId, ActivityType.OrderAppraisal, ActivityStatus.Completed, IdentityManager.GetUserAccountId(), true);

                        UpdateFilesStatuses( data.DocumentsToLenderX, data.LoanType, data.LoanId, data.UserAccountId );

                        // Update files statuses for LenderX
                        if ( data.DocumentsToLenderX != null && data.DocumentsToLenderX.Count > 0 && data.LoanType.Equals( LoanTransactionType.Purchase ) )
                        {
                            if ( data.DocumentsToLenderX.Where( d => d.Checked ).Any() )
                            {
                                // Update documents
                                IDictionary<string, object> docResults = new Proxy().Send( "SubmitDocument", new Dictionary<string, object> { { "OrderId", orderId }, { "RequestXml", "<request><loannumber>" + loanNumber + "</loannumber></request>" }, { "OriginationSystem", originationSystem }, { "OrderType", "document" } } );

                                // Get results
                                object responseMessage;
                                docResults.TryGetValue( "Result", out responseMessage );

                                String result = responseMessage != null ? ( String )responseMessage : String.Empty;
                            }

                            foreach ( LenderXFile document in data.DocumentsToLenderX.Where( d => d.Checked ) )
                            {
                                document.Submitted = true;
                                document.Checked = false;
                            }

                            if ( data.DocumentsToLenderX.Where( x => x.LenderXFileId != Guid.Empty ) != null )
                            {
                                DocumentsServiceFacade.UpdateLenderXFiles( data.DocumentsToLenderX.Where( x => x.LenderXFileId != Guid.Empty ).ToList() );
                            }
                        }

                        // Create Encompass record
                        try
                        {
                            AppraisalOrderHelper appraisalOrderHelper = new AppraisalOrderHelper();
                            string paymentMethodStringValue = appraisalOrderHelper.GetPaymentMethodValue( ( int )data.PaymentMethod );
                            string paidByStringValue = appraisalOrderHelper.GetPaidByValue( ( int )data.PaidBy );
                            OrderAppraisalServiceFacade.CreateEncompassRecord( loanNumber, paymentMethodStringValue, data.PaymentAmount.ToString(), paidByStringValue, orderId, data.State );
                        }
                        catch ( Exception ex )
                        {
                            const string errorMessageFormat = "Failed to save appraisal order. Loan number: {0}.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), ex );

                            if ( ex.ToString().Contains( "EllieMae.Encompass.BusinessObjects.Loans.LockException" ) )
                            {
                                // Loan is locked
                                ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitToLenderXFailed,
                                                                "Loan is currently locked in Encompass.",
                                                                data.LoanId, data.UserAccountId );
                            }
                            else if ( ex.ToString().ToLower().Contains( "version mismatch attempting to connect to server" ) )
                            {
                                // Missmatch of Encompass version
                                ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitToLenderXFailed,
                                                                "Encompass version mismatch.",
                                                                data.LoanId, data.UserAccountId );
                            }
                            else if ( ex.ToString().ToLower().Contains( "the operation has timed out" ) )
                            {

                                // Timeout
                                ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SubmitToLenderXFailed,
                                                                "Encompass service is down or unavailable.",
                                                                data.LoanId, data.UserAccountId );
                            }
                            throw;
                        }
                    }
                    else if ( orderType == AppraisalOrderType.Document )
                    {
                        String loanNumber = LoanServiceFacade.RetrieveLoanNumber( data.LoanId, loggedUser.UserAccountId );

                        UpdateFilesStatuses( data.DocumentsToLenderX, data.LoanType, data.LoanId, data.UserAccountId );

                        // Call iMP
                        IDictionary<string, object> docResults = new Proxy().Send( "SubmitDocument", new Dictionary<string, object> { { "OrderId", data.AppraisalOrderId }, { "RequestXml", "<request><loannumber>" + loanNumber + "</loannumber></request>" }, { "OriginationSystem", originationSystem }, { "OrderType", "document" } } );

                        // Get results
                        object responseMessage;
                        docResults.TryGetValue( "Result", out responseMessage );

                        String result = responseMessage != null ? ( String )responseMessage : String.Empty;

                        // Update files statuses for LenderX
                        if ( data.DocumentsToLenderX != null && data.DocumentsToLenderX.Count > 0 && data.LoanType != LoanTransactionType.Refinance )
                        {
                            foreach ( LenderXFile document in data.DocumentsToLenderX.Where( d => d.Checked ) )
                            {
                                document.Submitted = true;
                                document.Checked = false;
                            }

                            DocumentsServiceFacade.UpdateLenderXFiles( data.DocumentsToLenderX.Where( x => x.LenderXFileId != Guid.Empty ).ToList() );
                        }

                        try
                        {
                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Document to LenderX Request",
                                ( Int32 )IntegrationLogEvent.UploadAppraisalDocumentRequest, "<request><loannumber>" + loanNumber + "</loannumber></request>" );

                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Document to LenderX Response",
                                ( Int32 )IntegrationLogEvent.UploadAppraisalDocumentResponse, result );
                        }
                        catch ( Exception e )
                        {
                            const string errorMessageFormat = "Failed to save LenderX integration logs. Loan number: {0}.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, string.Format( errorMessageFormat, loanNumber ), e );
                        }

                        audit.Message = messageModel.Message = "Appraisal documents successfully submitted to LenderX";
                        audit.Title = messageModel.Title = "Appraisal Documents Uploaded";
                    }
                    else if ( orderType == AppraisalOrderType.Cancel )
                    {
                        IDictionary<string, object> cancelResults = null;
                        String result = String.Empty;

                        try
                        {
                            cancelResults = new Proxy().Send( "CancelOrder", new Dictionary<string, object> { { "OrderId", data.AppraisalOrderId }, { "RequestXml", "<request><reason>Cancel this order.</reason></request>" } } );

                            // Get results
                            object responseMessage;
                            cancelResults.TryGetValue( "Response", out responseMessage );

                            result = responseMessage != null ? ( String )responseMessage : String.Empty;
                        }
                        catch ( Exception ex )
                        {
                            string errorMessageFormat = "Failed to cancel order.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessageFormat, ex );

                            try
                            {
                                if ( cancelResults == null && ex.ToString().ToLower().Contains( "the operation has timed out" ) )
                                {
                                    ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.CancelOrderFailed,
                                                                            "LenderX Service is down or unavailable.",
                                                                            data.LoanId, data.UserAccountId );
                                }
                            }
                            catch ( Exception exc)
                            {
                                errorMessageFormat = "Failed to add exception item on cancel order command.";
                                TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessageFormat, exc );
                            }
                            
                            throw;
                        }

                        try
                        {
                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Cancel to LenderX Request",
                                ( Int32 )IntegrationLogEvent.SubmitAppraisalOrderRequest, "<request><reason>Cancel this order.</reason></request>" );

                            OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Submit Cancel to LenderX Response",
                                ( Int32 )IntegrationLogEvent.SubmitAppraisalOrderResponse, result );
                        }
                        catch ( Exception e )
                        {
                            const string errorMessageFormat = "Failed to save LenderX integration logs.";
                            TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessageFormat, e );
                        }

                        audit.Message = messageModel.Message = "Appraisal Order successfully cancelled on LenderX";
                        audit.Title = messageModel.Title = "Appraisal Cancelled";
                    }

                }
                else
                {
                    if ( orderType == AppraisalOrderType.New )
                    {
                        audit.Message = messageModel.Message = "Error occured while submiting Appraisal Order to LenderX.";
                        audit.Title = messageModel.Title = "Error";
                    }
                    else if ( orderType == AppraisalOrderType.Update )
                    {
                        audit.Message = messageModel.Message = "Error occured while updating Appraisal Order on LenderX.";
                        audit.Title = messageModel.Title = "Error";
                    }
                    else if ( orderType == AppraisalOrderType.Document )
                    {
                        audit.Message = messageModel.Message = "Error occured while submitting Appraisal document to LenderX.";
                        audit.Title = messageModel.Title = "Error";
                    }
                    else if ( orderType == AppraisalOrderType.Cancel )
                    {
                        audit.Message = messageModel.Message = "Error occured while cancelling Appraisal Order on LenderX.";
                        audit.Title = messageModel.Title = "Error";
                    }
                }

                AuditServiceFacade.CreateAuditEvent( audit );

                // Update files statuses for LenderX
                DocumentsServiceFacade.UpdateLenderXFiles( data.DocumentsToLenderX );

                //Create seller contact if it doesn'e exist
                PopulateSellerData( data );

                // Update Queue lists
                try
                {
                    LoanServiceFacade.ProcessQueueItems(data.LoanId, data.UserAccountId);
                }
                catch (InvalidOperationException exception)
                {
                    //Just log data and do not throw exception
                    TraceHelper.Error(TraceCategory.LoanService, "Failed to update queue items.", exception, data.LoanId, data.UserAccountId);
                }
            

                if ( Session[ SessionHelper.CurrentTab ] is LoanCenterTab && ( LoanCenterTab )Session[ SessionHelper.CurrentTab ] == LoanCenterTab.OrderRequested )
                {
                     var errorMessageModel = new ErrorMessage();
                     errorMessageModel.Message = messageModel.Message;
                     errorMessageModel.Title = messageModel.Title;
                     return PartialView( "Message/_customMessage", errorMessageModel );
                }
                else
                    return PartialView( "Message/_customMessageReloadAppraisal", messageModel );
            }
            catch ( Exception exception )
            {
                // Get error mesage
                String lxErrorMessage = String.Empty;
                if ( !String.IsNullOrWhiteSpace( exception.Message ) )
                    lxErrorMessage = exception.Message;

                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to save appraisal order", exception );

                string errorMessageFormat = "Failed to save LenderX integration logs";

                try
                {
                    OrderAppraisalServiceFacade.InsertLenderXLog( data.LoanId, "Failed to save appraisal Order",
                        ( Int32 )IntegrationLogEvent.LenderXException, exception.ToString() );

                    errorMessageFormat = "Failed to insert exception item.";
                    if ( exception.ToString().ToLower().Contains( "errors have occurred during sending documents" ) )
                    {
                        ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SendDocumentFailed,
                                                                "LenderX Service is down or unavailable.",
                                                                data.LoanId, data.UserAccountId );
                    }
                }
                catch ( Exception e )
                {
                    TraceHelper.Error( TraceCategory.OrderAppraisal, errorMessageFormat, e );
                }

                var errorMessage = new ErrorMessage();
                if ( String.IsNullOrWhiteSpace( lxErrorMessage ) )
                    errorMessage.Message = "Error occured while submitting request to LenderX.";
                else
                    errorMessage.Message =
                        string.Format( "Error occured while submitting request to LenderX. LenderX error details - {0}",
                                      lxErrorMessage );

                errorMessage.Title = "Error";

                return PartialView( "Message/_customMessage", errorMessage );
            }
        }

        /// <summary>
        ///  Update files statuses for LenderX
        /// </summary>
        private void UpdateFilesStatuses( List<LenderXFile> files, LoanTransactionType typeOfLoan, Guid loanId, int userAccountId )
        {
            if ( files != null && files.Count > 0 && typeOfLoan.Equals( LoanTransactionType.Purchase ) )
            {
                if ( files.Where( x => x.LenderXFileId != Guid.Empty ) != null && files.Where( x => x.LenderXFileId != Guid.Empty ).Count() > 0 )
                {
                    DocumentsServiceFacade.UpdateLenderXFiles( files.Where( x => x.LenderXFileId != Guid.Empty ).ToList() );
                }
                if ( files.Where( x => x.LenderXFileId == Guid.Empty ) != null && files.Where( x => x.LenderXFileId == Guid.Empty ).Count() > 0 )
                {
                    DocumentsServiceFacade.InsertIntoLenderXFiles( loanId, files.Where( x => x.LenderXFileId == Guid.Empty ).ToList(), userAccountId );
                }
            }
        }

        public ActionResult SaveAppraisalOrder( UpdateOrderAppraisalDataFull data )
        {
            var messageModelReload = new AppraisalConfirmationMessage();
            messageModelReload.LoanId = data.LoanId.ToString();

            var messageModel = new ErrorMessage();
            IDictionary<string, object> results = null;

            try
            {
                // Call iMP platform
                results = new Proxy().Send( "UpdateOrderAppraisalWorkflow", new Dictionary<string, object> { { "Request", data } } );

                // Get results
                object response;
                results.TryGetValue( "Updated", out response );
                bool updated = ( bool )response;

                // Update files statuses for LenderX
                UpdateFilesStatuses( data.DocumentsToLenderX, data.LoanType, data.LoanId, data.UserAccountId );

                //Create seller contact if it doesn'e exist
                PopulateSellerData( data );

                // Update Queue lists
                try
                {
                    LoanServiceFacade.ProcessQueueItems(data.LoanId, data.UserAccountId);
                }
                catch (InvalidOperationException exception)
                {
                    //Just log data and do not throw exception
                    TraceHelper.Error(TraceCategory.LoanService, "Failed to update queue items.", exception, data.LoanId, data.UserAccountId);
                }

                if ( !updated )
                {
                    messageModel.Message = "Error occured while updating Appraisal Order.";
                    messageModel.Title = "Error in update";

                    return PartialView( "Message/_customMessage", messageModel );
                }
                else
                {
                    messageModelReload.Message = "Appraisal Order successfully updated";
                    messageModelReload.Title = "Success";

                    return PartialView( "Message/_customMessageReloadAppraisal", messageModelReload );
                }

            }
            catch ( Exception exception )
            {
                if ( results == null )
                {
                    ExceptionItemServiceFacade.AddExceptionItem( ExceptionTypeEnum.SaveAppraisalOrderFailed,
                                                                    "Web iMP service is down/unavailable.",
                                                                    data.LoanId, data.UserAccountId );
                }

                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to save appraisal order", exception );
                messageModel.Message = "Failed to save appraisal order.";
                messageModel.Title = "Error";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }

        /// <summary>
        /// Show Upload File
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ShowUploadFile( string loanId, string userAccountId )
        {
            UploadFileViewModel uploadFile = new UploadFileViewModel();
            Guid _loanID = new Guid();
            int _userAccountID = default( int );

            Guid.TryParse( loanId, out _loanID );
            int.TryParse( userAccountId, out _userAccountID );

            uploadFile.LoanID = _loanID;
            uploadFile.UserAccountID = _userAccountID;

            List<DocumentCategory> documentCategories = DocumentsServiceFacade.RetrieveDocumentCategoriesForClass( DocumentClass.VariousDocuments, _loanID, _userAccountID );
            if ( documentCategories == null )
                documentCategories = new List<DocumentCategory>();

            List<DocumentCategory> otherDocumentsCategories = DocumentsServiceFacade.RetrieveDocumentCategoriesForClass( DocumentClass.OtherDocuments, _loanID, _userAccountID );
            if ( otherDocumentsCategories != null && otherDocumentsCategories.Where( x => x.IsAppraisalDocument ) != null )
                documentCategories.AddRange( otherDocumentsCategories.Where( x => x.IsAppraisalDocument ).ToList() );

            uploadFile.DocumentCategories = ConvertDocumentCategoriesToListItems( documentCategories );

            return PartialView( "Appraisal/_uploadFile", uploadFile );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>
        /// <param name="maxLength"></param>
        /// <returns></returns>
        public String TrimCharacters( String name, int maxLength )
        {
            String tempName = name;
            if ( !string.IsNullOrEmpty( tempName ) && tempName.Length > maxLength )
            {
                tempName = String.Format( "{0}{1}", tempName.Substring( 0, maxLength ), "..." );
            }

            return tempName;
        }

        [HttpPost]
        public WrappedJsonResult Uploadfile( UploadFileViewModel model, HttpPostedFileBase file )
        {
            var borrowersId = BorrowerServiceFacade.GetBorrowerIdAndCoborrowerId( model.LoanID, IdentityManager.GetUserAccountId() );
            bool isSaved = false;

            if ( borrowersId != null )
            {
                Int32 documentCategoryId = default( Int32 );
                Int32.TryParse( model.SelectedDocumentCategory, out documentCategoryId );

                UploadedDocument doc = UploadSingleDocument( file, borrowersId.UserAccountId );
                if ( doc != null )
                {
                    byte[] fileBytes = ReadFromFile( doc.RepositoryItemFilePath );
                    doc.RepositoryItem.FileStoreItemFile.Data = fileBytes;

                    var documentBorrowerIds = new List<Guid> { borrowersId.BorrowerId };

                    isSaved = DocumentsServiceFacade.UploadDocumentToLoanApplicationConcierge( model.LoanID, documentBorrowerIds,
                                                                                              documentCategoryId,
                                                                                              doc.RepositoryItem,
                                                                                              model.UserAccountID,
                                                                                              FileUploadedBy.Concierge,
                                                                                              true );

                    DeleteFile( doc.RepositoryItemFilePath );
                }
            }

            return new WrappedJsonResult
            {
                Data = new
                {
                    IsValid = isSaved
                }
            };
        }

        public ActionResult GetAppraisalUploadedDocuments( Guid loanId, int userAccountId )
        {

            AppraisalViewModel userAppraisalViewModel = new AppraisalViewModel();

            AppraisalDocumentsHelper appraisalDocumentsHelper = new AppraisalDocumentsHelper();
            appraisalDocumentsHelper.GetAppraisalDocuments( loanId, userAccountId, ref userAppraisalViewModel );

            return PartialView( "Appraisal/_appraisalUploadDocuments", userAppraisalViewModel );
        }

        /// <summary>
        /// Read data from specified path
        /// </summary>
        /// <param name="strPath"></param>
        /// <param name="Buffer"></param>
        private byte[] ReadFromFile( string strPath )
        {
            try
            {
                FileStream newFile = new FileStream( strPath, FileMode.Open, FileAccess.Read, FileShare.Read );

                byte[] fileBytes = new byte[ newFile.Length ];

                newFile.Read( fileBytes, 0, Convert.ToInt32( newFile.Length ) );
                newFile.Close();

                return fileBytes;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.UploadingDocuments, "Error in UploadDocuments.ReadFromFile()", ex, /*_loanId*/Guid.Empty, IdentityManager.GetUserAccountId() );
                return null;
            }
        }

        /// <summary>
        /// Deletes file at specified path
        /// </summary>
        /// <param name="strPath"></param>
        /// <param name="Buffer"></param>
        private bool DeleteFile( string strPath )
        {
            try
            {
                FileInfo fileInfo = new FileInfo( strPath );
                fileInfo.Delete();

                return true;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.UploadingDocuments, "Error in UploadDocuments.DeleteFile()", ex, /*_loanId*/ Guid.Empty, IdentityManager.GetUserAccountId() );
                return false;
            }
        }

        /// <summary>
        /// Add document
        /// </summary>
        private UploadedDocument UploadSingleDocument( HttpPostedFileBase file, Int32 borrowerId )
        {
            try
            {

                if ( file != null && file.InputStream != null )
                {
                    if ( ValidateExtension( file.FileName ) )
                    {
                        if ( ValidateFileSize( file.InputStream.Length ) )
                        {
                            if ( ( file.FileName.Length > 0 ) && ( file.InputStream.Length > 0 ) )
                            {
                                UploadedDocument singleRequiredDocument = new UploadedDocument();

                                using ( BinaryReader reader = new BinaryReader( file.InputStream ) )
                                {
                                    byte[] fileData = reader.ReadBytes( ( int )file.InputStream.Length );

                                    if ( fileData != null )
                                    {
                                        singleRequiredDocument.RepositoryItem = new FileStoreItem()
                                        {
                                            FileStoreItemFile = new FileStoreItemFile()
                                            {
                                                Filename = Path.GetFileName( HttpUtility.UrlDecode( file.FileName ) ),
                                                ContentType = GetContentTypeFromString( file.ContentType ),
                                                DateCreated = DateTime.Now,
                                            },
                                            DateCreated = DateTime.Now,
                                            Properties = null,
                                            UserAccountId = IdentityManager.GetUserAccountId()
                                        };

                                        StringBuilder temporaryFileName = new StringBuilder();
                                        temporaryFileName.Append( Guid.NewGuid().ToString() );
                                        temporaryFileName.Append( Path.GetExtension( file.FileName ) );

                                        DirectoryInfo userUploadDirectory = new DirectoryInfo( Server.MapPath( "~/Uploads/Users/" + borrowerId.ToString() + "/" ) );

                                        if ( !userUploadDirectory.Exists )
                                            userUploadDirectory.Create();

                                        string pathToWrite = Path.Combine( userUploadDirectory.ToString(), temporaryFileName.ToString() );

                                        bool fileWriteSucceded = WriteToFile( pathToWrite, ref fileData );

                                        if ( fileWriteSucceded )
                                        {
                                            singleRequiredDocument.RepositoryItemFilePath = pathToWrite;
                                            return singleRequiredDocument;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                //GenerateResponse( "application/json", "This document contains no data and cannot be uploaded!" );
                            }
                        }
                        else
                        {
                            //GenerateResponse( "application/json", String.Format( "Please make sure your file size is under {0:0.#} MB.", MaximumUploadedFileSize / 1024 ) );
                        }
                    }
                    else
                    {
                        //GenerateResponse( "application/json", String.Format( "Uploading files of this type is not allowed. Allowed file types are {0}", String.Join( ", ", AllowedExtensions ) ) );
                    }
                }

            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.UploadingDocuments, "Error in Appraisal controller, UploadSingleDocument()", ex, /*_loanId*/Guid.Empty, IdentityManager.GetUserAccountId() );
                //AjaxHelper.ShowErrorMessageBox( Page );
            }
            return new UploadedDocument();
        }

        /// <summary>
        /// Write data fo file at specified path
        /// </summary>
        /// <param name="strPath"></param>
        /// <param name="Buffer"></param>
        private bool WriteToFile( string strPath, ref byte[] Buffer )
        {
            try
            {
                FileStream newFile = new FileStream( strPath, FileMode.Create );
                newFile.Write( Buffer, 0, Buffer.Length );
                newFile.Close();

                return true;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.UploadingDocuments, "Error in UploadDocuments.WriteToFile()", ex, /*_loanId*/ Guid.Empty, IdentityManager.GetUserAccountId() );
                //AjaxHelper.ShowErrorMessageBox( Page );
                return false;
            }
        }

        private bool ValidateExtension( string filename )
        {
            bool isValid = false;

            /// Array of allowed file extensions for document upload
            string[] AllowedExtensions = new string[]
                                                 {
                                                     // archives
                                                     "ZIP", "RAR",

                                                     // documents
                                                     "PDF", "DOCX", "DOC", "XLSX", "XLS", "TXT", "RTF",

                                                     // pictures
                                                     "JPG", "JPEG", "PNG", "GIF"
                                                 };

            string extension = Path.GetExtension( filename );
            if ( !string.IsNullOrEmpty( extension ) )
            {
                isValid = AllowedExtensions.Any( s => s.ToUpper().Equals( extension.Replace( ".", string.Empty ).ToUpper() ) );
            }

            return isValid;
        }

        /// <summary>
        /// Get required document content type from file content type string
        /// </summary>
        /// <param name="contentType"></param>
        /// <returns></returns>
        private static DocumentContentType GetContentTypeFromString( string contentType )
        {
            return Enum.GetValues( typeof( DocumentContentType ) ).Cast<DocumentContentType>().FirstOrDefault( enumType => enumType.GetStringValue().Equals( contentType ) );
        }

        private bool ValidateFileSize( long fileSizeInBytes )
        {
            bool isValid = false;

            // Maximum uploaded file size (in KB), equals 48 MB
            Int32 MaximumUploadedFileSize = 49152;
            if ( ( fileSizeInBytes / 1024 ) > MaximumUploadedFileSize )
                isValid = false;
            else isValid = true;

            return isValid;
        }

        private List<ItemViewModel> ConvertDocumentCategoriesToListItems( List<DocumentCategory> documentCategories )
        {
            List<ItemViewModel> listItems = null;
            try
            {
                listItems = new List<ItemViewModel>();

                foreach ( DocumentCategory document in documentCategories )
                {
                    int maxLength = 40;
                    if ( !string.IsNullOrEmpty( document.Name ) && document.Name.Length > maxLength )
                        document.Name = TrimCharacters( document.Name, maxLength );

                    listItems.Add( new ItemViewModel() { Id = document.DocumentCategoryId, Name = document.Name } );
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.ConciergeDocumentDownloader, "Unable to convert list of DocumentCategory to drop down items.", ex );
                throw;
            }
            return listItems;
        }

        #region Private implementations

        private string GetPreferredPhone( BusinessContact businessContact )
        {
            string preferredPhone = String.Empty;
            switch ( businessContact.Preferred )
            {
                case ContactPreferrence.CellPhone:
                    preferredPhone = businessContact.CellPhone;
                    break;
                case ContactPreferrence.HomePhone:
                    preferredPhone = businessContact.HomePhone;
                    break;
                case ContactPreferrence.WorkPhone:
                    preferredPhone = businessContact.WorkPhone;
                    break;
                case ContactPreferrence.OtherPhone:
                    preferredPhone = businessContact.OtherPhone;
                    break;
                case ContactPreferrence.Email:
                    break;
                default:
                    break;
            }
            return preferredPhone;
        }

        private PreferredPhone GetPreferredPhone( Contracts.Borrower borrower )
        {
            PreferredPhone preferredPhone = new PreferredPhone();
            foreach ( var phoneNumber in borrower.PhoneNumbers )
            {
                if ( phoneNumber.Preferred )
                {
                    preferredPhone.Number = phoneNumber.Number;
                    preferredPhone.Type = phoneNumber.PhoneNumberType;
                }
            }
            return preferredPhone;
        }

        private BusinessContactPhoneNumber GetBusinessContactPreferredPhoneNumber( BusinessContact businessContact )
        {
            BusinessContactPhoneNumber businessContactPhoneNumber = new BusinessContactPhoneNumber();
            foreach ( BusinessContactPhoneNumber phoneNumber in businessContact.BusinessContactPhoneNumbers )
            {
                if ( phoneNumber.Preferred )
                    businessContactPhoneNumber = phoneNumber;
            }
            return businessContactPhoneNumber;
        }

        private class PreferredPhone
        {
            public string Number { get; set; }
            public int Type { get; set; }
        }

        #endregion Private implementations
    }
}

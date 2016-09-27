using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Models;

namespace MML.Web.LoanCenter.Commands
{
    public class CalendarDataLoadCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get
            {
                return _viewName;
            }
        }

        public dynamic ViewData
        {
            get
            {
                return _viewModel;
            }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        public void Execute()
        {
            _viewName = "_appointment";
            _viewModel = CreateTestAppointments(); // TODO: change to Web.Facade call later
        }

        /// <summary>
        /// Creates Test Appointments data
        /// </summary>
        /// <returns></returns>
        private List<Appointment> CreateTestAppointments()
        {
            return new List<Appointment>()
                       {
                           // Before
                           new Appointment() {Start = DateTime.Now.Date.AddDays(-10).AddHours(09), End = DateTime.Now.Date.AddDays(-10).AddHours(09).AddMinutes(45), Note = "Call new Loan Officer(s)"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(-2).AddHours(09).AddMinutes(15), End = DateTime.Now.Date.AddDays(-2).AddHours(11).AddMinutes(45), Note = "Meet Jane Perry"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(-2).AddHours(10), End = DateTime.Now.Date.AddDays(-2).AddHours(10).AddMinutes(30), Note = "Meet your team members"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(-1).AddHours(11), End = DateTime.Now.Date.AddDays(-1).AddHours(13), Note = "Assign new tasks to all"},
        
                           // Today
                           new Appointment() {Start = DateTime.Now.Date.AddHours(10), End = DateTime.Now.Date.AddHours(10).AddMinutes(30), Note = "Meet Mr. Smith"},
                           new Appointment() {Start = DateTime.Now.Date.AddHours(11).AddMinutes(30), End = DateTime.Now.Date.AddHours(11).AddMinutes(45), Note = "Take new mail"},
                           new Appointment() {Start = DateTime.Now.Date.AddHours(12), End = DateTime.Now.Date.AddHours(12).AddMinutes(55), Note = "Collect data regarding new Mercedes Benz"},
                           new Appointment() {Start = DateTime.Now.Date.AddHours(13), End = DateTime.Now.Date.AddHours(14), Note = "Take a break"},

                           // Tomorrow
                           new Appointment() {Start = DateTime.Now.Date.AddDays(1).AddHours(09), End = DateTime.Now.Date.AddDays(1).AddHours(09).AddMinutes(45), Note = "Meet Mrs. Smith"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(1).AddHours(10).AddMinutes(15), End = DateTime.Now.Date.AddDays(1).AddHours(11).AddMinutes(45), Note = "Call bank manager"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(1).AddHours(12), End = DateTime.Now.Date.AddDays(1).AddHours(12).AddMinutes(30), Note = "Meet Mr. President at LAX"},
                           new Appointment() {Start = DateTime.Now.Date.AddDays(1).AddHours(13), End = DateTime.Now.Date.AddDays(1).AddHours(15), Note = "Introduce new team members"}
                       };
        }
    }
}
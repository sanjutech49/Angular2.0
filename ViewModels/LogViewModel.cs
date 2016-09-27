using System;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
	[Serializable]
	public class LogViewModel
	{
		public List<LogItem> Log { get; set; }

		public Guid LoanId { get; set; }
	}
}
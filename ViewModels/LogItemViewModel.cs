using System;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
	[Serializable]
	public class LogItemViewModel
	{
		public Guid LoanId { get; set; }
		public LogItem LogItem { get; set; }
		public List<ConversationSubject> ConversationSubjects { get; set; }
		public List<ConversationTopic> ConversationTopics { get; set; }
	}
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc.Async;
using System.Threading.Tasks;

namespace MML.Web.LoanCenter.Extensions
{
    public static class AsyncManagerExtensions
    {
        /// <summary>
        /// Queue task to execute on the async manager
        /// </summary>
        /// <param name="asyncManager"></param>
        /// <param name="task"></param>
        public static void QueueAction(this AsyncManager asyncManager, Action action)
        {
            // Increment the async operations counter
            asyncManager.OutstandingOperations.Increment();

            // Use TPL Task to process the action asynchronously
            Task task = Task.Factory.StartNew(action);

            // Add a continuation to decrement the async operations counter
            task.ContinueWith((t) =>
            {
                if (task.Exception != null)
                    asyncManager.Parameters["AggregateException"] = task.Exception;

                asyncManager.OutstandingOperations.Decrement();
            });
        }
    }
}
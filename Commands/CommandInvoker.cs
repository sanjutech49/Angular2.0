using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using MML.Common;

namespace MML.Web.LoanCenter.Commands
{
    public class CommandInvoker
    {
        /// <summary>
        /// Invoke command from string containing command name and params
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public static CommandResult InvokeFromCompositeString(String command, HttpContextBase httpContext)
        {
            var result = new CommandResult();

            String[] splitWords = command.Split(',');

            String actualCommandName = splitWords.First().Trim().ToLower();

            Dictionary<string, object> inputParams = null;

            // command contains parameters
            if (splitWords.Count() > 1)
            {
                inputParams = new Dictionary<string, object>();

                for (int i = 1; i < splitWords.Count(); i++)
                {
                    String[] commandParam = splitWords[i].Split('=');

                    inputParams.Add(commandParam[0], commandParam[1]); // param name, param value
                }
            }

            ICommand actualCommand = null;

            foreach (var type in Assembly.GetCallingAssembly().GetTypes())
            {
                if (type.Name.ToLower().Equals(actualCommandName + "command"))
                {
                    var obj = Assembly.GetExecutingAssembly().CreateInstance(type.FullName);

                    actualCommand = (obj as ICommand);

                    break;
                }
            }

            if (actualCommand != null)
            {
                actualCommand.InputParameters = inputParams;
                actualCommand.HttpContext = httpContext;

                actualCommand.Execute();

                result.ViewName = actualCommand.ViewName;
                result.ViewData = actualCommand.ViewData;
            }

            return result;
        }
    }
}
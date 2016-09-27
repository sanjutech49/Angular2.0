using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class OfficerTaskGridHelper
    {
        public static void ProcessPagingOptions(OfficerTaskListState taskListState, OfficerTasksViewModel taskViewModel)
        {
            if (taskViewModel.PageCount % 10 == 0)
            {
                taskViewModel.PageGroups = (taskViewModel.PageCount / 10);
            }
            else
            {
                taskViewModel.PageGroups = (taskViewModel.PageCount / 10) + 1;
            }

            taskViewModel.PageGroups = (int)taskViewModel.PageGroups;
            if (taskViewModel.PageCount % 10 != 0)
            {
                taskViewModel.LastPageItems = taskViewModel.PageCount % 10;
            }
            else
            {
                taskViewModel.LastPageItems = 10;
            }

            taskViewModel.CurrentPage = taskListState.CurrentPage;

            if (taskViewModel.CurrentPage % 10 != 0)
            {
                taskViewModel.StartPage = (int)(taskViewModel.CurrentPage / 10) * 10 + 1;
                if (((int)((taskViewModel.CurrentPage) / 10) + 1) == taskViewModel.PageGroups)
                {
                    taskViewModel.EndPage = (int)(taskViewModel.CurrentPage / 10) * 10 + taskViewModel.LastPageItems;
                    taskViewModel.LastPageDots = true;
                }
                else
                {
                    taskViewModel.EndPage = (int)(taskViewModel.CurrentPage / 10) * 10 + 10;
                    taskViewModel.LastPageDots = false;
                }
            }
            else
            {
                taskViewModel.StartPage = (int)((taskViewModel.CurrentPage - 1) / 10) * 10 + 1;
                if (((int)((taskViewModel.CurrentPage - 1) / 10) + 1) == taskViewModel.PageGroups)
                {
                    taskViewModel.EndPage = (int)(taskViewModel.CurrentPage / 10) * 10;
                    taskViewModel.LastPageDots = true;
                }
                else
                {
                    taskViewModel.EndPage = (int)((taskViewModel.CurrentPage - 1) / 10) * 10 + 10;
                    taskViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection(OfficerTasksViewModel taskViewModel)
        {
            if (taskViewModel.OfficerTasks != null)
            {
                // Business rule
                foreach (var item in taskViewModel.OfficerTasks)
                {
                    if (item.DueDate < DateTime.Now.Date)
                    {
                        item.ClassCollection = "tasktablelistduedate";
                    }
                    else
                    {
                        item.ClassCollection = "tasktablelist";
                    }
                }
            }
        }
    }
}
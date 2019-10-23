using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TimesheetPrototypeApp.Models;

namespace TimesheetPrototypeApp.Controllers
{
    public class TimesheetController : Controller
    {
        // GET: Timesheet
        //[Authorize(Roles = "Admin,Editor")]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllRecords()
        {
            using (TimesheetEntities dc = new TimesheetEntities())
            {
                var events = dc.Timesheets.ToList();
                return new JsonResult { Data = events, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //[Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public JsonResult SaveRecord(Timesheet t)
        {
            var status = false;
            using (TimesheetEntities dc = new TimesheetEntities())
            {
                if (t.TimesheetID > 0)
                {
                    var v = dc.Timesheets.Where(a => a.TimesheetID == t.TimesheetID).FirstOrDefault();
                    if (v != null)
                    {
                        v.User = t.User;
                        v.Start = t.Start;
                        v.End = t.End;
                        v.Description = t.Description;
                    }
                }
                else
                {
                    dc.Timesheets.Add(t);
                }

                dc.SaveChanges();
                status = true;

            }
            return new JsonResult { Data = new { status = status } };
        }

        //[Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public JsonResult DeleteRecord(int recID)
        {
            var status = false;
            using (TimesheetEntities dc = new TimesheetEntities())
            {
                var v = dc.Timesheets.Where(a => a.TimesheetID == recID).FirstOrDefault();
                if (v != null)
                {
                    dc.Timesheets.Remove(v);
                    dc.SaveChanges();
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status } };
        }
    }
}
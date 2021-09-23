using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TimesheetPrototypeApp.Models;

namespace TimesheetPrototypeApp.Controllers
{
    public class HomeController : Controller
    {
        [Authorize(Roles = "Admin,User")]
        public ActionResult Index()
        {
            ViewBag.Users = User.Identity.Name;
            return View();
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet]
        public JsonResult GetAllRecords()
        {
            using (TimesheetEntities dc = new TimesheetEntities())
            {   //return timesheets only for authenticated user
                var events = dc.Timesheets.Where(p=> p.User == User.Identity.Name).ToList();
                return new JsonResult { Data = events, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [Authorize(Roles = "Admin,User")]
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

        [Authorize(Roles = "Admin,User")]
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

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
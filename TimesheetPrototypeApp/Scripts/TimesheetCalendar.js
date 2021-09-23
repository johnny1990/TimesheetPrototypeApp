$(document).ready(function () {

    var timesheets = [];
    var selectedEvent = null;
    FetchEventAndRenderCalendar();
    function FetchEventAndRenderCalendar() {
        timesheets = [];
        $.ajax({
            type: "GET",
            url: "/Home/GetAllRecords",
            success: function (data) {
                $.each(data, function (i, v) {
                    timesheets.push({
                        timesheetID: v.TimesheetID,
                        user: v.User,
                        start: moment(v.Start),
                        end: v.End != null ? moment(v.End) : null,
                        description: v.Description,
                    });
                })

                GenerateCalender(timesheets);
            },
            error: function (error) {
                alert('failed');
            }
        })
    }

    function GenerateCalender(events) {
        $('#calender').fullCalendar('destroy');
        $('#calender').fullCalendar({
            contentHeight: 400,
            defaultDate: new Date(),
            timeFormat: 'h(:mm)a',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay,agenda'
            },
            eventLimit: true,
            eventColor: '#378006',
            events: events,
            eventClick: function (calEvent, jsEvent, view) {
                selectedEvent = calEvent;
                $('#myModal #eventTitle').text(calEvent.title);
                var $description = $('<div/>');
                $description.append($('<p/>').html('<b>Begin:</b>' + calEvent.start.format("DD-MMM-YYYY HH:mm a")));
                if (calEvent.end != null) {
                    $description.append($('<p/>').html('<b>End:</b>' + calEvent.end.format("DD-MMM-YYYY HH:mm a")));
                }
                $description.append($('<p/>').html('<b>Description:</b>' + calEvent.description));
                $('#myModal #pDetails').empty().html($description);

                $('#myModal').modal();
            },
            selectable: true,
            select: function (start, end) {
                selectedEvent = {
                    timesheetID: 0,
                    user: '',
                    start: start,
                    end: end,
                    description: ''
                };
                openAddEditForm();
                $('#calendar').fullCalendar('unselect');
            },
            editable: true,
            eventDrop: function (event) {
                var data = {
                    TimesheetID: event.TimesheetID,
                    User: event.User,
                    Start: event.Start.format('MM/DD/YYYY HH:mm A'),
                    End: event.End != null ? event.End.format('MM/DD/YYYY HH:mm A') : null,
                    Description: event.Description
                };
                SaveEvent(data);
            }
        })
    }

    $('#btnEdit').click(function () {
        //Open modal dialog for edit event
        openAddEditForm();
    })
    $('#btnDelete').click(function () {
        if (selectedEvent != null && confirm('Are you sure?')) {
            $.ajax({
                type: "POST",
                url: '/Home/DeleteRecord',
                data: { 'recID': selectedEvent.timesheetID },
                success: function (data) {
                    if (data.status) {
                        //Refresh the calender
                        FetchEventAndRenderCalendar();
                        $('#myModal').modal('hide');
                    }
                },
                error: function () {
                    alert('Failed');
                }
            })
        }
    })

    $('#dtp1,#dtp2').datetimepicker({
        format: 'DD/MM/YYYY HH:mm A'
    });


    function openAddEditForm() {
        if (selectedEvent != null) {
            $('#hdTimesheetID').val(selectedEvent.timesheetID);
            $('#txtUsername').val(selectedEvent.user);
            $('#txtStart').val(selectedEvent.start.format('MM/DD/YYYY HH:mm A'));
            $('#txtEnd').val(selectedEvent.end != null ? selectedEvent.end.format('MM/DD/YYYY HH:mm A') : '');
            $('#txtDescription').val(selectedEvent.description);
        }
        $('#myModal').modal('hide');
        $('#myModalSave').modal();
    }

    $('#btnSave').click(function () {
        //Validation/
        if ($('#txtUsername').val().trim() == "") {
            alert('Subject required');
            return;
        }
        if ($('#txtStart').val().trim() == "") {
            alert('Start date required');
            return;
        }

        else {
            var startDate = moment($('#txtStart').val(), "MM/DD/YYYY HH:mm A").toDate();
            var endDate = moment($('#txtEnd').val(), "MM/DD/YYYY HH:mm A").toDate();
            if (startDate > endDate) {
                alert('Invalid end date');
                return;
            }
        }

        var data = {
            TimesheetID: $('#hdTimesheetID').val(),
            User: $('#txtUsername').val().trim(),
            Start: $('#txtStart').val().trim(),
            End: $('#txtEnd').val().trim(),
            Description: $('#txtDescription').val().trim(),

        }
        SaveEvent(data);

    })

    function SaveEvent(data) {
        $.ajax({
            type: "POST",
            url: 'Home/SaveRecord',
            data: data,
            success: function (data) {
                if (data.status) {

                    FetchEventAndRenderCalendar();
                    $('#myModalSave').modal('hide');
                }
            },
            error: function () {
                alert('Failed');
            }
        })
    }
})
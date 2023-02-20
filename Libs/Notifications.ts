

namespace Notifications {



    //System.PageTitleNotification = {
    //    Vars: {
    //        OriginalTitle: document.title,
    //        Interval: null
    //    },
    //    On: function (notification, intervalSpeed) {
    //        var _this = this;
    //        _this.Vars.Interval = setInterval(function () {
    //            document.title = (_this.Vars.OriginalTitle == document.title)
    //                ? notification
    //                : _this.Vars.OriginalTitle;
    //        }, (intervalSpeed) ? intervalSpeed : 1000);
    //    },
    //    Off: function () {
    //        clearInterval(this.Vars.Interval);
    //        document.title = this.Vars.OriginalTitle;
    //    }
    //}
    //System.Notify = function (subject, message) {
    //    // Check for notification compatibility.
    //    if (!('Notification' in window)) {
    //        // If the browser version is unsupported, remain silent.
    //        return;
    //    }
    //    // Log current permission level
    //    console.log(Notification.permission);
    //    // If the user has not been asked to grant or deny notifications
    //    // from this domain...
    //    if (Notification.permission === 'default') {
    //        Notification.requestPermission(function () {
    //            // ...callback this function once a permission level has been set.
    //            System.Notify(subject, message);
    //        });
    //    }
    //    // If the user has granted permission for this domain to send notifications...
    //    else if (Notification.permission === 'granted') {
    //        var n = new Notification(
    //            subject,
    //            {
    //                'body': message,
    //                // ...prevent duplicate notifications
    //                'tag': "M" + System.GetTimeCount()
    //            }
    //        );
    //        // Remove the notification from Notification Center when clicked.
    //        n.onclick = function () {
    //            this.close();
    //        };
    //        // Callback function when the notification is closed.
    //        n.onclose = function () {
    //            console.log('Notification closed');
    //        };
    //    }
    //    // If the user does not want notifications to come from this domain...
    //    else if (Notification.permission === 'denied') {
    //        // ...remain silent.
    //        return;
    //    }
    //};
}
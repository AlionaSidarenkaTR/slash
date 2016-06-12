angular.module('wunderlist').factory('popupService', ['tasksService',  
    function (tasksService) {
        var that = this;

        that.popupShown = false;
        that.taskPopupShown = false;

        return {
            isPopupShown: function() {
                return that.popupShown;
            },
            showPopup: function() {
                that.popupShown = !that.popupShown;
            },
            showTaskPopup: function() {
                that.taskPopupShown = !that.taskPopupShown;
            },
            isTaskPopupShown: function() {
                return that.taskPopupShown;
            }
        }
    }
]);
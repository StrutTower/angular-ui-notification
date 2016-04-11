(function () {
    'use strict';

    angular
        .module('notificationTest', [
            'ui-notification'
        ]);

    angular
        .module('notificationTest')
        .controller('NotificationController', notificationController);


    notificationController.$inject = ['$scope', 'notify'];
    function notificationController($scope, notify) {
        var vm = this;
        vm.theme = {
            filename: 'bootstrap.default.min.css'
        }
        vm.primary = primary;
        vm.danger = danger;
        vm.success = success;
        vm.info = info;
        vm.warning = warning;
        vm.primaryTitle = primaryTitle;
        vm.dangerTime = dangerTime;
        vm.dangerNoTime = dangerNoTime;
        vm.successTime = successTime;
        vm.dangerHtml = dangerHtml;
        vm.successHtml = successHtml;
        vm.topLeft = topLeft;
        vm.bottomRight = bottomRight;
        vm.bottomLeft = bottomLeft;
        vm.nClick = nClick;
        vm.customTemplateScope = customTemplateScope;
        vm.changeTheme = changeTheme;

        //#region Functions
        function primary() {
            notify('Primary notification');
        };

        function danger() {
            notify.danger('Danger notification');
        };

        function success() {
            notify.success('Success notification');
        };

        function info() {
            notify.info('Information notification');
        };

        function warning() {
            notify.warning('Warning notification');
        };

        // ==

        function primaryTitle() {
            notify({ message: 'Primary notification', title: 'Primary notification' });
        };

        // ==

        function dangerTime() {
            notify.danger({ message: 'Danger notification 1s', delay: 1000 });
        };
        function dangerNoTime() {
            notify.danger({ message: 'Danger notification (no timeout)', delay: null });
        };

        function successTime() {
            notify.success({ message: 'Success notification 20s', delay: 20000 });
        };

        // ==

        function dangerHtml() {
            notify.danger({ message: '<b>Danger</b> <s>notification</s>', title: '<i>Html</i> <u>message</u>' });
        };

        function successHtml() {
            notify.success({ message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'Html content' });
        };

        // ==

        function topLeft() {
            notify.success({ message: 'Success Top Left', positionX: 'left' });
        };

        function bottomRight() {
            notify.danger({ message: 'Danger Bottom Right', positionY: 'bottom', positionX: 'right' });
        };

        function bottomLeft() {
            notify.warning({ message: 'warning Bottom Left', positionY: 'bottom', positionX: 'left' });
        };
        //#endregion
        // == 

        vm.nTitle = "Title from other scope";
        vm.nClicksLog = [];
        function nClick() {
            vm.nClicksLog.push("Clicked");
            notify.success({
                message: 'You clicked the button.',
                delay: 1000,
            })
        };
        vm.nElements = ['one', 'two', 'three'];
        function customTemplateScope() {
            notify.primary({
                message: "Just message",
                templateUrl: "custom_template.html",
                scope: $scope
            });
        };

        function changeTheme(themeFilename) {
            document.querySelector('#theme-link').href = themeFilename;
        }
    }
})();
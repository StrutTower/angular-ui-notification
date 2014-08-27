angular-ui-notification
=======================

Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animating

## Features
- No dependencies except of angular.js
- CSS3 Animations
- Small size
- 5 types of messages
- HTML messages


## Using

In you html/template
```html
...
  <link rel="stylesheet" href="angular-ui-notification.min.css">
...
  <script src="angular-ui-notification.min.js"></script>
...

```

In you application

```javascript
  angular.module('notificationTest', ['ui-notification']);
...
```

And when you need to show notification, inject service and call it!

```javascript

angular.module('notificationTest').controller('notificationController', function($scope, Notification) {
  Notification.primary('Primary notification');
  // Or simplier
  Notification('Primary notification');
  
  // Another types and options
  // Success
  Notification.success('Success notification');
  
  // With title
  Notification({message: 'Primary notification', title: 'Primary notification'});
  
  // Custom delay
  Notification.error({message: 'Error notification 1s', delay: 1000});
  
  // HTML within message
  Notification.success({message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'Html content'});

}

```
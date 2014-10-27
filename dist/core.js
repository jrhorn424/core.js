/** core.js - v0.0.2 - 2014-10-27
* Copyright (c) 2014 Mauricio Soares;
* Licensed MIT 
*/

(function(root) {
  var Core = function() {
    this.modules = {};
  };

  Core.prototype.register = function(module, constructor) {
    this.modules[module] = {
      constructor: constructor,
      instance: null
    };
  };

  Core.prototype.start = function(module) {
    var cModule = this.modules[module];

    if(!cModule) {
      this.helpers.Error('There is no module called: ' + module);
      return;
    }

    if(cModule.instance) {
      return;
    }
    // debugger;
    cModule.instance = new cModule.constructor(new Sandbox(module));

    if(cModule.instance.init) {
      cModule.instance.init();
    }
  };

  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(!cModule) {
      this.helpers.Error('There is no module called: ' + module);
      return;
    }

    if(!cModule.instance) {
      return;
    }

    if(cModule.instance.destroy) {
      cModule.instance.destroy();
    }
    cModule.instance = null;
  };

  Core.prototype.startAll = function() {
    this.xAll('start');
  };

  Core.prototype.stopAll = function() {
    this.xAll('stop');
  };

  Core.prototype.xAll = function(method) {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module)) {
        this[method](module);
      }
    }
  };

  root.Core = new Core();
} (this));

(function(Core) {
  var Error = function(message) {
    console.error(message);
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.Error = Error;
} (this.Core));

(function(root) {
  var Sandbox = function(module) {
    this.module = module;
  };

  Sandbox.notifications = {};

  Sandbox.prototype.notify = function(notification) {
    var listening = Sandbox.notifications[notification.type];
    if(listening) {
      listening.callback.call(listening.context, notification.data);
    }
  };

  Sandbox.prototype.listen = function(notification, callback, context) {
    if(!Sandbox.notifications[notification]) {
      Sandbox.notifications[notification] = {
        callback: callback,
        context: context || root
      };
    }
  };

  root.Sandbox = Sandbox;
} (this));

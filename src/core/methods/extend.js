(function(Core) {
  'use strict';

  Core.ex = {};

  var extend = function(name, implementation) {
    Core.ex[name] = implementation;
  };

} (this.Core));

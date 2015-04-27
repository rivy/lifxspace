(function(){
  'use strict';

  angular.module('lifx')
         .service('lifxService', ['$q', '$http', 'localStorageService', LIFXService]);

  function LIFXService($q, $http, localStorageService){

    var opt = {
      headers : {
          Authorization: "Basic " + btoa(localStorageService.get('token') + ":" + "")
        }
      }

    function getRandomColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    // Promise-based API
    return {
      listLights : function() {
        return $http.get('https://api.lifx.com/v1beta1/lights/all', opt).then(function(data){
          data.data.unshift({label : 'All', selected : true});
          return data.data;
        });
      },
      on : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/all/power', {state : 'on'}, opt).then(function(data){
          return data.data;
        });
      },
      off : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/all/power', {state : 'off'}, opt).then(function(data){
          return data.data;
        });
      },
      setRandomLights : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/all/color', {color : getRandomColor()}, opt).then(function(data){
          return data.data;
        });
      },
      setRGB : function(rgb) {
        var color = 'rgb:'+rgb.red+','+rgb.green+','+rgb.blue;
        return $http.put('https://api.lifx.com/v1beta1/lights/all/color', {color : color}, opt).then(function(data){
          return data.data;
        });
      },
      setHSBK : function(hsbk) {
        return $http.put('https://api.lifx.com/v1beta1/lights/all/color', {color :'hue:'+hsbk.hue+' saturation:'+hsbk.saturation+' brightness:'+hsbk.brightness}, opt).then(function(data){
          return data.data;
        });
      },
      setColorForScene : function(color) {
        return $http.put('https://api.lifx.com/v1beta1/lights/all/color', {color : color, duration : 6}, opt).then(function(data){
          return data.data;
        });
      },
      verify : function(token) {
        return $http.get('https://api.lifx.com/v1beta1/lights/all', {
          headers : {
              Authorization: "Basic " + btoa(token + ":" + token)
            }
          }).success(function(data){
              localStorageService.set('token', token);
              var opt = {
                headers : {
                    Authorization: "Basic " + btoa(localStorageService.get('token') + ":" + "")
                  }
                }
              return 200;
            }).error(function(data){
              return 500;
            });
      }     
    };
  }

})();

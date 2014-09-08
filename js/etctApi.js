/**
 * This is a JavaScript wrapper for Emotion Tuning's web services provided by their API
 *
 * Emotion Tuning API JavaScript SDK
 *
 * LICENSE: This source file is subject to version 2.0 of the Apache license
 * that is available through the world-wide-web at the following URI:
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * @package    EmotionSDK
 * @author     Jan Cerveny <cervenyjan@yahoo.co.uk>
 * @copyright  2014 CelticTuning
 * @license    http://www.apache.org/licenses/LICENSE-2.0
 * @version    Git: $Id$
 * @link       https://www.emotion-tuning.com
 */

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
  
var i_etctApi;
 
function etctApi()
{
  this.m_DD_Make = null;
  this.m_DD_Model = null;
  this.m_DD_Variant = null;
  this.m_DD_Fuel = null;
  this.m_Submit = null;
  this.m_Form = null;
  this.m_OnSubmit = null;
  this.m_OnBeforeMakeChange = null;
  this.m_OnBeforeModelChange = null;
  this.m_OnBeforeFuelChange = null;
  this.m_ShowVehicleCallback = null;
  this.m_AllLoadedCallback = null;
  this.m_Lbl = new Array('- Please select -', '- Please select above -', 'Please <a href="http://browsehappy.com/">upgrade your browser</a>.')
  this.m_DD_LastLoaded = null;
  this.m_DD_defaults = {};
  this.m_EventListenersAdded = false;
  this.m_xhr = null;
  
  this.init = function() 
  {
    var thisObj = this;
    if (!this._ltIE9())
    {
      window.addEventListener('load', function(){thisObj._init();}, false);
    } else {
      window.attachEvent('onload', function(){
        l_OldIENotSupported = document.createElement('p');
        l_OldIENotSupported.innerHTML = thisObj.m_Lbl[2];
        l_OldIENotSupported.className = 'etError';
        document.getElementById('etct_form').appendChild(l_OldIENotSupported);
      });
    }
  }
  
  this.cancelXhr = function()
  {
    if(this.m_xhr != null)
    {
      this.m_xhr.abort();
    }
  }
  
  this.exe = function(f_Config)
  {
    var thisObj = this;
    var l_Config = {
      method : null,
      dropdown: null,
      onBefore: null,
      callback: null,
      data: null
    };
    for(l_i in l_Config)
    {
      if(typeof(f_Config[l_i]) != 'undefined')
      {
        l_Config[l_i] = f_Config[l_i];
      }
    }
    
    if(l_Config.data == null)
    {
      l_Config.data = new FormData(this.m_Form);
    }
    
    var l_owner = this;
    var l_Data = l_Config.data;
    
    l_Data.append('etct_method', l_Config.method);
    
    if(l_Config.onBefore != null)
    {
      l_Config.onBefore();
    }
    
    this.m_xhr = new XMLHttpRequest();
    this.m_xhr.onreadystatechange = function() {
      if(thisObj.m_xhr.readyState != 4) return;
      if(thisObj.m_xhr.status != 200 && thisObj.m_xhr.status != 304)
      {
        thisObj.msg('Error ' + thisObj.m_xhr.status);
        return;
      }
      l_Response = JSON.parse(thisObj.m_xhr.responseText);
      if(l_Config.callback != null)
      {
        if(l_Config.callback != null){ 
          try { l_Config.callback(l_Response); } catch(e) { thisObj.msg(e); }
       }
      }
      if(l_Response.Success)
      {
        if(l_Config.dropdown != null)
        {
          try { thisObj._fillDD(l_Response, l_Config.dropdown); } catch(e) { thisObj.msg(e); }
        }
      } else if(l_Response.ErrorMessage != null) {
        l_Error = document.createElement('p');
        l_Error.innerHTML = l_Response.ErrorMessage;
        l_Error.className = 'etError';
        thisObj.m_Form.appendChild(l_Error);
      }
      thisObj.m_xhr = null;
    }
    this.m_xhr.open('POST', 'PHP/json.channel.php', true);
    this.m_xhr.send(l_Data);
  }
  
  this._init = function(f_Config)
  {
    var thisObj = this;
    var l_Config = {
      DD_Make: document.getElementById('etct_make'),
      DD_Model: document.getElementById('etct_model'),
      DD_Fuel: document.getElementById('etct_fuel'),
      DD_Variant: document.getElementById('etct_variant'),
      Submit: document.getElementById('etct_submit'),
      Form: document.getElementById('etct_form'),
      _Defaults: null
    }
    if(typeof(f_Config) != 'undefined')
    {
      for(l_Key in l_Config)
      {
        if(typeof(f_Config[l_Key]) != 'undefined')
        {
          l_Config[l_Key] = f_Config[l_Key];
        }
      }
    }
    this.m_DD_Make = l_Config.DD_Make;
    this.m_DD_Model = l_Config.DD_Model;
    this.m_DD_Fuel = l_Config.DD_Fuel;
    this.m_DD_Variant = l_Config.DD_Variant;
    this.m_Submit = l_Config.Submit;
    this.m_Form = l_Config.Form;
    
    // save default options from the url
    if(l_Config._Defaults == null)
    {
      this._parseDefaultOption(this.m_DD_Make);
      this._parseDefaultOption(this.m_DD_Model);
      this._parseDefaultOption(this.m_DD_Fuel);
      this._parseDefaultOption(this.m_DD_Variant);
    } else {
      this.m_DD_defaults = l_Config._Defaults;
    }
    
    if(!this.m_EventListenersAdded)
    {
      this.m_DD_Make.addEventListener('change', function(f_Event){thisObj._EvtDisp(f_Event);}, false);
      this.m_DD_Model.addEventListener('change', function(f_Event){thisObj._EvtDisp(f_Event);}, false);
      this.m_DD_Fuel.addEventListener('change', function(f_Event){thisObj._EvtDisp(f_Event);}, false);
      this.m_DD_Variant.addEventListener('change', function(f_Event){thisObj._EvtDisp(f_Event);}, false);
      this.m_Form.addEventListener('submit', function(f_Event){ thisObj._EvtDisp(f_Event);}, false);
      this.m_EventListenersAdded = true;
    }
    
    // initial labels
    this.m_DD_Make.childNodes[0].innerHTML = this.m_Lbl[0];
    this.m_DD_Model.childNodes[0].innerHTML = this.m_Lbl[1];
    this.m_DD_Fuel.childNodes[0].innerHTML = this.m_Lbl[1];
    this.m_DD_Variant.childNodes[0].innerHTML = this.m_Lbl[1];
    
    this.Load(this.m_DD_Make, function(){thisObj.m_DD_Model.setAttribute('disabled', 1);});
  }
  
  this.Load = function(f_Dropdown)
  {
    var thisObj = this;
    this.m_Submit.setAttribute('disabled', 1);
    this.exe({
      method : f_Dropdown.getAttribute('data-method'), 
      dropdown:f_Dropdown, 
      onBefore: function(){ f_Dropdown.setAttribute('disabled', true);}, 
      callback: function(f_Response){ 
        f_Dropdown.removeAttribute('disabled'); 
        thisObj.m_DD_LastLoaded = f_Dropdown;
      } 
    });
  }
  
  this.ShowVehicle = function(f_Event)
  {
    var l_Caller = this;
    this.exe({
      method : 'vehicle',  
      onBefore: function(){l_Caller.m_Submit.setAttribute('disabled', true);}, 
      callback: function(f_Response){
        l_Caller.m_Submit.removeAttribute('disabled'); 
        if(l_Caller.m_ShowVehicleCallback != null)
        {
          try{ l_Caller.m_ShowVehicleCallback(f_Response); } catch(e) {l_Caller.msg(e);}
        }
      }
    });
    if(typeof(f_Event) != 'undefined')
    {
      f_Event.preventDefault();
    }
  }
  
  this.OnMakeChange = function()
  {
    var thisObj = this;
    if(this.m_DD_Make.selectedIndex != 0)
    {
      if(this.m_OnBeforeMakeChange != null)
      {
        try{ this.m_OnBeforeMakeChange(); } catch(e) {this.msg(e);}
      }
      this.Load(this.m_DD_Model);
    } else {
      this.m_DD_Model.selectedIndex = 0;
      this.m_DD_Model.setAttribute('disabled', 1);
    }
    this.m_DD_Fuel.selectedIndex = 0;
    this.m_DD_Fuel.setAttribute('disabled', 1);
    this.m_DD_Variant.selectedIndex = 0;
    this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnModelChange = function()
  {
    var thisObj = this;
    if(this.m_DD_Model.selectedIndex != 0)
    {
      if(this.m_OnBeforeModelChange != null)
      {
        try{ this.m_OnBeforeModelChange(); } catch(e) {this.msg(e);}
      }
      this.Load(this.m_DD_Fuel);
    } else {
      this.m_DD_Fuel.selectedIndex = 0;
      this.m_DD_Fuel.setAttribute('disabled', 1);
    }
    this.m_DD_Variant.selectedIndex = 0;
    this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnFuelChange = function()
  {
    if(this.m_DD_Fuel.selectedIndex != 0)
    {
      if(this.m_OnBeforeFuelChange != null)
      {
        try{ this.m_OnBeforeFuelChange(); } catch(e) {this.msg(e);}
      }
      this.Load(this.m_DD_Variant);
    } else {
      this.m_DD_Variant.selectedIndex = 0;
      this.m_DD_Variant.setAttribute('disabled', 1);
    }
  }
  
  this.OnVariantChange = function()
  {
    if(this.m_DD_Variant.childNodes[this.m_DD_Variant.selectedIndex].value != '-1')
    {
      this.m_Submit.removeAttribute('disabled');
      if(this.m_AllLoadedCallback != null)
      {
        try{ this.m_AllLoadedCallback(); } catch(e) {this.msg(e);}
      }
    } else {
       this.m_Submit.setAttribute('disabled', 1);
    }
  }
  
  this._EvtDisp = function(f_Event)
  {
    if(f_Event.target == this.m_DD_Make)
    {
      this.OnMakeChange(f_Event);
    }
    if(f_Event.target == this.m_DD_Model)
    {
      this.OnModelChange(f_Event);
    }
    if(f_Event.target == this.m_DD_Fuel)
    {
      this.OnFuelChange(f_Event);
    }
    if(f_Event.target == this.m_DD_Variant)
    {
      this.OnVariantChange(f_Event);
    }
    if(f_Event.target == this.m_Form)
    {
      if(this.m_OnSubmit == null)
      {
        this.ShowVehicle(f_Event);
      } else {
        this.m_OnSubmit(f_Event);
      }
    }
  }
  
  this.msg = function(f_Msg)
  {
    console.log('ET', f_Msg);
  }
  
  this._fillDD = function(f_Response, f_Dropdown)
  {
    var l_Option = null;
    while (f_Dropdown.firstChild)
    {
      f_Dropdown.removeChild(f_Dropdown.firstChild);
    }
    for(l_i in f_Response.Items)
    {
      l_Option = document.createElement('option');
      l_Option.value = f_Response.Items[l_i].Value;
      l_Option.innerHTML = f_Response.Items[l_i].Text;
      f_Dropdown.appendChild(l_Option);
    }
    this._preselectOption(f_Dropdown);
  }
  
  this._ltIE9 = function()
  {
    l_test = /msie.[0-9]\./.test(window.navigator.userAgent.toLowerCase());
    return typeof(l_test) != 'undefined' ? l_test : false;
  }
  
  this._preselectOption = function(f_Dropdown)
  {
    var l_DefaultValue = this.m_DD_defaults[f_Dropdown.getAttribute('name')];
    if(typeof(l_DefaultValue) != 'undefined')
    {
      for(l_i in f_Dropdown.childNodes)
      {
        if(f_Dropdown.childNodes[l_i].value == l_DefaultValue)
        {
          f_Dropdown.childNodes[l_i].setAttribute('selected', true);
          break;
        }
      }
      setTimeout(function(){
        var event = new CustomEvent('change', { bubbles: true } );
        f_Dropdown.dispatchEvent(event);
      }, 100);
    }
    delete this.m_DD_defaults[f_Dropdown.getAttribute('name')];
  }
  
  this._parseDefaultOption = function(f_Dropdown)
  {
    if(window.location.href.indexOf(f_Dropdown.getAttribute('name')) != -1)
    {
      var l_params = window.location.search.substr(1).split('&');
      for(l_i in l_params)
      {
        var l_pair = l_params[l_i].split('=');
        if(l_pair[0] == f_Dropdown.getAttribute('name'))
        {
          this.m_DD_defaults[f_Dropdown.getAttribute('name')] = l_pair[1];
          break;
        }
      }
    }
  }
}
 
i_etctApi = new etctApi;
i_etctApi.init();
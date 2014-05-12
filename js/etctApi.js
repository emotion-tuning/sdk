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
  this.m_ShowVehicleCallback = null;
  this.m_Lbl = new Array('- Please select -', '- Please select above -', 'Please <a href="http://browsehappy.com/">upgrade your browser</a>.')
  this.m_DD_LastLoaded = null;
  this.m_DD_defaults = {};
  
  this.init = function() 
  {
    if (!this._ltIE9())
    {
      window.addEventListener('load', this._OnDocLoad, false);
    } else {
      window.attachEvent('onload', function(){
        l_OldIENotSupported = document.createElement('p');
        l_OldIENotSupported.innerHTML = i_etctApi.m_Lbl[2];
        l_OldIENotSupported.className = 'etError';
        document.getElementById('etct_form').appendChild(l_OldIENotSupported);
      });
    }
  }
  
  this.exe = function(f_Config)
  {
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
    var l_xhr = null;
    var l_owner = this;
    var l_Data = l_Config.data;
    
    l_Data.append('etct_method', l_Config.method);
    
    if(l_Config.onBefore != null)
    {
      l_Config.onBefore();
    }
    
    l_xhr = new XMLHttpRequest();
    l_xhr.onreadystatechange = function() {
      if(l_xhr.readyState != 4) return;
      if(l_xhr.status != 200 && l_xhr.status != 304)
      {
        i_etctApi.msg('Error ' + l_xhr.status);
        return;
      }
      l_Response = JSON.parse(l_xhr.responseText);
      if(l_Config.callback != null)
      {
        try { l_Config.callback(l_Response); } catch(e) { i_etctApi.msg(e); }
      }
      if(l_Response.Success)
      {
        if(l_Config.dropdown != null)
        {
          try { i_etctApi._fillDD(l_Response, l_Config.dropdown); } catch(e) { i_etctApi.msg(e); }
        }
      } else if(l_Response.ErrorMessage != null) {
        l_Error = document.createElement('p');
        l_Error.innerHTML = l_Response.ErrorMessage;
        l_Error.className = 'etError';
        i_etctApi.m_Form.appendChild(l_Error);
      }
    }
    l_xhr.open('POST', 'PHP/json.channel.php', true);
    l_xhr.send(l_Data);
  }
  
  this._OnDocLoad = function(f_Event)
  {
    i_etctApi._init();
  }
  
  this._init = function()
  {
    this.m_DD_Make = document.getElementById('etct_make');
    this.m_DD_Model = document.getElementById('etct_model');
    this.m_DD_Fuel = document.getElementById('etct_fuel');
    this.m_DD_Variant = document.getElementById('etct_variant');
    this.m_Submit = document.getElementById('etct_submit');
    this.m_Form = document.getElementById('etct_form');
    
    this.m_DD_Make.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Model.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Fuel.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Variant.addEventListener('change', this._EvtDisp, false);
    this.m_Form.addEventListener('submit', this._EvtDisp, false);
    
	// save default options from the url
	this._parseDefaultOption(this.m_DD_Make);
	this._parseDefaultOption(this.m_DD_Model);
	this._parseDefaultOption(this.m_DD_Fuel);
	this._parseDefaultOption(this.m_DD_Variant);
	
    // initial labels
    this.m_DD_Make.childNodes[0].innerHTML = this.m_Lbl[0];
    this.m_DD_Model.childNodes[0].innerHTML = this.m_Lbl[1];
    this.m_DD_Fuel.childNodes[0].innerHTML = this.m_Lbl[1];
    this.m_DD_Variant.childNodes[0].innerHTML = this.m_Lbl[1];
    
    this.Load(this.m_DD_Make);
  }
  
  this.Load = function(f_Dropdown)
  {
    this.m_Submit.setAttribute('disabled', 1);
    this.exe({
      method : f_Dropdown.getAttribute('data-method'), 
      dropdown:f_Dropdown, 
      onBefore: function(){ f_Dropdown.setAttribute('disabled', true);}, 
      callback: function(){ 
	    f_Dropdown.removeAttribute('disabled'); 
		i_etctApi.m_DD_LastLoaded = f_Dropdown;
	    var l_event = new CustomEvent('etct_method_loaded', { bubbles: true } );
        window.dispatchEvent(l_event);
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
		l_Caller.m_ShowVehicleCallback(f_Response);
	  }
    });
    f_Event.preventDefault();
  }
  
  this.OnMakeChange = function()
  {
    this.Load(this.m_DD_Model);
    this.m_DD_Fuel.selectedIndex = 0;
    this.m_DD_Fuel.setAttribute('disabled', 1);
    this.m_DD_Variant.selectedIndex = 0;
    this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnModelChange = function()
  {
    this.Load(this.m_DD_Fuel);
    this.m_DD_Variant.selectedIndex = 0;
    this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnFuelChange = function()
  {
    this.Load(this.m_DD_Variant);
  }
  
  this.OnVariantChange = function()
  {
    if(this.m_DD_Variant.childNodes[this.m_DD_Variant.selectedIndex].value != '-1')
    {
      this.m_Submit.removeAttribute('disabled');
    } else {
      this.m_Submit.setAttribute('disabled', 1);
    }
  }
  
  this._EvtDisp = function(f_Event)
  {
    if(f_Event.target == i_etctApi.m_DD_Make)
    {
      i_etctApi.OnMakeChange(f_Event);
    }
    if(f_Event.target == i_etctApi.m_DD_Model)
    {
      i_etctApi.OnModelChange(f_Event);
    }
    if(f_Event.target == i_etctApi.m_DD_Fuel)
    {
      i_etctApi.OnFuelChange(f_Event);
    }
    if(f_Event.target == i_etctApi.m_DD_Variant)
    {
      i_etctApi.OnVariantChange(f_Event);
    }
    if(f_Event.target == i_etctApi.m_Form)
    {
      i_etctApi.ShowVehicle(f_Event);
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
    l_test = /msie.[0-9]/.test(window.navigator.userAgent.toLowerCase());
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
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
  
var i_emotionApi;
 
function emotionApi()
{
  this.m_DD_Make = null;
  this.m_DD_Model = null;
  this.m_DD_Variant = null;
  this.m_DD_Fuel = null;
  this.m_Lbl = new Array('- Please select -', '- Please select above -')
  
  this.init = function() 
  {
    if (document.getElementById('etObsolete') == null)
    {
      window.addEventListener('load', this._OnDocLoad, false);
    }
  }
  
  this.exe = function(f_Method, f_Callback, f_Dropdown, f_Data)
  {
    var l_xhr = null;
    var l_owner = this;
    var l_Data = {et_method:null};
    
    if(typeof(f_Data) != 'undefined')
    {
      l_Data = f_Data;
    }
    l_Data.et_method = f_Method;
     
    f_Dropdown.setAttribute('disabled', true);
    l_xhr = new XMLHttpRequest();
    l_xhr.onreadystatechange = function() {
      if(l_xhr.readyState != 4) return;
      if(l_xhr.status != 200 && l_xhr.status != 304)
      {
        l_owner.msg('Error ' + l_xhr.status);
        return;
      }
	  l_Response = JSON.parse(l_xhr.responseText);
	  if(l_Response.Success)
	  {
        f_Callback(l_Response, f_Dropdown);
        f_Dropdown.removeAttribute('disabled');
	  } else {
		l_Error = document.createElement('p');
	    l_Error.innerHTML = l_Response.ErrorMessage;
	    l_Error.className = 'etError';
		f_Dropdown.parentNode.appendChild(l_Error);
	  }
    }
    l_xhr.open('POST', 'PHP/json.channel.php', true);
    l_xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    l_xhr.send(this._stringify(l_Data));
  }
  
  this._OnDocLoad = function(f_Event)
  {
    i_emotionApi._init();
  }
  
  this._init = function()
  {
    this.m_DD_Make = document.getElementById('et_make');
    this.m_DD_Model = document.getElementById('et_model');
    this.m_DD_Fuel = document.getElementById('et_fuel');
    this.m_DD_Variant = document.getElementById('et_variant');
    
    this.m_DD_Make.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Model.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Fuel.addEventListener('change', this._EvtDisp, false);
    this.m_DD_Variant.addEventListener('change', this._EvtDisp, false);
    
	this.m_DD_Make.childNodes[0].innerHTML = this.m_Lbl[0];
	this.m_DD_Model.childNodes[0].innerHTML = this.m_Lbl[1];
	this.m_DD_Fuel.childNodes[0].innerHTML = this.m_Lbl[1];
	this.m_DD_Variant.childNodes[0].innerHTML = this.m_Lbl[1];
	
    this.LoadMakes();
  }
  
  this._stringify = function(f_Object)
  {
    var l_Params = '';
    for(key in f_Object)
    {
      l_Params += key + '=' + f_Object[key] + '&';
    }
    return l_Params.substr(0, l_Params.length - 1);
  }
  
  this.LoadMakes = function()
  {
    this.exe('make', this._fillDD, this.m_DD_Make);
  }
  
  this.LoadModels = function()
  {
    this.exe('model', this._fillDD, this.m_DD_Model, {makeId: this.m_DD_Make.options[this.m_DD_Make.selectedIndex].value});
  }
  
  this.LoadFuels = function()
  {
    this.exe('fuel', this._fillDD, this.m_DD_Fuel, {modelId: this.m_DD_Model.options[this.m_DD_Model.selectedIndex].value});
  }
  
  this.LoadVariants = function()
  {
    this.exe('variant', this._fillDD, this.m_DD_Variant, {modelId: this.m_DD_Model.options[this.m_DD_Model.selectedIndex].value, fuelId: this.m_DD_Fuel.options[this.m_DD_Fuel.selectedIndex].value});
  }
  
  this.LoadOrderForm = function()
  {
    this.msg('Not implemented');
  }
  
  this.OnMakeChange = function()
  {
    this.LoadModels();
	this.m_DD_Fuel.selectedIndex = 0;
	this.m_DD_Fuel.setAttribute('disabled', 1);
	this.m_DD_Variant.selectedIndex = 0;
	this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnModelChange = function()
  {
    this.LoadFuels();
	this.m_DD_Variant.selectedIndex = 0;
	this.m_DD_Variant.setAttribute('disabled', 1);
  }
  
  this.OnFuelChange = function()
  {
    this.LoadVariants();
  }
  
  this.OnVariantChange = function()
  {
    this.LoadOrderForm();
  }
  
  this._EvtDisp = function(f_Event)
  {
      if(f_Event.srcElement == i_emotionApi.m_DD_Make)
      {
          i_emotionApi.OnMakeChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_DD_Model)
      {
          i_emotionApi.OnModelChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_DD_Fuel)
      {
          i_emotionApi.OnFuelChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_DD_Variant)
      {
          i_emotionApi.OnVariantChange(f_Event);
      }
  }
  
  this.msg = function(f_Msg)
  {
    if(typeof(console.log) != 'undefined')
    {
      console.log('ET', f_Msg);
    }
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
  }
}
 
i_emotionApi = new emotionApi;
i_emotionApi.init();
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
  this.m_LastMethod = null;
  this.m_MakeDropdown = null;
  this.m_ModelDropdown = null;
  this.m_VariantDropdown = null;
  this.m_FuelDropdown = null;
  
  this.attachAfterLoad = function() 
  {
    var proceed = true;
    if(document.getElementById('etWidget_obsoleteBrowser') != null && document.getElementById('etWidget_obsoleteBrowser').value == '1')
    {
      proceed = false;
    }
    if (proceed)
    {
      window.addEventListener('load', this._OnDocumentLoad, false);
    }
  }
  
  this.execute = function(f_Method, f_Callback, f_Dropdown, f_Data)
  {
    var l_xhr = null;
    var thisObj = this;
    var l_Data = {et_method:null};
    
    if(typeof(f_Method) != 'undefined')
    {
      this.m_LastMethod = f_Method;
    }
    if(this.m_LastMethod != null)
    {
      if(typeof(f_Data) != 'undefined')
      {
        l_Data = f_Data;
      }
      l_Data.et_method = this.m_LastMethod;
      
      f_Dropdown.setAttribute('disabled', true);
      l_xhr = new XMLHttpRequest();
      l_xhr.onreadystatechange = function() {
        if(l_xhr.readyState != 4) return;
        if(l_xhr.status != 200 && l_xhr.status != 304)
        {
          thisObj.msg('Unexpected server reply (' + l_xhr.status + ')');
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
      l_xhr.open('POST', 'PHP/json.tunnel.php', true);
      l_xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      l_xhr.send(this._stringify(l_Data));
    } else {
      this.msg('No method to execute has been specified!');
    }
  }
  
  this._OnDocumentLoad = function(f_Event)
  {
    i_emotionApi._init();
  }
  
  this._init = function()
  {
    this.m_MakeDropdown = document.getElementById('etWidget_make');
    this.m_ModelDropdown = document.getElementById('etWidget_model');
    this.m_FuelDropdown = document.getElementById('etWidget_fuel');
    this.m_VariantDropdown = document.getElementById('etWidget_variant');
    
    this.m_MakeDropdown.addEventListener('change', this._EventDispatcher, false);
    this.m_ModelDropdown.addEventListener('change', this._EventDispatcher, false);
    this.m_FuelDropdown.addEventListener('change', this._EventDispatcher, false);
    this.m_VariantDropdown.addEventListener('change', this._EventDispatcher, false);
    
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
    this.execute('make', this._populateDropdown, this.m_MakeDropdown);
  }
  
  this.LoadModels = function()
  {
    this.execute('model', this._populateDropdown, this.m_ModelDropdown, {makeId: this.m_MakeDropdown.options[this.m_MakeDropdown.selectedIndex].value});
  }
  
  this.LoadFuels = function()
  {
    this.execute('fuel', this._populateDropdown, this.m_FuelDropdown, {modelId: this.m_ModelDropdown.options[this.m_ModelDropdown.selectedIndex].value});
  }
  
  this.LoadVariants = function()
  {
    this.execute('variant', this._populateDropdown, this.m_VariantDropdown, {modelId: this.m_ModelDropdown.options[this.m_ModelDropdown.selectedIndex].value, fuelId: this.m_FuelDropdown.options[this.m_FuelDropdown.selectedIndex].value});
  }
  
  this.LoadOrderForm = function()
  {
    this.msg('Not implemented');
  }
  
  this.OnMakeChange = function(f_Event)
  {
    this.LoadModels();
  }
  
  this.OnModelChange = function()
  {
    this.LoadFuels();
  }
  
  this.OnFuelChange = function()
  {
    this.LoadVariants();
  }
  
  this.OnVariantChange = function()
  {
    this.LoadOrderForm();
  }
  
  this._EventDispatcher = function(f_Event)
  {
      if(f_Event.srcElement == i_emotionApi.m_MakeDropdown)
      {
          i_emotionApi.OnMakeChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_ModelDropdown)
      {
          i_emotionApi.OnModelChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_FuelDropdown)
      {
          i_emotionApi.OnFuelChange(f_Event);
      }
      if(f_Event.srcElement == i_emotionApi.m_VariantDropdown)
      {
          i_emotionApi.OnVariantChange(f_Event);
      }
  }
  
  this.msg = function(f_Msg)
  {
    if(typeof(console.log) != 'undefined')
    {
      console.log('Emotion Tuning Widget', f_Msg);
    } else {
      f_Msg = 'Emotion Tuning Widget:' + f_Msg;
      alert(f_Msg);
    }
  }
  
  this._removeChildren = function(f_Element)
  {
  }
  
  this._populateDropdown = function(f_Response, f_Dropdown)
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
i_emotionApi.attachAfterLoad();
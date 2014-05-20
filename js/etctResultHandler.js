var i_emotionResponseHandler = null;
var i_sr_etctApi = null;

function emotionResponseHandler()
{
  this.m_lastCar = null;
  this.m_originalPlaceholderImage = '';
  this.m_DarkArea = null;
  
  this.init = function()
  {
    this.m_originalPlaceholderImage = document.getElementById('etct_VehicleModelImageUrl').getAttribute('src');
    var l_Inputs = document.getElementById('etct_rq_form').getElementsByTagName('input');
    for(l_i in l_Inputs)
    {
      if(typeof(l_Inputs[l_i]) == 'object')
      {
        l_Inputs[l_i].addEventListener('change', i_emotionResponseHandler.dismissErrors, false);
      }
    }
    
    this.m_DarkArea = document.createElement('div');
    this.m_DarkArea.className = 'etDarkArea';
    this.m_DarkArea.style.display = 'none';
    this.m_DarkArea.style.height = window.innerHeight;
    document.getElementsByTagName('body')[0].appendChild(this.m_DarkArea);
    
    document.getElementById('etct_close_request').addEventListener('click', this.closeDialog, false);
    document.getElementById('etct_close_result').addEventListener('click', this.closeDialog, false);
    document.getElementById('etct_showRequestQuote').addEventListener('click', function(){
      document.getElementById('etct_result').style.display = 'none';
      document.getElementById('etct_requestQuote').style.display = 'block';
    }, false);
  }
  
  this.closeDialog = function(){
    i_sr_etctApi.cancelXhr();
    document.getElementById('etct_result').style.display = 'none';
    document.getElementById('etct_requestQuote').style.display = 'none';
    i_emotionResponseHandler.m_DarkArea.style.display = 'none';
  }
  
  this.autoload = function(f_Event)
  {
    if(i_etctApi.m_DD_LastLoaded == i_etctApi.m_DD_Variant)
    {
      setTimeout(function(){
        i_etctApi.ShowVehicle(f_Event);
        window.removeEventListener('etct_method_loaded', i_emotionResponseHandler.autoload);
      }, 100);
    }
  }
  
  this.removeStagesAndVariants = function()
  {
    var l_AS = document.getElementById('etct_AvailableStages');
    if(l_AS != null)
    {
      while (l_AS.firstChild)
      {
        l_AS.removeChild(l_AS.firstChild);
      }
    }
    document.getElementById('etct_DpfRemovalAvailable').setAttribute('disabled', true);
    document.getElementById('etct_EgrRemovalAvailable').setAttribute('disabled', true);
    document.getElementById('etct_VMaxRemovalAvailable').setAttribute('disabled', true);
    document.getElementById('etct_RevLimiterRemovalAvailable').setAttribute('disabled', true);
    document.getElementById('etct_LaunchControlAvailable').setAttribute('disabled', true);
  }
  
  this.dismissErrors = function()
  {
    try {
      var l_Error = document.querySelector('.etError');
      if(l_Error != null)
      {
        l_Error.parentNode.removeChild(l_Error);
      }
    } catch(e) {
      console.log(e);
    }
  }
  
  this.submitRequestForm = function(f_Event)
  {
    i_emotionResponseHandler.dismissErrors();
    var l_Data = new FormData(document.getElementById('etct_rq_form'));
    i_etctApi.exe({
      method: 'request', 
      data: l_Data, 
      onBefore: function(){document.getElementById('etct_requestSubmit').setAttribute('disabled', true);},
      callback: function(f_Response){
        document.getElementById('etct_requestSubmit').removeAttribute('disabled');
        var l_Msg = document.createElement('p');
        if(f_Response.Successful)
        {
          document.getElementById('etct_rq_form').style.display = 'none';
          l_Msg.innerHTML = 'Request sent - we will reply as soon as possible. Thank you!';
          l_Msg.className = 'etNotice';
        } else {
          if(typeof(f_Response.ErrorMessage) != 'undefined')
          {
            l_Msg.innerHTML = f_Response.ErrorMessage;
          }
          if(typeof(f_Response.ValidationErrors) != 'undefined')
          {
            l_Msg.innerHTML = f_Response.ValidationErrors.join('<br>');
          }
          l_Msg.className = 'etError';
        }
        document.getElementById('etct_requestQuote').appendChild(l_Msg);
      }
    });
    f_Event.stopPropagation();
    f_Event.preventDefault();
  }
  
  this.fillVehicleProperties = function()
  {
    var thisObj = this;
    var l_churlLink = null;
    var l_vurlLink = null;
    document.getElementById('etct_VehicleModelImageUrl').setAttribute('src', this.m_originalPlaceholderImage);
    var l_AS = document.getElementById('etct_AvailableStages');
	document.getElementById('etct_carCompleteString').value = this.m_lastCar['MakeName'] + ', ' + this.m_lastCar['ModelName'] + ', ' + this.m_lastCar['Fuel'] + ', ' + this.m_lastCar['VariantName'];
	try{
	  var l_previousNotice = document.querySelector('.etNotice')[0];
      l_previousNotice.parentNode.removeChild(l_previousNotice);
	} catch(e) {}
    if(l_AS != null)
    {
      while (l_AS.firstChild)
      {
        l_AS.removeChild(l_AS.firstChild);
      }
    }

    var l_TS = document.getElementById('etct_TuningStages');
    if(l_TS != null)
    {
      while (l_TS.firstChild)
      {
        l_TS.removeChild(l_TS.firstChild);
      }
    }
    var l_TSTab = document.getElementById('etct_stageTabs');
    if(l_TSTab != null)
    {
      while (l_TSTab.firstChild)
      {
        l_TSTab.removeChild(l_TSTab.firstChild);
      }
    }
    
    // set stats display
    document.getElementById('etct_DpfRemovalAvailable_Display').className = 'etSprite ' + (this.m_lastCar['DpfRemovalAvailable'] ? 'etAvailable' : 'etUnavailable');
    document.getElementById('etct_EgrRemovalAvailable_Display').className = 'etSprite ' + (this.m_lastCar['EgrRemovalAvailable'] ? 'etAvailable' : 'etUnavailable');
    document.getElementById('etct_RevLimiterRemovalAvailable_Display').className = 'etSprite ' + (this.m_lastCar['RevLimiterRemovalAvailable'] ? 'etAvailable' : 'etUnavailable');
    document.getElementById('etct_VMaxRemovalAvailable_Display').className = 'etSprite ' + (this.m_lastCar['VMaxRemovalAvailable'] ? 'etAvailable' : 'etUnavailable');
    document.getElementById('etct_LaunchControlAvailable_Display').className = 'etSprite ' + (this.m_lastCar['LaunchControlAvailable'] ? 'etAvailable' : 'etUnavailable');
    
    for(key in this.m_lastCar)
    {
      var l_Placeholder = document.getElementById('etct_' + key);
      if(l_Placeholder != null)
      {
        if(typeof(this.m_lastCar[key]) == 'string' || typeof(this.m_lastCar[key]) == 'number')
        {
          // handle regular values
          if(key == 'VehicleModelImageUrl')
          {
            // vehicle image requires special handling
            if(this.m_lastCar[key] != null && this.m_lastCar[key] != '')
            {
              l_Placeholder.setAttribute('src', this.m_lastCar[key]);
            }
          } else {
            try {
			  var l_val = this.m_lastCar[key];
			  if(key == 'StandardPower')
			  {
			    l_val += ' ' + this.m_lastCar['StandardPowerUnit'];
			  }
			  if(key == 'StandardTorque')
			  {
				l_val += ' ' + this.m_lastCar['StandardTorqueUnit'];
			  }
              l_Placeholder.innerHTML = l_val;
            } catch(e) {
              console.warn('Could not fill this element: ' + key);
            }
          }
        } else if(typeof(this.m_lastCar[key]) == 'boolean') {
          // handle booleans
          if(l_Placeholder.getAttribute('type') == 'checkbox')
          {
            // if placeholder assigned to this id is a checkbox, set it's state according to the value
            if(this.m_lastCar[key])
            {
              l_Placeholder.removeAttribute('disabled');
            } else {
              l_Placeholder.setAttribute('disabled', true);
            }
          }
        } else if(typeof(this.m_lastCar[key]) == 'object') {
          // handle multi-value objects
          if(key == 'TuningStages')
          {
            // Handle Tuning stages
            for(l_i in this.m_lastCar[key])
            {
              l_churlLink = null;
              l_vurlLink = null;
              var l_stageTemplate = document.getElementById('etct_template_stage').cloneNode(true);
              l_stageTemplate.removeAttribute('id');
              
              for(l_ts_key in this.m_lastCar[key][l_i])
              {
                if(l_ts_key == 'TuningStageId')
                {
                  var l_AvailableStage_Chb = document.createElement('input');
                  var l_AvailableStage_Label = document.createElement('label');
                  var l_AvailableStage = document.createElement('div');
                  l_AvailableStage_Chb.name = 'TuningStageId';
                  l_AvailableStage_Chb.type = 'radio';
                  l_AvailableStage_Chb.value = this.m_lastCar[key][l_i][l_ts_key];
				  l_AvailableStage_Chb.setAttribute('data-title', this.m_lastCar[key][l_i]['TuningStageTitle']);
				  l_AvailableStage_Chb.addEventListener('change', function(f_Event){
					document.getElementById('etct_stageName').value = f_Event.target.getAttribute('data-title');
				  }, false);
                  if(this.m_lastCar[key][l_i]['DefaultStage'])
                  {
					document.getElementById('etct_stageName').value = this.m_lastCar[key][l_i]['TuningStageTitle'];
                    l_AvailableStage_Chb.setAttribute('checked', 'checked');
                  }
                  l_AvailableStage_Label.innerHTML = this.m_lastCar[key][l_i]['TuningStageTitle'];
                  l_AvailableStage_Label.className = 'etInline';
                  l_AvailableStage.appendChild(l_AvailableStage_Chb);
                  l_AvailableStage.appendChild(l_AvailableStage_Label);
                  document.getElementById('etct_AvailableStages').appendChild(l_AvailableStage);
                } else {
                  // set the value to a placeholder, if such placeholder is found  
                  var l_ts_placeholder = l_stageTemplate.querySelector('.etct_' + l_ts_key);
                  if(l_ts_placeholder != null)
                  {
					var l_val = this.m_lastCar[key][l_i][l_ts_key];
                    if(l_ts_key == 'ModifiedPower' || l_ts_key == 'StandardPower')
                    {
					  l_val += ' ' + this.m_lastCar[key][l_i]['ModifiedPowerUnit'];
					}
                    if(l_ts_key == 'ModifiedTorque' || l_ts_key == 'StandardTorque')
                    {
					  l_val += ' ' + this.m_lastCar[key][l_i]['ModifiedTorqueUnit'];
					}
                    l_ts_placeholder.innerHTML = l_val;
                  }
                }
                
                
                // count the gains in power / torque
                if(l_ts_key == 'ModifiedPower')
                {
                  l_stageTemplate.querySelector('.etct_PowerGain').innerHTML = (this.m_lastCar[key][l_i][l_ts_key] - this.m_lastCar['StandardPower']) + ' ' + this.m_lastCar[key][l_i]['ModifiedPowerUnit'];
                }
                if(l_ts_key == 'ModifiedTorque')
                {
                  l_stageTemplate.querySelector('.etct_TorqueGain').innerHTML = (this.m_lastCar[key][l_i][l_ts_key] - this.m_lastCar['StandardTorque']) + ' ' + this.m_lastCar[key][l_i]['ModifiedTorqueUnit'];
                }
              } 
                // add video and chart buttons
                var l_vurl = this.m_lastCar[key][l_i]['VideoUrl'];
				if(typeof(l_vurl) != 'undefined' && l_vurl != '' && l_vurl != null && l_vurl.indexOf('embed') == -1)
				{
				  if(l_vurl.indexOf('watch') != -1)
				  {
					var l_VideoToken = l_vurl.split('watch?v=')[1].split('&')[0];
					l_vurl = 'http://www.youtube.com/embed/' + l_VideoToken;
				  } else if(l_vurl.indexOf('youtu.be') != -1) {
					var l_VideoToken = l_vurl.split('.be/')[1].split('?')[0];
					l_vurl = 'http://www.youtube.com/embed/' + l_VideoToken;
				  } else {
					l_vurl = null;
				  }
				}
                if(typeof(l_vurl) != 'undefined' && l_vurl != '' && l_vurl != null)
                {
                  l_vurlLink = document.createElement('a');
                  l_vurlLink.setAttribute('href', l_vurl);
                  l_vurlLink.innerHTML = '&nbsp;&nbsp;<span class="etSprite etVideo"></span> Video';
                  l_vurlLink.addEventListener('click', function(f_Event){
                    var l_url = f_Event.target.getAttribute('href');
                    document.getElementById('etct_result').style.display = 'none';
                    var l_generalLightbox = document.createElement('div');
                    l_generalLightbox.className = 'etLightbox';
                    var l_close = document.createElement('a');
                    l_close.className = 'etRight etClose';
                    l_close.innerHTML = '&times;'
                    l_close.addEventListener('click', function(f_Event){
                      try{
                        var l_node = f_Event.target.parentNode;
                        l_node.parentNode.removeChild(l_node);
                      } catch(e) { console.log('removing the lightbox has failed!'); }
                      document.getElementById('etct_result').style.display = 'block';
                      f_Event.preventDefault();
                    }, false);
                    l_generalLightbox.appendChild(l_close);
                    var l_Clearfix = document.createElement('div');
                    l_generalLightbox.appendChild(l_Clearfix);
					try{
                      var l_YTPlayer = document.createElement('iframe');
                      l_YTPlayer.setAttribute('width', '100%');
                      l_YTPlayer.setAttribute('height', '500');
                      l_YTPlayer.setAttribute('frameborder', '0');
                      l_YTPlayer.setAttribute('allowfullscreen', 'true');
                      l_YTPlayer.setAttribute('src', l_vurl);
                      l_generalLightbox.appendChild(l_YTPlayer);
					} catch(e) { console.log('could not add YT iframe ' + e); }
                    document.getElementsByTagName('body')[0].appendChild(l_generalLightbox);
                    f_Event.preventDefault();
                  }, false);
                }
                
                var l_churl = this.m_lastCar[key][l_i]['DynoChartUrl'];
                if(typeof(l_churl) != 'undefined' && l_churl != '' && l_churl != null)
                {
                  l_churlLink = document.createElement('a');
                  l_churlLink.setAttribute('href', l_churl);
                  l_churlLink.innerHTML = '<span class="etSprite etChart"></span> Chart';
                  l_churlLink.addEventListener('click', function(f_Event){
                    var l_url = f_Event.target.getAttribute('href');
                    document.getElementById('etct_result').style.display = 'none';
                    var l_generalLightbox = document.createElement('div');
                    l_generalLightbox.className = 'etLightbox';
                    var l_close = document.createElement('a');
                    l_close.className = 'etRight etClose';
                    l_close.innerHTML = '&times;'
                    l_close.addEventListener('click', function(f_Event){
                      try{
                        var l_node = f_Event.target.parentNode;
                        l_node.parentNode.removeChild(l_node);
                      } catch(e) { console.log('removing the lightbox has failed!'); }
                      document.getElementById('etct_result').style.display = 'block';
                      f_Event.preventDefault();
                    }, false);
                    l_generalLightbox.appendChild(l_close);
                    var l_Clearfix = document.createElement('div');
                    l_generalLightbox.appendChild(l_Clearfix);
                    var l_Img = document.createElement('img');
                    l_Img.setAttribute('width', '100%');
                    l_Img.setAttribute('height', 'auto');
                    l_Img.setAttribute('src', l_url);
                    l_generalLightbox.appendChild(l_Img);
                    document.getElementsByTagName('body')[0].appendChild(l_generalLightbox);
                    f_Event.preventDefault();
                  }, false)
                }
                
              if(l_churlLink != null || l_vurlLink != null)
              {
                var l_footer = document.createElement('tfoot');
                var l_row = document.createElement('tr');
                var l_td = document.createElement('td');
                l_td.setAttribute('colspan', 4);
                if(l_churlLink != null)
                {
                  l_td.appendChild(l_churlLink);
                }
                if(l_vurlLink != null)
                {
                  l_td.appendChild(l_vurlLink);
                }
                l_row.appendChild(l_td);
                l_footer.appendChild(l_row);
                l_stageTemplate.querySelector('table').appendChild(l_footer);
              }
              document.getElementById('etct_TuningStages').appendChild(l_stageTemplate);
              
              var l_stageTabLink = document.createElement('a');
              l_stageTabLink.innerHTML = this.m_lastCar[key][l_i]['TuningStageTitle'];
              l_stageTabLink.setAttribute('href', '#');
              var l_stageTab = document.createElement('li');
              l_stageTab.appendChild(l_stageTabLink);
              // pre-select the default stage
              if(typeof(this.m_lastCar[key][l_i]['DefaultStage']) != 'undefined' && this.m_lastCar[key][l_i]['DefaultStage'] == true)
              {
                l_stageTab.className = 'on';
                l_stageTemplate.style.display = 'block';
              }
              l_stageTabLink.addEventListener('click', function(f_Event){
                var l_currentIndex = 0;
                for(l_i in f_Event.target.parentNode.parentNode.childNodes)
                {
                  if(f_Event.target.parentNode.parentNode.childNodes[l_i] == f_Event.target.parentNode)
                  {
                    break;
                  }
                  l_currentIndex++;
                }
                
                var l_tabs = document.getElementById('etct_stageTabs').childNodes;
                for(l_i in l_tabs)
                {
                  l_tabs[l_i].className = '';
                }
                f_Event.target.parentNode.className = 'on';
                
                
                var l_stageDetails1 = document.getElementById('etct_TuningStages').childNodes;
                for(l_i1 in l_stageDetails1)
                {
                  if(typeof(l_stageDetails1[l_i1]) == 'object')
                  {
                    l_stageDetails1[l_i1].style.display = 'none';
                  }
                }
                if(document.getElementById('etct_TuningStages').childNodes[l_currentIndex] != null)
                {
                  document.getElementById('etct_TuningStages').childNodes[l_currentIndex].style.display = 'block';
                }
                f_Event.preventDefault();
              });
              document.getElementById('etct_stageTabs').appendChild(l_stageTab);
            }
          }
        }
      }
    }
    document.getElementById('etct_result').style.display = 'block';
    
    // prepare and show the request form
    l_toYear = new Date().getFullYear();
    if(this.m_lastCar['VariantToYear'] != null)
    {
      l_toYear = parseInt(this.m_lastCar['VariantToYear']);
    }
    // clear any previously populated data
    if(document.getElementById('etct_vehicleYear') != null)
    {
      while (document.getElementById('etct_vehicleYear').firstChild)
      {
        document.getElementById('etct_vehicleYear').removeChild(document.getElementById('etct_vehicleYear').firstChild);
      }
    }
    
    for(l_year = this.m_lastCar['VariantFromYear']; l_year < l_toYear; l_year++)
    {
      var l_yearOpt = document.createElement('option');
      l_yearOpt.setAttribute('value', l_year);
      l_yearOpt.innerHTML = l_year;
      document.getElementById('etct_vehicleYear').appendChild(l_yearOpt);
    }
    document.getElementById('etct_rq_form').style.display = 'block';
    
    // show dark area
    this.m_DarkArea.style.display = 'block';
  }
}

i_emotionResponseHandler = new emotionResponseHandler;
if(typeof(i_etctApi) != 'undefined')
{
  if(!i_etctApi._ltIE9())
  {
    window.addEventListener('load', function(){
      var l_DD_defaults = null;
      i_sr_etctApi = new etctApi;
      i_emotionResponseHandler.init();
        
      // if we have a container to fill the results with, proceed     
      if(document.getElementById('etct_result') != null)
      {
        // when a car selection in the main form is changed, update the submit request form's defaults to reflect that
        i_etctApi.m_ShowVehicleCallback = function(f_Response){
          l_DD_defaults = {
            makeId: document.getElementById('etct_make').childNodes[document.getElementById('etct_make').selectedIndex].value,
            modelId: document.getElementById('etct_model').childNodes[document.getElementById('etct_model').selectedIndex].value,
            fuelId: document.getElementById('etct_fuel').childNodes[document.getElementById('etct_fuel').selectedIndex].value,
            variantId: document.getElementById('etct_variant').childNodes[document.getElementById('etct_variant').selectedIndex].value
          }
          // trigger the dialog & prefill it with last known data
          i_emotionResponseHandler.m_lastCar = f_Response;
          i_emotionResponseHandler.fillVehicleProperties();
          
          
          // initialize the submit request selector which is hidden on default
          // we can skip the usual init and access the inside init directly, because we know that the document has been loaded
          i_sr_etctApi._init({
            DD_Make: document.getElementById('etct_sr_make'),
            DD_Model: document.getElementById('etct_sr_model'),
            DD_Fuel: document.getElementById('etct_sr_fuel'),
            DD_Variant: document.getElementById('etct_sr_variant'),
            Submit: document.getElementById('etct_requestSubmit'),
            Form: document.getElementById('etct_rq_form'),
            _Defaults: l_DD_defaults
          }); 
          
          // remove all variants and disable all options when the submit request's form car is changed
          i_sr_etctApi.m_OnBeforeMakeChange = i_emotionResponseHandler.removeStagesAndVariants;
          i_sr_etctApi.m_OnBeforeModelChange = i_emotionResponseHandler.removeStagesAndVariants;
          i_sr_etctApi.m_OnBeforeFuelChange = i_emotionResponseHandler.removeStagesAndVariants;
          i_sr_etctApi.m_OnSubmit = i_emotionResponseHandler.submitRequestForm;
      
          i_sr_etctApi.m_ShowVehicleCallback = function(f_Response){
            i_emotionResponseHandler.m_lastCar = f_Response;
            i_emotionResponseHandler.fillVehicleProperties();
          }
          
          i_sr_etctApi.m_AllLoadedCallback = function() {
            i_sr_etctApi.ShowVehicle();
          }
        }
        
        if(window.location.pathname.indexOf('/detail.htm') != -1)
        {
            window.addEventListener('etct_method_loaded', i_emotionResponseHandler.autoload);
        }
      } else {
        i_etctApi.m_ShowVehicleCallback = function(f_Response){
          window.location.href = 'detail.htm?' + 
          i_etctApi.m_DD_Make.getAttribute('name') + '=' + i_etctApi.m_DD_Make.childNodes[i_etctApi.m_DD_Make.selectedIndex].value + '&' +
          i_etctApi.m_DD_Model.getAttribute('name') + '=' + i_etctApi.m_DD_Model.childNodes[i_etctApi.m_DD_Model.selectedIndex].value + '&' +
          i_etctApi.m_DD_Variant.getAttribute('name') + '=' + i_etctApi.m_DD_Variant.childNodes[i_etctApi.m_DD_Variant.selectedIndex].value + '&' +
          i_etctApi.m_DD_Fuel.getAttribute('name') + '=' + i_etctApi.m_DD_Fuel.childNodes[i_etctApi.m_DD_Fuel.selectedIndex].value +
          '#etct_result';
        }
      }
    }, false);
  }
}
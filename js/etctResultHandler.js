var i_emotionResponseHandler = null;

function emotionResponseHandler()
{
  this.m_lastCar = null;
  this.m_originalPlaceholderImage = '';
  
  this.init = function()
  {
    this.m_originalPlaceholderImage = document.getElementById('etct_VehicleModelImageUrl').getAttribute('src');
    document.getElementById('etct_rq_form').addEventListener('submit', i_emotionResponseHandler.submitRequestForm, false);
    var l_Inputs = document.getElementById('etct_rq_form').getElementsByTagName('input');
    for(l_i in l_Inputs)
    {
      if(typeof(l_Inputs[l_i]) == 'object')
      {
        l_Inputs[l_i].addEventListener('change', i_emotionResponseHandler.dismissErrors, false);
      }
    }
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
    l_Data.append('variantId', i_etctApi.m_DD_Variant.childNodes[i_etctApi.m_DD_Variant.selectedIndex].value);
    l_Data.append('tuningStageId', document.querySelector('input[name="TuningStageId"]:checked').value);
    l_Data.append('dpfRemoval', document.getElementById('etct_DpfRemovalAvailable').checked);
    l_Data.append('vmaxRemoval', document.getElementById('etct_VMaxRemovalAvailable').checked);
    l_Data.append('egrRemoval', document.getElementById('etct_EgrRemovalAvailable').checked);
    l_Data.append('revLimiterRemoval', document.getElementById('etct_RevLimiterRemovalAvailable').checked);
    l_Data.append('launchControl', document.getElementById('etct_LaunchControlAvailable').checked);

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
          l_Msg.innerHTML = f_Response.ValidationErrors.join('<br>');
          l_Msg.className = 'etError';
        }
        document.getElementById('etct_requestQuote').appendChild(l_Msg);
      }
    });
    f_Event.preventDefault();
  }
  
  this.fillVehicleProperties = function()
  {
    document.getElementById('etct_VehicleModelImageUrl').setAttribute('src', this.m_originalPlaceholderImage);
    var l_TS = document.getElementById('etct_TuningStages');
    while (l_TS.firstChild)
    {
      l_TS.removeChild(l_TS.firstChild);
    }
    
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
              l_Placeholder.innerHTML = this.m_lastCar[key];
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
              var l_stageTemplate = document.getElementById('etct_template_stage').cloneNode(true);
              l_stageTemplate.removeAttribute('id');
              l_stageTemplate.style.display = 'block';
              for(l_ts_key in this.m_lastCar[key][l_i])
              {
                if(l_ts_key == 'TuningStageId')
                {
                  l_stageTemplate.querySelector('.etct_TuningStageId').value = this.m_lastCar[key][l_i][l_ts_key];  
                } else {
                  // set the value to a placeholder, if such placeholder is found  
                  var l_ts_placeholder = l_stageTemplate.querySelector('.etct_' + l_ts_key);
                  if(l_ts_placeholder != null)
                  {
                    l_ts_placeholder.innerHTML = this.m_lastCar[key][l_i][l_ts_key];
                  }
                }
                
                // pre-select the default stage
                if(typeof(this.m_lastCar[key][l_i][l_ts_key]) == 'boolean')
                {
                  if(l_ts_key == 'DefaultStage' && this.m_lastCar[key][l_i][l_ts_key])
                  {
                    l_stageTemplate.querySelector('.etct_StageSelector').setAttribute('checked', true);  
                  }
                }
                
                // count the gains in power / torque
                if(l_ts_key == 'ModifiedPower')
                {
                  l_stageTemplate.querySelector('.etct_PowerGain').innerHTML = this.m_lastCar[key][l_i][l_ts_key] - this.m_lastCar['StandardPower'];
                }
                if(l_ts_key == 'ModifiedTorque')
                {
                  l_stageTemplate.querySelector('.etct_TorqueGain').innerHTML = this.m_lastCar[key][l_i][l_ts_key] - this.m_lastCar['StandardTorque'];
                }
              }
              document.getElementById('etct_TuningStages').appendChild(l_stageTemplate);
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
    while (document.getElementById('etct_vehicleYear').firstChild)
    {
      document.getElementById('etct_vehicleYear').removeChild(document.getElementById('etct_vehicleYear').firstChild);
    }
    for(l_year = this.m_lastCar['VariantFromYear']; l_year < l_toYear; l_year++)
    {
      var l_yearOpt = document.createElement('option');
      l_yearOpt.setAttribute('value', l_year);
      l_yearOpt.innerHTML = l_year;
      document.getElementById('etct_vehicleYear').appendChild(l_yearOpt);
    }
    document.getElementById('etct_requestQuote').style.display = 'block';
    document.getElementById('etct_rq_form').style.display = 'block';
  }
}

i_emotionResponseHandler = new emotionResponseHandler;
if(typeof(i_etctApi) != 'undefined')
{
  if(!i_etctApi._ltIE9())
  {
    window.addEventListener('load', function(){i_emotionResponseHandler.init();}, false);
    i_etctApi.m_ShowVehicleCallback = function(f_Response){
      i_emotionResponseHandler.m_lastCar = f_Response;
      i_emotionResponseHandler.fillVehicleProperties();
    }
  }
}
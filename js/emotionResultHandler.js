function emotionResponseHandler()
{
  this.m_originalPlaceholderImage = '';
  
  this.init = function()
  {
	 this.m_originalPlaceholderImage = document.getElementById('et_VehicleModelImageUrl').getAttribute('src');
  }
  
  this.fillVehicleProperties = function(f_VehicleObject)
  {
	document.getElementById('et_VehicleModelImageUrl').setAttribute('src', this.m_originalPlaceholderImage);
	var l_TS = document.getElementById('et_TuningStages');
    while (l_TS.firstChild)
    {
      l_TS.removeChild(l_TS.firstChild);
    }
	
    for(key in f_VehicleObject)
    {
	  var l_Placeholder = document.getElementById('et_' + key);
	  if(l_Placeholder != null)
	  {
	    if(typeof(f_VehicleObject[key]) == 'string' || typeof(f_VehicleObject[key]) == 'number')
	    {
		  // handle regular values
		  if(key == 'VehicleModelImageUrl')
		  {
			// vehicle image requires special handling
			if(f_VehicleObject[key] != null && f_VehicleObject[key] != '')
			{
		      l_Placeholder.setAttribute('src', f_VehicleObject[key]);
			}
		  } else {
			try {
	          l_Placeholder.innerHTML = f_VehicleObject[key];
			} catch(e) {
			  console.warn('Could not fill this element: ' + key);
			}
		  }
	    } else if(typeof(f_VehicleObject[key]) == 'boolean') {
		  // handle booleans
		  if(l_Placeholder.getAttribute('type') == 'checkbox')
		  {
			// if placeholder assigned to this id is a checkbox, set it's state according to the value
		    if(f_VehicleObject[key])
		    {
		  	  l_Placeholder.removeAttribute('disabled');
		    } else {
  			  l_Placeholder.setAttribute('disabled', true);
  		    }
		  }
	    } else if(typeof(f_VehicleObject[key]) == 'object') {
		  // handle multi-value objects
		  if(key == 'TuningStages')
		  {
			// Handle Tuning stages
			for(l_i in f_VehicleObject[key])
			{
			  var l_stageTemplate = document.getElementById('et_template_stage').cloneNode(true);
			  l_stageTemplate.removeAttribute('id');
			  l_stageTemplate.style.display = 'block';
			  for(l_ts_key in f_VehicleObject[key][l_i])
			  {
				// set the value to a placeholder, if such placeholder is found  
				var l_ts_placeholder = l_stageTemplate.querySelector('.et_' + l_ts_key);
				if(l_ts_placeholder != null)
				{
				  l_ts_placeholder.innerHTML = f_VehicleObject[key][l_i][l_ts_key];
				}
				
				// pre-select the default stage
				if(typeof(f_VehicleObject[key][l_i][l_ts_key]) == 'boolean')
				{
				  if(l_ts_key == 'DefaultStage' && f_VehicleObject[key][l_i][l_ts_key])
				  {
					l_stageTemplate.querySelector('.et_StageSelector').setAttribute('checked', true);  
				  }
				}
				
				// count the gains in power / torque
				if(l_ts_key == 'ModifiedPower')
				{
				  l_stageTemplate.querySelector('.et_PowerGain').innerHTML = f_VehicleObject[key][l_i][l_ts_key] - f_VehicleObject['StandardPower'];
				}
				if(l_ts_key == 'ModifiedTorque')
				{
				  l_stageTemplate.querySelector('.et_TorqueGain').innerHTML = f_VehicleObject[key][l_i][l_ts_key] - f_VehicleObject['StandardTorque'];
				}
			  }
			  document.getElementById('et_TuningStages').appendChild(l_stageTemplate);
			}
		  }
		}
	  }
    }
	
    document.getElementById('et_result').style.display = 'block';
  }
}

var i_emotionResponseHandler = new emotionResponseHandler;
if(typeof(i_emotionApi) != 'undefined')
{
  if(!i_emotionApi._ltIE9())
  {
	window.addEventListener('load', function(){i_emotionResponseHandler.init();}, false);
    i_emotionApi.m_ShowVehicleCallback = function(f_Response){
	  i_emotionResponseHandler.fillVehicleProperties(f_Response);
    }
  }
}
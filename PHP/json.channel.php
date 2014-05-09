<?php
  define('EMOTION_API_ENDPOINT', 'http://celtictuningapi.co.uk');
  define('EMOTION_API_KEY', 'INSERT_EMOTION_API_KEY_HERE');
  
  if(isset($_REQUEST['et_method']))
  {
    require_once('classes/emotionApi.php');
    $i_emotionApi = new emotionApi;
    header('Content-Type: application/json');
    
    // only work with allowed methods
    $l_Method = NULL;
    switch($_REQUEST['et_method']):
      case 'make':
        $l_Method = '/VehicleLookup/GetMakes';
      break;
      case 'fuel':
        $l_Method = '/VehicleLookup/GetFuels';
      break;
      case 'model':
        $l_Method = '/VehicleLookup/GetModels';
      break;
      case 'variant':
        $l_Method = '/VehicleLookup/GetVariants';
      break;
      case 'vehicle':
        $l_Method = '/VehicleLookup/GetVehicle';
      break;
    endswitch;
    
    // only pass allowed data
    $l_Data = array();
    foreach($_REQUEST as $key=>$value)
    {
      if($key == 'makeId' || $key == 'fuelId' || $key == 'modelId' || $key == 'variantId')
      {
		if(trim($value) != '' && $value != -1)
		{
          $l_Data[$key] = emotionEpiHelpers::sanitize($value);
		}
      }
    }
    if(empty($l_Data))
    {
      $l_Data = NULL;
    }
    
    if(!is_null($l_Method))
    {
	  $l_ResponseObject = $i_emotionApi->execute($l_Method, $l_Data);
	  // this resolves eMotion/Celtic tuning API's compatibility
	  if(!isset($l_ResponseObject->ErrorMessage) && !isset($l_ResponseObject->Success))
	  {  
	    if(is_array($l_ResponseObject))
	    {
	      $l_ResponseObject = (object)array('Items' => $l_ResponseObject);
	    }
	    $l_ResponseObject->Success = true;
	  }
      echo json_encode($l_ResponseObject);
	  if(isset($l_ResponseObject->ErrorMessage))
	  {
	    error_log(var_export($_REQUEST, true)."\r\n", 3, 'log.log');
	  }
	  unset($l_ResponseObject, $l_Data, $l_Method);
    } else {
      echo json_encode(array('ErrorMessage' => 'Invalid method supplied'));
    }
  } else {
    echo json_encode(array('ErrorMessage' => 'Required parameters not provided'));
  }
?>
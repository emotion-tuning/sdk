<?php
  define('ETCT_API_ENDPOINT', 'http://celtictuningapi.co.uk');
  define('ETCT_API_KEY', 'INSERT_API_KEY_HERE');
  define('DEALER_EMAIL', NULL);
  
  if(isset($_REQUEST['etct_method']))
  {
    require_once('classes/etctApi.php');
    $i_etctApi = new etctApi;
    header('Content-Type: application/json');
    
    // only work with allowed methods
    $l_Method = NULL;
    switch($_REQUEST['etct_method']):
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
      case 'request':
        $l_Method = '/VehicleLookup/SubmitWebQuoteRequest';
      break;
    endswitch;
    
    // only pass allowed data
    $l_Data = array();
    foreach($_REQUEST as $key=>$value)
    {
      if($key != 'etct_method')
      {
        if(trim($value) != '' && $value != -1)
        {
          $l_Data[$key] = etctApiHelpers::sanitize($value, true);
        }
      }
    }
    if(empty($l_Data))
    {
      $l_Data = NULL;
    }
    
    if(!is_null($l_Method))
    {
      if($_REQUEST['etct_method'] == 'request' && !is_null(DEALER_EMAIL))
      {
        require_once('_sendRequestToDealer.php');
      } else {
        $l_ResponseObject = $i_etctApi->execute($l_Method, $l_Data);
        // this resolves eMotion/Celtic tuning API's compatibility
        if(!isset($l_ResponseObject->ErrorMessage) && !isset($l_ResponseObject->Success))
        {  
          if(is_array($l_ResponseObject))
          {
            $l_ResponseObject = (object)array('Items' => $l_ResponseObject);
          }
          if(!isset($l_ResponseObject->Successful))
          {
            $l_ResponseObject->Success = true;
          }
        }
        echo json_encode($l_ResponseObject);
        if(isset($l_ResponseObject->ErrorMessage) || isset($l_ResponseObject->ValidationErrors))
        {
          error_log(var_export($_REQUEST, true)."\r\n", 3, 'log.log');
        }
        unset($l_ResponseObject, $l_Data, $l_Method);
      }
    } else {
      echo json_encode(array('ErrorMessage' => 'Invalid method supplied'));
    }
  } else {
    echo json_encode(array('ErrorMessage' => 'Required parameters not provided'));
  }
?>
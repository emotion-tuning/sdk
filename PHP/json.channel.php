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
        $l_Method = '/Module/GetEmotionMakes';
      break;
      case 'model':
        $l_Method = '/Module/GetEmotionModels';
      break;
      case 'fuel':
        $l_Method = '/Module/GetEmotionFuels';
      break;
      case 'variant':
        $l_Method = '/Module/GetEmotionVariants';
      break;
      case 'vehicle':
        $l_Method = '/Module/GetVehicle';
      break;
    endswitch;
    
    // only pass allowed data
    $l_Data = array();
    foreach($_REQUEST as $key=>$value)
    {
      if($key == 'makeId' || $key == 'fuelId' || $key == 'modelId' || $key == 'variantId')
      {
        $l_Data[$key] = emotionEpiHelpers::sanitize($value);
      }
    }
    if(empty($l_Data))
    {
      $l_Data = NULL;
    }
    
    if(!is_null($l_Method))
    {
      echo json_encode($i_emotionApi->execute($l_Method, $l_Data));
    } else {
      echo json_encode(array('ErrorMessage' => 'Invalid method supplied'));
    }
  } else {
    echo json_encode(array('ErrorMessage' => 'Required parameters not provided'));
  }
?>
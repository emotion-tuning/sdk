<?
/**
 * This is a PHP wrapper for Emotion Tuning's web services provided by their API
 *
 * Emotion Tuning API PHP SDK
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

  class etctApi
  {
    private $m_endpoint;
    private $m_apiKey;
    private $m_lastMethod;
      
    public function __construct($f_endpoint = ETCT_API_ENDPOINT, $f_apiKey = ETCT_API_KEY)
    {
      $this->checkDependencies();
      $this->m_endpoint = $f_endpoint;
      $this->m_apiKey = $f_apiKey;
    }

    public function execute($f_method, $f_data = array())
    { 
      if(!isset($this->m_lastMethod) && !isset($f_method))
      {
        die('Emotion API Handler: No action specified!');
      }
      $l_prependData = array('ApiKey' => $this->m_apiKey);
          
      if(isset($f_data) && is_array($f_data) && !empty($f_data))
      {
        $f_data = array_merge($l_prependData, $f_data);
      } else {
        $f_data = &$l_prependData;
      }
          
      unset($l_prependData);      
      $this->m_lastMethod = $f_method;
      $l_response = $this->curl_post(json_encode(array_merge($f_data)));
      return !is_null(json_decode($l_response)) ? json_decode($l_response) : (object)array('ErrorMessage' => 'Server did not reply with a valid JSON response.', 'raw' => htmlentities($l_response));
    }
      
    private function curl_post($f_jsonData)
    {
      $l_ch = curl_init($this->m_endpoint . $this->m_lastMethod);
      curl_setopt($l_ch, CURLOPT_CUSTOMREQUEST, 'POST');
      curl_setopt($l_ch, CURLOPT_POSTFIELDS, $f_jsonData);
      curl_setopt($l_ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($l_ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($f_jsonData))
      );
      error_log("\r\n".$this->m_endpoint . $this->m_lastMethod . '?'.http_build_query(json_decode($f_jsonData)), 3, 'log.log');

      if(!$l_result = curl_exec($l_ch))
      {
        die('Curl error: ' . curl_error($l_ch));
      }
      
      curl_close($l_ch);
      unset($l_ch);
      return $l_result;
    }
    
    private function checkDependencies()
    {
      if(!function_exists('json_decode') || !function_exists('json_encode') || !function_exists('curl_init'))
      {
        die('Emotion Tuning API PHP SDK error: required PHP modules not enabled!');
      }
    }
  }
  
  class etctApiHelpers
  {
    public static function sanitize($f_Input, $f_Email = false)
    {
      $l_output = '';
      $l_allowedCharacters = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.');
      if($f_Email)
      {
        array_push($l_allowedCharacters, '@');
      }
      for($l_i = 0, $l_max = strlen($f_Input); $l_i < $l_max; $l_i++)
      {
        if(in_array(strtolower(substr($f_Input, $l_i, 1)), $l_allowedCharacters))
        {
          $l_output .= substr($f_Input, $l_i, 1);
        }
      }
      unset($l_allowedCharacters);
        
      return $l_output;
    }
  }
?>
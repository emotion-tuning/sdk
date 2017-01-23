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
      $l_response = CTCommon::curlPost($this->m_endpoint . $this->m_lastMethod, json_encode(array_merge($f_data)));
      return !is_null(json_decode($l_response)) ? json_decode($l_response) : (object)array('ErrorMessage' => 'Server did not reply with a valid JSON response.', 'raw' => htmlentities($l_response));
    }
    
    private function checkDependencies()
    {
      if(!function_exists('json_decode') || !function_exists('json_encode') || !function_exists('curl_init'))
      {
        die('Emotion Tuning API PHP SDK error: required PHP modules not enabled!');
      }
    }
  }
?>
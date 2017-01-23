<?php
  class CTCommon {
    /**
     * Sanitize strings
     *
     * @param string $f_Input String to sanitize
     * @return string The cleaned, safe string
     */
    public static function sanitize($f_Input)
    {
      $l_output = '';
      $l_allowedCharacters = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '@');
      for($l_i = 0, $l_max = strlen($f_Input); $l_i < $l_max; $l_i++)
      {
        if(in_array(strtolower(substr($f_Input, $l_i, 1)), $l_allowedCharacters))
        {
          $l_output .= substr($f_Input, $l_i, 1);
        } else {
          $this::logIt( 'Sanitization found an incompatible character; ' . substr($f_Input, $l_i, 1), __FILE__, __LINE__ );
        }
      }
      unset($l_allowedCharacters, $l_i, $l_max);
      return $l_output;
    }
    
    /**
     * POST data to an url
     *
     * @param string $f_URL URL to submit the post request to
     * @param string $f_JSONData JSON encoded data
     * @return array Pure, unprocessed server response
     */
    public static function curlPost($f_URL, $f_JSONData = null)
    {
      $l_CH = curl_init($f_URL);
      curl_setopt($l_CH, CURLOPT_CUSTOMREQUEST, 'POST');
      curl_setopt($l_CH, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($l_CH, CURLOPT_FOLLOWLOCATION, true);
      curl_setopt($l_CH, CURLOPT_TIMEOUT, 10);
      curl_setopt($l_CH, CURLOPT_CONNECTTIMEOUT, 5);
      if(!is_null($f_JSONData))
      {
        curl_setopt($l_CH, CURLOPT_POSTFIELDS, $f_JSONData);
        curl_setopt($l_CH, CURLOPT_HTTPHEADER, array(
          'Content-Type: application/json',
          'Content-Length: ' . strlen($f_JSONData))
        );
      }
      try{
        $l_Result = curl_exec($l_CH);  //xy max execution time of 60 secs exceeded - see hwo to handle it
      } catch(Exception $e) {
        throw new Exception( 'API CURL Exception; ' . $e->getMessage());
        $l_Result = false;
      }
      if(!isset($l_Result) || (isset($l_Result) && is_bool($l_Result)))
      {
        throw new Exception( 'API CURL Problem; ' . curl_error($l_CH));
        $l_Result = false;
      }
      curl_close($l_CH);
      unset($l_CH);
      return $l_Result;
    }
  }
?>
<?php
  define('EMOTION_API_ENDPOINT', 'http://celtictuningapi.co.uk');
  define('EMOTION_API_KEY', 'INSERT_EMOTION_API_KEY_HERE');
  
  require_once('classes/emotionApi.php');
  
  // create an instance of the Emotion Tuning API
  $i_emotionApi = new emotionApi;
  
  // Fetch example data
  // NOTE: To see the complete list of available methods, please contact us
  $etApiResponse = $i_emotionApi->execute('/Module/GetEmotionModels', array(
     'makeId' => 'a33fc266-a887-49c7-abfd-3fa37c8d6565'
  ));
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Emotion Tuning PHP API example</title>
  </head>
  <body>
    <pre>
      <?php
        print_r($etApiResponse);
      ?>
    </pre>
  </body>
</html>
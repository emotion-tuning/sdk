<?php
  $canMail = false;
  try {
    $canMail = function_exists('mail');
  } catch(Exception $e) {
    $l_Response['ErrorMessage'] = $e->getMessage();
  }
  if($canMail)
  {
    $l_to = DEALER_EMAIL;
    $l_subject = 'Quote request';
    $l_sender = 'robot@'.$_SERVER['SERVER_NAME'];
    $l_headers = "From: " . $l_sender . "\r\n";
    $l_headers .= "Reply-To: ". $_REQUEST['email'] . "\r\n";
    $l_headers .= "MIME-Version: 1.0\r\n";
    $l_headers .= "X-Mailer: PHP". phpversion() ."\r\n";
    $l_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    ob_start();
    ?>
<html>
  <body>
    <style>body{ font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; }</style>
    <h1>
      New quote request received
    </h1>
    <table>
      <tr>
        <td>
          <b>Car</b>
        </td>
        <td>
          <? echo $_REQUEST['carCompleteString']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Stage</b>
        </td>
        <td>
          <? echo $_REQUEST['stageName']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Vehicle year</b>
        </td>
        <td>
          <? echo $_REQUEST['vehicleYear']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Options</b>
        </td>
        <td>
          <? 
            echo $_REQUEST['dpfRemoval'] ? 'DPF Removal<br>' : ''; 
            echo $_REQUEST['egrRemoval'] ? 'EGR Removal<br>' : ''; 
            echo $_REQUEST['vmaxRemoval'] ? 'Vmax Removal<br>' : ''; 
            echo $_REQUEST['revLimiterRemoval'] ? 'Rev limiter Removal<br>' : ''; 
            echo $_REQUEST['launchControl'] ? 'Launch control<br>' : ''; 
          ?>
        </td>
      </tr>
    </table>
    <hr>
    <table>
      <tr>
        <td>
          <b>Name</b>
        </td>
        <td>
          <? echo $_REQUEST['customerName']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>E-mail</b>
        </td>
        <td>
          <? echo $_REQUEST['email']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Telephone</b>
        </td>
        <td>
          <? echo $_REQUEST['telephone']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Address</b>
        </td>
        <td>
          <? echo $_REQUEST['address']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Town/city</b>
        </td>
        <td>
          <? echo $_REQUEST['townCity']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Country/State</b>
        </td>
        <td>
          <? echo $_REQUEST['countryState']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>ZIP</b>
        </td>
        <td>
          <? echo $_REQUEST['postCode']; ?>
        </td>
      </tr>
      <tr>
        <td>
          <b>Additional comments</b>
        </td>
        <td>
          <? echo $_REQUEST['additionalComments']; ?>
        </td>
      </tr>
    </table>
  </body>
</html>
    <?php
    $l_message = ob_get_contents();
    ob_end_clean();
    
    if(mail($l_to, $l_subject, $l_message, $l_headers))
    {
      $l_Response['Successful'] = true;
    } else {
      $l_Response['ErrorMessage'] = 'Mail sending failed!';
    }
  }
  echo json_encode((object)$l_Response);
?>
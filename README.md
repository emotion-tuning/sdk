Emotion Tuning SDK
==================
The general SDK for Emotion tuning's car search API. 
> Requires a valid API key - to obtain one, please contact us through our [website](https://www.emotion-tuning.com)
- minified JavaScript for minimal loading time
- requires latest _PHP_
- supports all _modern_ browsers + IE9 and newer

## DEMO
[Click here to open a demo](https://www.emotion-tuning.com/SDK/index.htm)

### How to use
- Check requirements. Does your server support _PHP_? 
  > If not, you need to have a "proxy" script (that mimicks **PHP/json.tunnel.php**) developed in your server's technology and update that script's url in **js/emotionApi.min.js**.
   
1. ## **index.htm**
   1. Open this file in any code editor
   2. Copy lines between

      ```HTML
      <!-- emotion widget start -->
      ```
   
      and
   
      ```HTML
      <!-- emotion widget end -->
      ```
   
   3. Paste it to the desired place in your HTML
   4. Copy lines between

      ```HTML
      <!-- emotion dependencies start -->
      ```
   
      and
   
      ```HTML
      <!-- emotion dependencies end -->
      ```
   
   5. Paste them in your HTML just before the closing the **&lt;/head&gt;** tag.

2. ## PHP/json.tunnel.php
   1. Locate your API key. If you don't have any, please contact us through our website.
   2. Open the file in any code editor
   3. Replace 
      > INSERT_EMOTION_API_KEY_HERE
   
      with an actual key and save the file
   
3. ## Update your site
   1. Upload all files - the changed original site files _and_ the new SDK files - to your PHP server
   2. Check your site in any browser
   3. Share the update with your clients! :-)
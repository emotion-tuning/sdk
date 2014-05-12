Celtic Tuning / Emotion Tuning SDK
==================================
The general SDK for Celtic/Emotion tuning's car search API. 
> Requires a valid API key - to obtain one, please contact us through our [website](https://www.emotion-tuning.com)

- requires latest _PHP_
- supports all _modern_ browsers + IE9 and newer
- old versions of Internet Explorer (older than IE8, included) **ARE NOT SUPPORTED**

## DEMO
- [**Demo 1 - simple widget, results on a new page**](https://www.emotion-tuning.com/SDK/index.htm)
- [Demo 2 - simple widget, results on the same page](https://www.emotion-tuning.com/SDK/index-one-page.htm)
- [Demo 3 - no styling, results on a new page](https://www.emotion-tuning.com/SDK/index-simple.htm)
- [Demo 4 - no styling, results on the same page](https://www.emotion-tuning.com/SDK/index-simple-one-page.htm)

### How to use
- Check requirements. Does your server support _PHP_? 
  > If not, you need to have a "proxy" script (that mimicks **PHP/json.channel.php**) developed in your server's technology and update that script's url in **js/emotionApi.min.js**.
   
1. #### **index.htm** (= Demo 1)
   1. Open this file in any code editor
   2. Copy lines between

      ```HTML
      <!-- emotion widget start -->
      ```
   
      and
   
      ```HTML
      <!-- emotion widget end -->
      ```
   
   3. Paste it to the desired place in your HTML - be it a WordPress template, HTML template or any other file that generates HTML on your server.
   4. Copy lines between

      ```HTML
      <!-- emotion dependencies start -->
      ```
   
      and
   
      ```HTML
      <!-- emotion dependencies end -->
      ```
   
   5. Paste them in your HTML just before the closing **&lt;/head&gt;** tag.

2. #### PHP/json.channel.php
   1. Locate your API key. If you don't have any, please contact us through our website.
   2. Open the file in any code editor
   3. Replace 
      > INSERT_API_KEY_HERE
   
      with an actual key and save the file
   
3. #### Update your site
   1. Upload all files - the changed original site files _and_ the new SDK files - to your PHP server
   2. Check your site in any browser
   3. Share the update with your clients! :-)
   
### Appendix

#### How to send the request to your e-mail address
1. Go to **PHP/json.channel.php** and change 
   ```PHP
   define('DEALER_EMAIL', NULL);
   ```
   
   so you will place your e-mail within single quotes in place of *NULL*, example:
   ```PHP
   define('DEALER_EMAIL', 'test@test.com');
   ```
   
2. Save & upload your file.

#### Customization
- You can insert your own logo by replacing *_assets/img/logo.png* with an image of your own
- You can remove the whole black header by removing everything between and including *&lt;header&gt;* and *&lt;/header&gt;*
- You can change the color scheme in *_assets/css/etct-style.css*
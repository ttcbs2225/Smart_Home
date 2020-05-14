var ws = new WebSocket("ws://13.209.35.11:8001");

var bri;
var tem;

console.log(bri)

  var colorWell;
  var defaultColor = "#ffffff";
  const PHILIPS_HUE_MAX_VALUE = 65535
  const PHILIPS_SATURATION_MAX_VALUE = 254
  const PHILIPS_BRIGHTNESS_MAX_VALUE = 254
  function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
  function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
  function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
  function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }
  function rgbToHsv(r, g, b) {
    r = r / 255
    g = g / 255
    b = b / 255

    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, v = max

    let d = max - min
    s = max == 0 ? 0 : d / max

    if (max == min) {
      h = 0          // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g: h = (b - r) / d + 2
          break
        case b: h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
  }

  window.addEventListener("load", startup, false);
  function startup() {
    colorWell = document.querySelector("#colorWell2");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
  }

  
  function updateFirst(event) {
    color = event.target.value;
    R = hexToR(color);
    G = hexToG(color);
    B = hexToB(color);
    hsvColor = rgbToHsv(R, G, B)
    hue = Math.round(hsvColor[0] * (PHILIPS_HUE_MAX_VALUE / 360))
    saturation = Math.round(hsvColor[1] * (PHILIPS_SATURATION_MAX_VALUE / 100))
    brightness = Math.round(hsvColor[2] * (PHILIPS_BRIGHTNESS_MAX_VALUE / 100))


    var br;

    if (controller == false) {
      br = "color2" + "," + hue.toString() + "," + saturation.toString();
      document.getElementById("light_icon2").style.color = colorWell.value;
    }

    ws.send(br);
  }


  ws.onmessage = function (event) {

    console.log(event.data);
    var msg = event.data.split(",");
    console.log(msg);

    bri = parseInt(msg[1]);
    var temp = bri / 254 * 100;
    bri = Math.round(temp).toString() + "%";

    tem = parseInt(msg[5]);
    temp = tem / 500 * 100;
    tem = Math.round(temp).toString() + "%";
    console.log("temperature");
    console.log(tem);

    // document.getElementById("on_off").innerHTML = msg[0];
    document.getElementById("bri2").innerHTML = bri;
        
    // document.getElementById("hue").innerHTML = msg[2];
    // document.getElementById("sat").innerHTML = msg[3];
    document.getElementById("name2").innerHTML = msg[4];
    document.getElementById("tem2").innerHTML = tem;

    if (msg[0] == "true") {
      document.getElementById("on_off2").innerHTML = "On";
      document.getElementById("light_icon2").style.color = "yellow";
      controller = false;
    } else if (msg[0] == "false") {
      document.getElementById("on_off2").innerHTML = "Off";
      document.getElementById("light_icon2").style.color = "black";
    }
  }

  var controller = true;

  function onn() {
    controller = !controller;

    // false = on, true = off
    controller ? document.getElementById("light_icon2").style.color = "black" : document.getElementById("light_icon2").style.color = "yellow";

    if (controller == false) {
      document.getElementById("on_off2").innerHTML = "On";
      
      ws.send("hue2_on");
      ws.send("hue2_state");
    } 
    else if (controller == true) {
      document.getElementById("on_off2").innerHTML = "Off";
      document.getElementById("bri2").innerHTML = "0%";
      document.getElementById("tem2").innerHTML = "0%";
      ws.send("hue2_off");
    }

    if (controller == false) {
      document.getElementById("bright2").disabled = false;
      document.getElementById("temperature2").disabled = false;
      document.getElementById("colorWell2").disabled = false;
    }
    else {
      document.getElementById("bright2").disabled = true;
      document.getElementById("temperature2").disabled = true;
      document.getElementById("colorWell2").disabled = true;
    }
  }


  var slider_brigt = document.getElementById("bright2");
  var slider_temperature = document.getElementById("temperature2");

  slider_brigt.addEventListener("mouseup", function () {
    var br;

    console.log("조명밝기")

    if (controller == false) {
      br = "bri2" + "," + this.value;
      document.getElementById("bri2").innerHTML = Math.round((parseInt(this.value) / 254 * 100)).toString() + "%";
    }

    ws.send(br);
  });

  slider_temperature.addEventListener("mouseup", function () {
    var br;

    console.log("조명온도")

    if (controller == false ) {
      br = "tem2" + "," + this.value;
      document.getElementById("tem2").innerHTML = Math.round((parseInt(this.value) / 500 * 100)).toString() + "%";
    }

    ws.send(br);
  });
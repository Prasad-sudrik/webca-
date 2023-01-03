// const { stream } = require("browser-sync");
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;
    //enabling video and audio channels 
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        // const somestream = stream;
        console.log(stream);
        video.srcObject = stream;
        video.play();
    }).catch(err=>{
        // video.src=window.URL.createObjectURL(somestream);
        console.log("OH NO!!!",err);});
}

function paintToCanavas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    console.log(width,height);

    setInterval(()=>{
    ctx.drawImage(video, 0 , 0, width, height);
    let pixels = ctx.getImageData(0,0,width,height);
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels)
    // ctx.globalAlpa = 0.8;

    pixels = greenScreen(pixels);

    ctx.putImageData(pixels,0,0);
    // debugger;

},16);

}
function takePhoto(){
    snap.currentTime=0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href=data;
    link.setAttribute('download','handsome');
    link.innerHTML =`<img src="${data}" alt="Prasad Sudrik" />`
    link.textContent='Download Image';
    strip.insertBefore(link,strip.firstChild);
    // console.log(data);
}

function redEffect(pixels) {
    for(let i=0;i < pixels.data.length; i+=4){
        pixels.data[i+0]= pixels.data[i+0]+100;
        pixels.data[i+1]=pixels.data[i+1]-50;
        pixels.data[i+2]=pixels.data[i+2]*0.5;
    }
    return pixels;
  }

  function rgbSplit(pixels){
    for(let i=0;i < pixels.data.length; i+=4){
        pixels.data[i-150]= pixels.data[i+0]; //RED
        pixels.data[i+100]=pixels.data[i+1]; // GREEN
        pixels.data[i-550]=pixels.data[i+2]; //BLUE
    }
    return pixels;
  }

  function greenScreen(pixels) {
    const levels = {};
    console.log('green');
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

// console.log(width,height);
// paintToCanavas();
getVideo();

video.addEventListener('canplay',paintToCanavas);
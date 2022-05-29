const video = document.getElementById('video');
let userAge = 0;
console.log(faceapi.nets)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
};

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
]).then(startVideo);



video.addEventListener('play',getAge);

function getAge() {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setTimeout(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        
        resizedDetections.forEach(result => {
            const age = result;
            const bottomRight = {
                x: result.detection.box.bottomRight.x - 50,
                y: result.detection.box.bottomRight.y
            };
            // new faceapi.draw.DrawTextField(
            //     [`${faceapi.round(age, 0)} years`],
            //     bottomRight
            // ).draw(canvas);

            console.log("Age is :"+result.age);
            console.log("Gender is :"+result.gender);
            userAge = Math.round(result.age);
            console.log("Age is :"+userAge);
        });

    }, 3000);
}

function openInNewTab(href) {
    Object.assign(document.createElement('a'), {
      target: '_blank',
      href: href,
    }).click();
  }

const proceedButton = document.getElementById('proceedButton');
proceedButton.addEventListener("click", getSuggestions);

function getSuggestions(){
   getAge();
   userAge
   if(userAge<13){ openInNewTab("./children.html");
    
   } else if (userAge>13 && userAge<26){  openInNewTab("./youth.html");

    } else {  openInNewTab("./adults.html");

  }
}



 
let images = []; // 이미지 배열
let imagesorg = []; // 이미지 원본 배열
let currentIndex = 0; // 현재 이미지 인덱스
let clicking = false; let dragging = false; 
let eraserSize = 100; // 지우개 크기
let mask; // 지워질때 다음 이미지가 보이도록 마스크
let revealThreshold = 0.3; // 30% 한계값

let textArray = ["Collect Summer"]; // 텍스트 배열
let textSubArray = ["When someone asks me what my favorite season is,\n I answer without hesitation that it is summer.\n Summer leaves its traces without us even realizing it,\n and it glows and shines.Drag and clear the screen \n to enjoy the summers I have collected!"];
let font; 
let font2;
let textPositions = []; // 텍스트 y 좌표
let textSpeeds = []; // 텍스트 속도
let animationCompleted = false; // 애니메이션 완료 여부
let textEventExecuted = false; // 텍스트이벤트 실행 여부

function preload() {
  for (let i = 0; i <= 10; i++) {
    images[i] = loadImage(`summer/summer${i}.png`);}
  
  font = loadFont('TiquiTaca-Regular.ttf');
  font2 = loadFont('Diphylleia-Regular.ttf');
}

function setup() {
  noCursor();
  let container = select('#canvas-container'); //화면 사이즈 조정
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(container);
  
  mask = createGraphics(windowWidth, windowHeight);
  mask.pixelDensity(1); // 마스크가 동일한 픽셀 사용하도록
  mask.background(255); // 흰색 마스크로 시작
  for (let i = 0; i <= 10; i++) {
    let imgCopy = createImage(images[i].width, images[i].height);
    imgCopy.copy(images[i], 0, 0, images[i].width, images[i].height, 0, 0, images[i].width, images[i].height);
    imagesorg.push(imgCopy); }
  
  textFont(font); 
  for (let i = 0; i < textArray.length; i++) {
    textPositions.push(-100 - (i * 100)); // 각 텍스트를 화면 위로부터 떨어지도록 초기값 설정
    textSpeeds.push(1); // 모든 텍스트의 속도 동일하게 설정
  }
  textPositions.push(-100 - (textArray.length * 170)); // 추가 텍스트의 초기 위치 설정
  textSpeeds.push(1); // 추가 텍스트의 속도 설정

}

function draw() {
  clear(); 
  
  let nextIndex = (currentIndex + 1) % images.length;
  // 이미지의 비율을 유지하면서 화면의 가로 넓이에 맞추어 크기를 조정
  let img = images[currentIndex];
  let aspectRatio = img.width / img.height;
  let imgWidth = width;
  let imgHeight = imgWidth / aspectRatio;

  if (imgHeight < height) { // 이미지가 화면 높이에 맞지 않으면
    imgHeight = height;
    imgWidth = imgHeight * aspectRatio;
  }

  // 마스크 적용한 현재 이미지와 지워질때 다음 이미지 표시
  image(images[nextIndex], 0, 0, imgWidth, imgHeight);
  images[currentIndex].mask(mask);
  image(images[currentIndex], 0, 0, imgWidth, imgHeight);

  mask.loadPixels(); // 드러난 비율 계산
  let revealedPixels = 0;
  for (let i = 0; i < mask.pixels.length; i += 4) { // RGBA 형식이므로 4씩 증가
    if (mask.pixels[i] === 0) { // 마스크가 검은색인 경우
      revealedPixels++;
    }
  }
  let totalPixels = mask.width * mask.height;
  let revealedPercentage = revealedPixels / totalPixels;
  mask.updatePixels();

  // 30% 이상 드러난 경우 다음 이미지로 완전히 이동
  if (revealedPercentage >= revealThreshold) {
    currentIndex = (currentIndex + 1) % images.length;
    mask.clear(); // 마스크 초기화
    mask.background(255); 
    for (let i = 0; i < images.length; i++) {
      images[i].copy(imagesorg[i], 0, 0, imagesorg[i].width, imagesorg[i].height, 0, 0, imagesorg[i].width, imagesorg[i].height);
    }
  }

  // 텍스트 이벤트~~ (한 번만 실행)
  if (!textEventExecuted) {
    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < textArray.length; i++) {
      text(textArray[i], width / 2, textPositions[i]); //텍스트 위치
      textPositions[i] += textSpeeds[i]; // 텍스트 Y 좌표 증가(떨어지게)
    }
push();
    textSize(22); // 추가 텍스트 크기 설정
    textFont(font2);
    text(textSubArray[0], width / 2, textPositions[textArray.length]); // 추가 텍스트 위치 설정
    textPositions[textArray.length] += textSpeeds[0]; // 추가 텍스트의 Y 좌표 증가
pop();

    // 모든 텍스트가 화면을 벗어났는지 확인
    if (textPositions.every(pos => pos > height + 100)) {
      animationCompleted = true; // 애니메이션 완료 상태로 변경
      textEventExecuted = true; // 텍스트 이벤트 실행 완료
    }
  }

  // 반짝이는 커서 효과
  if (clicking || dragging) {
    for (let i = 0; i < 2 ; i++) {
      noStroke();
      fill(255, 252, 224, random(50, 150)); // 랜덤한 투명도
      ellipse(mouseX + random(-50, 50), mouseY + random(-50, 50), random(15, 13),random(8, 10));
      
    }
  }
}

function mousePressed() {
  clicking = true;
  dragging = true; // 마우스 눌렀을 때 드래그를 참으로
}

function mouseReleased() {
  clicking = false;
  dragging = false; // 마우스를 뗐을 때
}

function mouseDragged() {
  if (dragging) { // 마우스에 지우개 효과
    mask.erase(255, 255);
    mask.ellipse(mouseX, mouseY, eraserSize, eraserSize);
    mask.noErase();
  }

  
}

//화면 사이즈가 열리는 창 사이즈에 맞게 조정되도록!! (html에 container 추가하는 방법)
function windowResized() {
  let container = select('#canvas-container');
  resizeCanvas(windowWidth, windowHeight);
  mask = createGraphics(windowWidth, windowHeight);
  mask.pixelDensity(1);
  mask.background(255); // 마스크 초기화
}

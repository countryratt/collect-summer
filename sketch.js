let images = []; // 이미지 배열
let imagesorg = []; // 이미지 원본 배열
let currentIndex = 0; // 현재 이미지 인덱스
let dragging = false; // 드래그 상태 변수 초기화
let eraserSize = 100; // 지우개 크기
let mask; // 마스크 변수
let revealThreshold = 0.3; // 30% 한계값
let textArray = ["Collect Summer"]; // 텍스트 배열
let textSubArray = ["If someone asks me what my favorite season is,\n I answer without hesitation: summer.\n Summer is vague and sparkling without us knowing why.\n Please clear the screen \n and enjoy the summer I have collected!"];
let font; 
let textPositions = []; // 텍스트의 y 좌표
let textSpeeds = []; // 텍스트의 속도
let animationCompleted = false; // 애니메이션 완료 여부
let textEventExecuted = false; // 텍스트 이벤트 실행 여부

function preload() {
  for (let i = 0; i <= 10; i++) {
    images[i] = loadImage(`summer/summer${i}.png`, img => {
      console.log(`Loaded image: summer/summer${i}.png`);
    }, err => {
      console.error(`Failed to load image: summer/summer${i}.png`);
    });
  }
  font = loadFont('TiquiTaca-Regular.ttf'); // 사용하고자 하는 폰트 경로
}

function setup() {
  let container = select('#canvas-container');
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
    textPositions.push(-100 - (i * 130)); // 각 텍스트를 화면 위로부터 떨어지도록 초기값 설정
    textSpeeds.push(3); // 모든 텍스트의 속도 동일하게 설정
  }
  textPositions.push(-100 - (textArray.length * 150)); // 추가 텍스트의 초기 위치 설정
  textSpeeds.push(3); // 추가 텍스트의 속도 설정
}

function draw() {
  clear(); // 배경을 지우지 않음
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

  // 마스크 적용한 현재 이미지와 다음 이미지를 표시
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

  // 30% 이상 드러난 경우 다음 이미지로 이동
  if (revealedPercentage >= revealThreshold) {
    currentIndex = (currentIndex + 1) % images.length;
    mask.clear(); // 마스크 초기화
    mask.background(255); // 마스크를 완전히 초기화
    for (let i = 0; i < images.length; i++) {
      images[i].copy(imagesorg[i], 0, 0, imagesorg[i].width, imagesorg[i].height, 0, 0, imagesorg[i].width, imagesorg[i].height);
    }
  }

  // 텍스트 애니메이션 (초기 한 번만 실행)
  if (!textEventExecuted) {
    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < textArray.length; i++) {
      text(textArray[i], width / 2, textPositions[i]); // 각 텍스트 위치 설정
      textPositions[i] += textSpeeds[i]; // 각 텍스트의 Y 좌표 증가
    }

    textSize(20); // 추가 텍스트 크기 설정
    text(textSubArray[0], width / 2, textPositions[textArray.length]); // 추가 텍스트 위치 설정
    textPositions[textArray.length] += textSpeeds[0]; // 추가 텍스트의 Y 좌표 증가

    // 모든 텍스트가 화면을 벗어났는지 확인
    if (textPositions.every(pos => pos > height + 100)) {
      animationCompleted = true; // 애니메이션 완료 상태로 변경
      textEventExecuted = true; // 텍스트 이벤트 실행 완료
    }
  }
}

function mousePressed() {
  dragging = true; // 마우스 눌렀을 때 드래그를 참으로
}

function mouseReleased() {
  dragging = false; // 마우스를 뗐을 때 드래그 거짓
}

function mouseDragged() {
  if (dragging) { // 마우스에 지우개 효과
    mask.erase(255, 255);
    mask.ellipse(mouseX, mouseY, eraserSize, eraserSize);
    mask.noErase();
  }
}

function windowResized() {
  let container = select('#canvas-container');
  resizeCanvas(windowWidth, windowHeight);
  mask = createGraphics(windowWidth, windowHeight);
  mask.pixelDensity(1);
  mask.background(255); // 마스크 초기화
}

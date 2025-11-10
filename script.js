const lamps = {
  north: document.querySelector('#lamp-north'),
  south: document.querySelector('#lamp-south'),
  east: document.querySelector('#lamp-east'),
  west: document.querySelector('#lamp-west')
};

const timers = {
  north: document.querySelector('#timer-north'),
  south: document.querySelector('#timer-south'),
  east: document.querySelector('#timer-east'),
  west: document.querySelector('#timer-west')
};

const cars = {
  north: document.querySelector('.north-car'),
  south: document.querySelector('.south-car'),
  east: document.querySelector('.east-car'),
  west: document.querySelector('.west-car')
};

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const pedBtn = document.getElementById('pedBtn');
const modeEl = document.getElementById('mode');
const currentEl = document.getElementById('current');

let running = false;
let pedestrianRequested = false;

const GREEN_TIME = 5;
const YELLOW_TIME = 2;

function setLamp(dir, color) {
  const el = lamps[dir];
  el.querySelectorAll('.light').forEach(l => l.classList.remove('on'));
  if (color) el.querySelector(.light.${color}).classList.add('on');
}

function allRed() {
  Object.keys(lamps).forEach(d => setLamp(d, 'red'));
  Object.values(timers).forEach(t => (t.textContent = 0));
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function opposite(dir) {
  if (dir === 'north') return 'south';
  if (dir === 'south') return 'north';
  if (dir === 'east') return 'west';
  if (dir === 'west') return 'east';
}

async function countDown(dir, seconds) {
  for (let i = seconds; i >= 0; i--) {
    timers[dir].textContent = i;
    timers[opposite(dir)].textContent = i;
    await sleep(1000);
  }
}

async function greenCycle(dir1, dir2) {
  modeEl.textContent = 'Running';
  currentEl.textContent = ${dir1.toUpperCase()} - ${dir2.toUpperCase()} Green;

  setLamp(dir1, 'green');
  setLamp(dir2, 'green');
  setLamp(opposite(dir1), 'red');
  setLamp(opposite(dir2), 'red');

  cars[dir1].classList.add(move-${dir1});
  cars[dir2].classList.add(move-${dir2});

  await countDown(dir1, GREEN_TIME);

  setLamp(dir1, 'yellow');
  setLamp(dir2, 'yellow');
  await countDown(dir1, YELLOW_TIME);

  setLamp(dir1, 'red');
  setLamp(dir2, 'red');

  cars[dir1].classList.remove(move-${dir1});
  cars[dir2].classList.remove(move-${dir2});
}

async function flashPedestrian() {
  modeEl.textContent = 'Pedestrian Crossing';
  Object.keys(lamps).forEach(d => setLamp(d, 'green'));
  await sleep(2000);
  allRed();
  modeEl.textContent = 'Running';
}

async function runTraffic() {
  while (running) {
    await greenCycle('north', 'south');
    if (!running) break;

    await greenCycle('east', 'west');
    if (pedestrianRequested) {
      await flashPedestrian();
      pedestrianRequested = false;
    }
  }

  allRed();
  modeEl.textContent = 'Stopped';
  currentEl.textContent = '—';
}

startBtn.onclick = () => {
  if (!running) {
    running = true;
    runTraffic();
  }
};

stopBtn.onclick = () => {
  running = false;
};

pedBtn.onclick = () => {
  if (running) pedestrianRequested = true;
  else flashPedestrian();
};

allRed();

import TrackPlayer from 'react-native-track-player';

// gets distances between two 2D cordinates in cartesian space
// each cord has format {x: number, y: number}
const getDistance = (cord1, cord2) => {
  return Math.sqrt(Math.pow(cord1.x-cord2.x, 2)+Math.pow(cord1.y-cord2.y, 2));
};

// tells you if you've swiped left or right based on start and end points
// (could easily expand to also handle up and/or down)
export const swipeHelper = (start, end) => {
  // minimum distance to swipe for a swipe to register
  const minSwipe = 100;

  // maximum travel in the off-axis direction to count as a swipe
  // (as proportion of total travel)
  const maxOffAxis = .4;

  const distanceTotal = getDistance(start, end);
  const distanceY = Math.abs(start.y-end.y);

  if (distanceTotal < minSwipe) {
    return null;
  }

  // check for swipe in x-direction
  if (distanceY/distanceTotal < maxOffAxis) {
    if (end.x > start.x) {
      return 'right';
    } else if (end.x < start.x) {
      return 'left';
    }
  }
};

// for getting the image next to the given image in a list
export const getAdjoining = (imageName, imageList, direction) => {
  const imageNames = imageList.map((i) => i.fileName);
  const maxIndex = imageNames.length - 1;
  const imageIndex = imageNames.indexOf(imageName);

  // do nothing if swiping right on first image
  if (imageIndex === 0 && direction === 'right') {
    return imageName;
  // do nothing if swiping left on the last image
  } else if (imageIndex === maxIndex && direction === 'left') {
    return imageName;
  // regular swipe left
  } else if (direction === 'left') {
    return imageNames[imageIndex + 1];
  // regular swipe right
  } else if (direction === 'right') {
    return imageNames[imageIndex - 1];
  // default so it doesn't break
  } else {
    return imageName;
  }
};

// helper helper that rounds to nearest second + ensures leading 0
const secondHelper = (time) => {
  const rounded = Math.floor(time);
  if (rounded < 10) {
    return `0${rounded}`;
  } else {
    return `${rounded}`;
  }
};

// takes a time in seconds and returns in minutes to the nearest second
export const toMinutes = (time) => {
  // less than a minute
  if (time < 60) {
    return `0:${secondHelper(time)}`;
  // greater than a minute but less than an hour
  } else if (time <3600) {
    const minutes = Math.floor(time/60);
    const remainder = secondHelper(time - minutes*60);
    return `${minutes}:${remainder}`;
  // default
  } else {
    return time;
  }
};

// function for converting song files to the right name
export const fileToName = (fileName) => {
  const fileList = {
    'waiting.mp3': 'song0',
    'transition.mp3': 'song1',
    'down-the-aisle.mp3': 'song2',
    'Mia2.1.mp3': 'song3'};

  const songCode = fileList[fileName];

  return songCode;
};

// helper function for sorting audio
export const compareSongs = (song1, song2) => {
  const name1 = fileToName(song1.fileName);
  const name2 = fileToName(song2.fileName);
  if (name1 > name2) {
    return 1;
  } else if (name1 < name2) {
    return -1;
  } else {
    return 0;
  }
};

// tells you where this audio file is in the queue
export const placeInQueue = async (fileName) => {
  const queue = await TrackPlayer.getQueue();
  const orderedFiles = queue.map((i) => i.id);

  const thisIndex = orderedFiles.indexOf(fileName);

  return thisIndex;
};

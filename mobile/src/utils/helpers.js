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


// helper function for sorting scenes
// NOTE: you need to name them scene1, scene2, etc.
// then use the suo-eng dict for their actual names
const compareScenes = (scene1, scene2) => {
  if (scene1.sceneName > scene2.sceneName) {
    return 1;
  } else if (scene1.sceneName < scene2.sceneName) {
    return -1;
  } else {
    return 0;
  }
};

// helper function for sorting images
const compareImages = (image1, image2) => {
  if (image1.fileName > image2.fileName) {
    return 1;
  } else if (image1.fileName < image2.fileName) {
    return -1;
  } else {
    return 0;
  }
};

// function for converting song files to the right name
const fileToName = (songFile) => {
  const fileList = {
    'waiting.mp3': 'song0',
    'transition.mp3': 'song1',
    'down-the-aisle.mp3': 'song2',
    'Mia2.1.mp3': 'song3'};

  const songCode = fileList[songFile.fileName];

  return songCode;
};

// helper function for sorting audio
const compareSongs = (song1, song2) => {
  const name1 = fileToName(song1);
  const name2 = fileToName(song2);
  if (name1 > name2) {
    return 1;
  } else if (name1 < name2) {
    return -1;
  } else {
    return 0;
  }
};

export default {compareImages, compareScenes, compareSongs, fileToName};

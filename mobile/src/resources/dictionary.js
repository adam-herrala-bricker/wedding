// not super stoked that this is now decoupled from the other dictionary
// but also didn't want it living outside the mobile folder

const textDictionary = {
  entryKey: {suo: 'sivuavain', eng: 'entry key'},
  entryError: {suo: 'väärä sivuavain', eng: 'incorrect entry key'},
  enter: {suo: 'sisään', eng: 'enter'},

  header: {suo: 'Herrala Bricker Häät', eng: 'Herrala Bricker Wedding'},
  photos: {suo: 'kuvat', eng: 'photos'},
  music: {suo: 'musiikki', eng: 'music'},
  home: {suo: 'etusivu', eng: 'home'},

  guest: {suo: 'vieras', eng: 'guest'},
  username: {suo: 'käyttäjätunnus', eng: 'username'},
  password: {suo: 'salasana', eng: 'password'},
  login: {suo: 'kirjaudu sisään', eng: 'log in'},
  logout: {suo: 'kirjaudu ulos', eng: 'log out'},
  cancel: {suo: 'peruuta', eng: 'cancel'},

  loading: {suo: 'ladataan', eng: 'loading'},

  resolution: {suo: 'resoluutio', eng: 'resolution'},
  larger: {suo: 'isompi', eng: 'larger'},
  faster: {suo: 'nopeampi', eng: 'faster'},

  download: {suo: 'lataa', eng: 'download'},

  loginError:
  {
    suo: 'Väärä käyttäjätunnus tai salasana',
    eng: 'Username or password is incorrect',
  },

  filter: {suo: 'suodata', eng: 'filter'},
  done: {suo: 'valmis', eng: 'done'},
  new: {suo: 'uusi', eng: 'create'},
  clear: {suo: 'tyhjennä', eng: 'clear'},

  welcomeTxt:
  {
    suo: 'Kiitos kun juhlit kanssamme 15. heinäkuuta!',
    eng: 'Thank you for celebrating with us on July 15th!',
  },

  welcomeSubTxt:
  {
    suo: 'Tässä on katsaus takaisin juhlapäivään.',
    eng: 'Here is a little throwback to the big day.',
  },

  photoTxt:
  {
    suo: 'Huom! Galleran kuvat on ottanut valokuvaajamme Milja Nordgerg. Mainitsethan hänet, jos käytät näitä kuvia jossain. Huomaathan myös, että kuvia ei tule leikata tai editoida millään tavalla.', // eslint-disable-line max-len
    eng: 'Note: All photos were taken by our talented photographer Milja Nordberg. We request that if you use these photos anywhere you credit her. Please also note that as per our agreement with her, the photos should not be cropped or edited in any way.', // eslint-disable-line max-len
  },

  scene0: {suo: 'kaikki', eng: 'all'},
  scene1: {suo: 'meidän suosikkimme', eng: 'our favorites'},
  scene2: {suo: 'potretit', eng: 'portraits'},
  scene3: {suo: 'ryhmäkuvat', eng: 'group photos'},
  scene4: {suo: 'vihkiminen', eng: 'ceremony'},
  scene5: {suo: 'ruoka', eng: 'food'},
  scene6: {suo: 'juhlat', eng: 'party'},

  song0: {suo: 'Odotus', eng: 'Waiting'},
  song1: {suo: 'Siirtyminen', eng: 'Transition'},
  song2: {suo: 'Alttarille Kävely', eng: 'Down the Aisle'},
  song3: {suo: 'A Sunday Kind of Love', eng: 'A Sunday Kind of Love'},

  songX: {suo: 'Noita', eng: 'The Witch'},
  songY: {suo: 'Jazz-juhlat', eng: 'Jazz Party'},

  back: {suo: 'takaisin', eng: 'back'},
  exit: {suo: 'ulos', eng: 'exit'},
};

export default textDictionary;

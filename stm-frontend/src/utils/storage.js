// /Users/user/stm/stm-frontend/src/utils/storage.js
export const getSongs = () => {
  const songs = localStorage.getItem('songs');
  return songs
    ? JSON.parse(songs)
    : [
        {
          id: '1',
          title: 'Sample Track 1',
          artist: 'Artist1',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          price: 100,
          likes: 0,
          shares: 0,
        },
        {
          id: '2',
          title: 'Sample Track 2',
          artist: 'Artist2',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          price: 150,
          likes: 0,
          shares: 0,
        },
      ];
};

export const saveSongs = (songs) => {
  localStorage.setItem('songs', JSON.stringify(songs));
};

export const getUser = (userId) => {
  const user = localStorage.getItem(`user_${userId}`);
  return user
    ? JSON.parse(user)
    : {
        points: 0,
        likedSongs: [],
        favorites: [],
      };
};

export const saveUser = (userId, userData) => {
  localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
};

export const addSong = (song) => {
  const songs = getSongs();
  songs.push(song);
  saveSongs(songs);
};
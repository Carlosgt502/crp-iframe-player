window.addEventListener('message', ev => {
  const loading = document.querySelector('.loading');

  const playerError = document.querySelector('.player-error');

  if (loading.style.display == 'none') loading.style.display = 'flex';

  if (playerError.style.display == 'flex') playerError.style.display = 'none';

  const data = ev.data;

  const videoConfig = ev.data.videoConfig;

  const streamList = videoConfig.streams;

  if (!streamList) return displayError();

  const userLang = data.userLang;

  const searchStreamLang = streamList.find(stream => stream.hardsub_locale == userLang);

  const streamLang = searchStreamLang ? userLang : '';

  const title = data.title;

  const image = data.image

  const description = data.description;

  const videoId = data.videoId;

  for (const stream of streamList) {
    if (stream.hardsub_locale == streamLang) {
      const url = stream.url;
      startPlayer(url);
      break;
    }
  }

  function startPlayer(url) {
    const playerInstance = jwplayer('player')
    playerInstance.setup({
      'playlist': [{
        'title': title,
        'image': image,
        'description': description,
        'file': url
            }]
    });

    playerInstance.on('ready', ev => {
      if (localStorage.getItem(videoId)) document.getElementsByTagName('video')[0].currentTime = localStorage.getItem(videoId);

      loading.style.display = 'none';
    })

    playerInstance.on('time', ev => {
      localStorage.setItem(videoId, ev.currentTime);
    })

    playerInstance.on('complete', ev => {
      localStorage.removeItem(videoId);
    })

    playerInstance.on('error', ev => {
      console.log(ev)
    })

    playerInstance.on('setupError', ev => {
      console.log(ev);
    })
  }

  function displayError() {
    playerError.style.display = 'flex';

    loading.style.display = 'none';
  }
});

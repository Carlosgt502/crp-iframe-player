window.addEventListener('message', ev => {
    const loading = document.querySelector('.loading')

    if (loading.style.display == 'none') loading.style.display = 'flex';

    const data = ev.data;

    console.log(data);

    const videoConfig = ev.data.videoConfig;

    const streamList = videoConfig.streams;

    if (!streamList) return displayError();

    const userLang = data.userLang;

    const searchStreamLang = streamList.find(stream => stream.hardsub_locale == userLang);

    const streamLang = searchStreamLang ? userLang : '';

    const title = data.title;

    const thumbnail = data.thumbnail

    const description = data.description;

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
                'image': thumbnail,
                'description': description,
                'file': url
            }]
        });

        playerInstance.on('ready', ev => {
            console.log(ev)

            loading.style.display = 'none';
        })

        playerInstance.on('time', ev => {
            console.log(ev)
        })

        playerInstance.on('complete', ev => {

        })

        playerInstance.on('error', ev => {
            console.log(ev)
        })

        playerInstance.on('setupError', ev => {
            console.log(ev);
        })
    }

    function displayError() {
        const playerError = document.querySelector('.player-error');
        playerError.style.display = 'flex';

        loading.style.display = 'none';
    }
});

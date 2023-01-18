window.addEventListener('message', e => {

    const data = e.data;

    const title = data.title;

    const thumbnail = data.thumbnail;

    const description = data.description;

    const userLang = data.userLang;

    const episodeId = data.episodeId;

    const videoConfig = JSON.parse(data.videoConfig);

    const streamList = videoConfig.streams;

    const searchStreamLang = streamList.find(stream => stream.hardsub_locale == userLang);

    console.log(searchStreamLang)

    const streamLang = searchStreamLang ? userLang : '';

    console.log(streamLang)

    for (const stream of streamList) {

        console.log(stream)

        if (stream.hardsub_locale == streamLang) {

            const url = stream.url;

            startPlayer(url);

            break;

        }

    }

    function startPlayer(url) {

        const playerInstance = jwplayer('player_div');

        playerInstance.setup({

                'playlist': [{

                    'title': title,

                    'image': thumbnail,

                    'description': description,

                    'file': url

                }]

            })

            .on('ready', () => {

                const container = document.querySelector('.loading_container');

                container.style.display = 'none';

                const time = localStorage.getItem(episodeId);

                if (time) document.getElementsByTagName('video')[0].currentTime = time;

            })

            .on('time', (e) => {

                const position = e.position;

                localStorage.setItem(episodeId, position)

            })

    }

});

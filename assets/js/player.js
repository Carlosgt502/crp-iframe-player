window.addEventListener('message', e => {

    const href = window.location.href
    if (href.startsWith("http://127.0.0.1") || href.startsWith("http://localhost")) {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "upgrade-insecure-requests";
        document.getElementsByTagName('head')[0].appendChild(meta);
    }


    if (!e.data) return console.log(e);

    const langs = {
        "pt-BR": "Português (BR)",
        "en-US": "English (US)",
        "en-GB": "English (UK)",
        "es-419": "Español (LA)",
        "es-ES": "Español (ES)",
        "pt-PT": "Português (PT)",
        "fr-FR": "Français (FR)",
        "de-DE": "Deutsch (DE)",
        "ar-ME": "(ME) عربي",
        "it-IT": "Italiano (IT)",
        "ru-RU": "Русский (RU)",
        'off': 'off'
    };

    const tampermonkey_proxy = "https://crp-proxy.herokuapp.com/get?url=";
    const webvideocaster = e.data.webvideocaster;
    const tampermonkey = e.data.tampermonkey;
    const videoConfig = e.data.videoConfig;
    const description = e.data.description;
    const force_mp4 = e.data.force_mp4;
    const thumbnail = e.data.thumbnail;
    const episodeId = e.data.episodeId;
    const userLang = e.data.userLang;
    const version = e.data.version;
    const title = e.data.title;
    const videoM3u8 = [];
    const videoMp4 = {};
    const sources = [];
    const streamList = videoConfig['streams'];
    const sourceLocale = getSourceLocale(userLang);

    if (force_mp4) console.log("[CR Premium] Forçando MP4 (chromecast workaround)");

    for (const stream of streamList) {
        const streamLang = stream.hardsub_locale;

        if (!videoMp4[streamLang]) {
            videoMp4[streamLang] = [stream.url];
        }

        if (streamLang == sourceLocale) {
            sources.push({
                'type': 'm3u8',
                'file': stream.url
            });
        };
    }

    const tracks = getTracks();
    (() => {
        const playerInstance = jwplayer('player_div');
        playerInstance.setup({
            'playlist': [{
                'title': title,
                'image': thumbnail,
                'description': descriptio,
                'sources': sources,
                'tracks': tracks
            }],
            "related": {
                displayMode: 'none'
            },
            "nextupoffset": -up_next_cooldown,
            "width": "100%",
            "height": "100%",
            "autostart": false,
            "displayPlaybackLabel": true,
            "primary": "html5",
            "cast": {},
            "playbackRateControls": [0.5, 0.75, 1, 1.25, 1.5, 2]
        }).on('ready', () => {
            const time = localStorage.getItem(episodeId);

            if (time) document.getElementsByTagName("video")[0].currentTime = time;

        }).on('time', ({
            currentTime
        }) => {
            localStorage.setItem(episodeId, currentTime);
        }).on('compconste', () => {
            localStorage.removeItem('episodeId');
        }).on('setupError', e => {
            console.log(e)
        }).on('error', e => {
            console.log(e)
        })

        const update_iconPath = "assets/icon/update_icon.svg";
        const update_id = "update-video-button";
        const update_tooltipText = "Atualização Disponível";

        const rewind_iconPath = "assets/icon/replay-10s.svg";
        const rewind_id = "rewind-video-button";
        const rewind_tooltipText = "Voltar 10s";

        const forward_iconPath = "assets/icon/forward-30s.svg";
        const forward_id = "forward-video-button";
        const forward_tooltipText = "Avançar 30s";

        const webvideocaster_iconPath = "assets/icon/webvideocaster_icon.png";
        const webvideocaster_id = "webvideocaster-video-button";
        const webvideocaster_tooltipText = "Abrir no WebVideoCaster";

        const download_iconPath = "assets/icon/download_icon.svg";
        const download_id = "download-video-button";
        const download_tooltipText = "Download";
        const downloadModal = document.querySelectorAll(".modal")[0];
        const updateModal = document.querySelectorAll(".modal")[1];
        document.querySelectorAll("button.close-modal")[0].onclick = () => downloadModal.style.visibility = "hidden";
        document.querySelectorAll("button.close-modal")[1].onclick = () => updateModal.style.visibility = "hidden";

        const rewind_ButtonClickAction = () => jwplayer().seek(jwplayer().getPosition() - 10)
        const forward_ButtonClickAction = () => jwplayer().seek(jwplayer().getPosition() + 30)

        function download_ButtonClickAction() {
            if (jwplayer().getEnvironment().OS.mobile == true) {
                downloadModal.style.height = "170px";
                downloadModal.style.overflow = "auto";
            }
            downloadModal.style.visibility = downloadModal.style.visibility === "hidden" ? "visible" : "hidden";
        }

        function update_ButtonClickAction() {
            if (jwplayer().getEnvironment().OS.mobile == true) {
                updateModal.style.height = "170px";
                updateModal.style.overflow = "auto";
            }
            updateModal.style.visibility = updateModal.style.visibility === "hidden" ? "visible" : "hidden";
        }

        const forwardBtn = [forward_iconPath, forward_tooltipText, forward_ButtonClickAction, forward_id]
        const rewindBtn = [rewind_iconPath, rewind_tooltipText, rewind_ButtonClickAction, rewind_id]
        const webvideocasterBtn = [webvideocaster_iconPath, webvideocaster_tooltipText, () => {}, webvideocaster_id]
        const downloadBtn = [download_iconPath, download_tooltipText, download_ButtonClickAction, download_id]
        const updateBtn = [update_iconPath, update_tooltipText, update_ButtonClickAction, update_id]

        playerInstance.addButton(...forwardBtn)
        playerInstance.addButton(...rewindBtn)

        if (webvideocaster)
            playerInstance.addButton(...webvideocasterBtn);
        else
            playerInstance.addButton(...downloadBtn);
        if (!tampermonkey && version !== "1.3.0")
            playerInstance.addButton(...updateBtn);

    })();

    function getTracks() {
        return streamList.map(({
            url,
            hardsub_locale
        }) => {
            if (hardsub_locale) return {
                kind: 'captions',
                file: url,
                label: langs[hardsub_locale],
                language: hardsub_locale
            }
        });
    }

    function getSourceLocale(userLang) {
        const locale = streamList.find(({
            hardsub_locale
        }) => hardsub_locale == userLang);

        const streamLang = locale ? userLang : ''

        localStorage.setItem('jwplayer.captionLabel', streamLang == '' ? 'off' : langs[userLang])

        return streamLang;
    }
});

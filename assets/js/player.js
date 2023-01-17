window.addEventListener('message', e => {

const data = e.data;
const title = data.title;
const thumbnail = data.thumbnail;
const description = data.description;
const userLang = data.userLang;
const episodeId = data.episodeId;
const videoConfig = JSON.parse(data.videoConfig);

const stream = videoConfig.streams.filter(stream=>stream.hardsub_locale==userLang);
console.log(stream)
});

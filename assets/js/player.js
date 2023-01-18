window.addEventListener('message', e => {

const data = e.data;
const title = data.title;
const thumbnail = data.thumbnail;
const description = data.description;
const userLang = data.userLang;
const episodeId = data.episodeId;
const videoConfig = JSON.parse(data.videoConfig);

const stream = videoConfig.streams.filter(stream=>stream.hardsub_locale==userLang);
const url = stream[0].url;

const playerInstance= jwplayer('player_div');
playerInstance.setup({
'playlist':[{
'title':title,
'image':thumbnail,
'description':description,
'file':url
    }]
  })
.on('ready',()=>{
const container = document.querySelector('.loading_container');
container.style.display='none';

const time = localStorage.getItem(videoId);
if(time)document.getElementsByTagName('video')[0].currentTime=time;
})
.on('time',(e)=>{
const position = e.position;
localStorage.setItem(videoId,position)
})
});

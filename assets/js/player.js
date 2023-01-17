window.addEventListener('message', e => {

console.log(e.data);

const type = e.data.type;

const event {
'next-episode':nextEpisode
};

if(!event[type])return;

function nextEpisode(){
console.log('Siguiente Episodio')
}

});

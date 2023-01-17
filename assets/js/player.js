window.addEventListener('message', e => {

console.log(e.data);

const type = e.data.type;

const events= {
'next-episode':nextEpisode
};

if(!events[type])return;

function nextEpisode(){
console.log('Siguiente Episodio')
}

});

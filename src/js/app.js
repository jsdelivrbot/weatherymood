
import song from './song.js'
import moods from './moods.js'
import weather from './weather.js'
import background from './background.js'
import geolocation from './geolocation.js'
import preloader from './preloader.js'
import share from './share.js'

let Song  = new song()
let Moods  = new moods()
let Weather  = new weather()
let Background  = new background()
let Geolocation  = new geolocation()
let Preloader  = new preloader()
let Share  = new share()

let firstCall, secondCall, thirdCall
let d = document

let loadImg = (src, callback) => {
    let sprite = new Image()
    sprite.onload = callback
    sprite.src = src
}

let checkPosition = (resolve, reject) => {
    Geolocation.checkPosition(() => {
        resolve()
        setTimeout(()=>{
            Preloader.remove()
        }, 0)
    })
}

let getWeather = (resolve, reject) => {
    Weather.getWeather(function (data) {
        resolve(data)
    })
}

if (navigator.onLine){
    firstCall = new Promise((resolve, reject) => {

        checkPosition(resolve, reject)

    }).then(function(data){

        secondCall = new Promise(function (resolve, reject) {

            getWeather(resolve, reject)

        }).then(function (data) {

            let mood = data

            thirdCall = new Promise(function (resolve, reject) {

                Song.getSong(function (data) {
                    resolve(data)
                }, mood)

            }).then(function (data) {
                console.log(data)
                d.addEventListener('click', (e) => {
                    if(e.target.id === 'shareFB' || e.target.id === "shareTW") {
                        const {external_urls, name, images} = data
                        e.target.id === 'shareFB' ? Share.shareFB(external_urls.spotify, name, images) : Share.shareTW(external_urls.spotify, name, images)
                    }
                })

                let track = {
                    uri: data.uri,
                    name: data.name,
                    cover: data.images[0].url
                }

                loadImg(track.cover, function() {

                    d.getElementById("song-cover")
                     .insertAdjacentHTML('beforeend',`
                        <div id="card">
                            <img src="${track.cover}">
                            <div id="song-play">
                                <a href="${track.uri}" class="play"></a>
                                <div id="song-replay">
                                    <svg class="svg-icon" viewBox="0 0 20 20">
                                        <path fill="#fff" d="M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z"></path>
                                    </svg>
                                </div>
                            </div>
                        `);

                    d.getElementById("song-name").innerHTML = track.name

                    setTimeout(function() {
                        d.getElementById("card").className += "flipped"
                    }, 100)

                    setTimeout(function () {
                        Background.setBackground(Moods.getClass(mood))
                        d.getElementById("song-details").className += "active"
                    }, 500)

                })

            }).catch(function (response) {
                console.log('err', response)
            })

        })
    })
} else {
    document.getElementById("app").className += 'offline'
}


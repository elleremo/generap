const log = console.log;

let links = {
    music: [
        'https://www.youtube.com/watch?v=J3r-ct0haZg',
        'https://www.youtube.com/watch?v=JnxhsWH1ir8',
        'https://www.youtube.com/watch?v=_HPis2DUQgM',
        'https://www.youtube.com/watch?v=igLxy1BfQi4',
        'https://www.youtube.com/watch?v=PsV7Y6Xnqjs',
        'https://www.youtube.com/watch?v=ykUjIsZKEXA',
        'https://www.youtube.com/watch?v=wqJMPUlpHWs',
        'https://www.youtube.com/watch?v=Dk5Dmt-9OgI',
        'https://www.youtube.com/watch?v=PpSsQh1-bCM',
        'https://www.youtube.com/watch?v=0EK4w4yc4aA',
        'https://www.youtube.com/watch?v=JTYEu0pnFNw',
        'https://www.youtube.com/watch?v=39Gb-JRn9I4',
        'https://www.youtube.com/watch?v=18AuJunWPJo',
        'https://www.youtube.com/watch?v=uUedifMqgDQ',
        'https://www.youtube.com/watch?v=ZqW_5Ka0n7g',
        'https://www.youtube.com/watch?v=vMUEMtMIqog',
        'https://www.youtube.com/watch?v=cDwc6C_C2Sk'

    ],
    speech: [

        'https://www.youtube.com/watch?v=cB4JPCFbBU8',
        'https://www.youtube.com/watch?v=-nKHjVlPXYs',
        'https://www.youtube.com/watch?v=OdbO9KNJB-o',
        'https://www.youtube.com/watch?v=CtYPMmWu5qA',
        'https://www.youtube.com/watch?v=EKjl3YL1eFg',
        'https://www.youtube.com/watch?v=RRkY2tfgFz4',
        'https://www.youtube.com/watch?v=ZjoTCPlLW74',
        'https://www.youtube.com/watch?v=9WoT6qJh0Vk',
        'https://www.youtube.com/watch?v=lAMguwnCKZA',
        'https://www.youtube.com/watch?v=cB4JPCFbBU8',
        'https://www.youtube.com/watch?v=qjvsr3uZj4g',
        'https://www.youtube.com/watch?v=AOsYyPQ3lV8'
    ],
}

function getVideoIdFromUrl(link) {
    let id = link.split('https://www.youtube.com/watch?v=')[1];
    return id;
}

function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
        log('click')
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function isYouTubeLink(link) {
    return (link.includes('youtube.com') ||
        link.includes('youtu.be'));
}

let res = isYouTubeLink('https://www.youtube.com/watch?v=EKjl3YL1eFg');
log(res)

const App = {
    musicContainer: {
        element: document.querySelector('.music'),
        links: []
    },
    speechContainer: {
        element: document.querySelector('.speech'),
        links: []
    },

    init: function (links) {
        this.links = links;

        this.addIframe(this.musicContainer);
        this.addIframe(this.speechContainer);

        this.musicContainer.links = links.music;
        this.speechContainer.links = links.speech;

        this.reloadByButton();
    },

    addIframe: function (container) {
        let iframe = document.createElement('iframe');
        iframe.classList.add('y_player')
        container.element.appendChild(iframe);
    },

    reloadAll: function () {
        this.insertMedia(this.musicContainer);
        this.insertMedia(this.speechContainer);

        function onload(iframe) {
            iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
        }

        this.musicContainer.element.querySelector('.y_player').onload = function () {
            onload(this)
        };
        this.speechContainer.element.querySelector('.y_player').onload = function () {
            onload(this)

        };
        // eventFire(this.musicContainer.element.querySelector('.y_player'), 'click')

        // this.musicContainer.element.querySelector('.y_player').addEventListener('click', function (e) {
        //     log(e)
        // })

    },
    reloadByButton: function (container) {
        let button = document.querySelector('.reload-all')
        button.addEventListener("click", () => {
            this.reloadAll();
            button.classList.add('spin');
            setTimeout(() => {
                button.classList.remove('spin');
            }, 800)

        })
    },
    insertMedia: function (container) {
        let randInt = this.randInt(0, container.links.length - 1);
        let iframe = container.element.querySelector('iframe');
        let id = getVideoIdFromUrl(container.links[randInt]);
        let url = 'https://www.youtube.com/embed/' + id + '?rel=0&modestbranding=1&autohide=1&autoplay=1&showinfo=0&controls=1&enablejsapi=1';
        iframe.setAttribute('src', url)
        // iframe.setAttribute('allow', 'autoplay')
    },
    randInt: function (min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}

App.init(links);
App.reloadAll();


(function(){
    var DEBUG = false;
    var sys = cc.sys;
    var version = sys.browserVersion;
    var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
    var supportTable = {
        "common" : {MULTI_CHANNEL: true , WEB_AUDIO: supportWebAudio , AUTOPLAY: true }
    };
    supportTable[sys.BROWSER_TYPE_IE]  = {MULTI_CHANNEL: true , WEB_AUDIO: supportWebAudio , AUTOPLAY: true, USE_EMPTIED_EVENT: true};
    supportTable[sys.BROWSER_TYPE_ANDROID]  = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false};
    supportTable[sys.BROWSER_TYPE_CHROME]   = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: false};
    supportTable[sys.BROWSER_TYPE_FIREFOX]  = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: true , DELAY_CREATE_CTX: true};
    supportTable[sys.BROWSER_TYPE_UC]       = {MULTI_CHANNEL: true , WEB_AUDIO: false, AUTOPLAY: false};
    supportTable[sys.BROWSER_TYPE_QQ]       = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[sys.BROWSER_TYPE_OUPENG]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_WECHAT]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_360]      = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[sys.BROWSER_TYPE_MIUI]     = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: true };
    supportTable[sys.BROWSER_TYPE_LIEBAO]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_SOUGOU]   = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_BAIDU]    = {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_BAIDU_APP]= {MULTI_CHANNEL: false, WEB_AUDIO: false, AUTOPLAY: false, REPLAY_AFTER_TOUCH: true , USE_EMPTIED_EVENT: true };
    supportTable[sys.BROWSER_TYPE_SAFARI]  = {MULTI_CHANNEL: true , WEB_AUDIO: true , AUTOPLAY: false, webAudioCallback: function(realUrl){
        document.createElement("audio").src = realUrl;
    }};
    if(cc.sys.isMobile){
        if(cc.sys.os !== cc.sys.OS_IOS)
            window.__audioSupport = supportTable[sys.browserType] || supportTable["common"];
        else
            window.__audioSupport = supportTable[sys.BROWSER_TYPE_SAFARI];
    }else{
        switch(sys.browserType){
            case sys.BROWSER_TYPE_IE:
                window.__audioSupport = supportTable[sys.BROWSER_TYPE_IE];
                break;
            case sys.BROWSER_TYPE_FIREFOX:
                window.__audioSupport = supportTable[sys.BROWSER_TYPE_FIREFOX];
                break;
            default:
                window.__audioSupport = supportTable["common"];
        }
    }
    if(version){
        switch(sys.browserType){
            case sys.BROWSER_TYPE_CHROME:
                version = parseInt(version);
                if(version < 30){
                    window.__audioSupport  = {MULTI_CHANNEL: false , WEB_AUDIO: true , AUTOPLAY: false};
                }else if(version === 42){
                    window.__audioSupport.NEED_MANUAL_LOOP = true;
                }
                break;
            case sys.BROWSER_TYPE_MIUI:
                if(cc.sys.isMobile){
                    version = version.match(/\d+/g);
                    if(version[0] < 2 || (version[0] === 2 && version[1] === 0 && version[2] <= 1)){
                        window.__audioSupport.AUTOPLAY = false;
                    }
                }
                break;
        }
    }
    if(DEBUG){
        setTimeout(function(){
            cc.log("browse type: " + sys.browserType);
            cc.log("browse version: " + version);
            cc.log("MULTI_CHANNEL: " + window.__audioSupport.MULTI_CHANNEL);
            cc.log("WEB_AUDIO: " + window.__audioSupport.WEB_AUDIO);
            cc.log("AUTOPLAY: " + window.__audioSupport.AUTOPLAY);
        }, 0);
    }
})();
cc.Audio = cc.Class.extend({
    volume: 1,
    loop: false,
    src: null,
    _touch: false,
    _playing: false,
    _AUDIO_TYPE: "AUDIO",
    _pause: false,
    _buffer: null,
    _currentSource: null,
    _startTime: null,
    _currentTime: null,
    _context: null,
    _volume: null,
    _ignoreEnded: false,
    _manualLoop: false,
    _element: null,
    ctor: function(context, volume, url){
        context && (this._context = context);
        volume && (this._volume = volume);
        if(context && volume){
            this._AUDIO_TYPE = "WEBAUDIO";
        }
        this.src = url;
    },
    _setBufferCallback: null,
    setBuffer: function(buffer){
        if(!buffer) return;
        var playing = this._playing;
        this._AUDIO_TYPE = "WEBAUDIO";
        if(this._buffer && this._buffer !== buffer && this.getPlaying())
            this.stop();
        this._buffer = buffer;
        if(playing)
            this.play();
        this._volume["gain"].value = this.volume;
        this._setBufferCallback && this._setBufferCallback(buffer);
    },
    _setElementCallback: null,
    setElement: function(element){
        if(!element) return;
        var playing = this._playing;
        this._AUDIO_TYPE = "AUDIO";
        if(this._element && this._element !== element && this.getPlaying())
            this.stop();
        this._element = element;
        if(playing)
            this.play();
        element.volume = this.volume;
        element.loop = this.loop;
        this._setElementCallback && this._setElementCallback(element);
    },
    play: function(offset, loop){
        this._playing = true;
        this.loop = loop === undefined ? this.loop : loop;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._playOfAudio(offset);
        }else{
            this._playOfWebAudio(offset);
        }
    },
    getPlaying: function(){
        if(!this._playing){
            return false;
        }
        if(this._AUDIO_TYPE === "AUDIO"){
            var audio = this._element;
            if(!audio || this._pause || audio.ended){
                return this._playing = false;
            }
            return true;
        }
        var sourceNode = this._currentSource;
        if(!sourceNode || !sourceNode["playbackState"])
            return true;
        return this._currentTime + this._context.currentTime - this._startTime < sourceNode.buffer.duration;
    },
    _playOfWebAudio: function(offset){
        var cs = this._currentSource;
        if(!this._buffer){
            return;
        }
        if(!this._pause && cs){
            if(this._context.currentTime === 0 || this._currentTime + this._context.currentTime - this._startTime > cs.buffer.duration)
                this._stopOfWebAudio();
            else
                return;
        }
        var audio = this._context["createBufferSource"]();
        audio.buffer = this._buffer;
        audio["connect"](this._volume);
        if(this._manualLoop)
            audio.loop = false;
        else
            audio.loop = this.loop;
        this._startTime = this._context.currentTime;
        this._currentTime = offset || 0;
        this._ignoreEnded = false;
        if(audio.start){
            audio.start(0, offset || 0);
        }else if(audio["noteGrainOn"]){
            var duration = audio.buffer.duration;
            if (this.loop) {
                audio["noteGrainOn"](0, offset, duration);
            } else {
                audio["noteGrainOn"](0, offset, duration - offset);
            }
        }else {
            audio["noteOn"](0);
        }
        this._currentSource = audio;
        var self = this;
        audio["onended"] = function(){
            if(self._manualLoop && self._playing && self.loop){
                self.stop();
                self.play();
                return;
            }
            if(self._ignoreEnded){
                self._ignoreEnded = false;
            }else{
                if(!self._pause)
                    self.stop();
                else
                    self._playing = false;
            }
        };
    },
    _playOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.loop = this.loop;
            audio.play();
        }
    },
    stop: function(){
        this._playing = false;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._stopOfAudio();
        }else{
            this._stopOfWebAudio();
        }
    },
    _stopOfWebAudio: function(){
        var audio = this._currentSource;
        this._ignoreEnded = true;
        if(audio){
            audio.stop(0);
            this._currentSource = null;
        }
    },
    _stopOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.pause();
            if (audio.duration && audio.duration !== Infinity)
                audio.currentTime = 0;
        }
    },
    pause: function(){
        if(this.getPlaying() === false)
            return;
        this._playing = false;
        this._pause = true;
        if(this._AUDIO_TYPE === "AUDIO"){
            this._pauseOfAudio();
        }else{
            this._pauseOfWebAudio();
        }
    },
    _pauseOfWebAudio: function(){
        this._currentTime += this._context.currentTime - this._startTime;
        var audio = this._currentSource;
        if(audio){
            audio.stop(0);
        }
    },
    _pauseOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.pause();
        }
    },
    resume: function(){
        if(this._pause){
            if(this._AUDIO_TYPE === "AUDIO"){
                this._resumeOfAudio();
            }else{
                this._resumeOfWebAudio();
            }
            this._pause = false;
            this._playing = true;
        }
    },
    _resumeOfWebAudio: function(){
        var audio = this._currentSource;
        if(audio){
            this._startTime = this._context.currentTime;
            var offset = this._currentTime % audio.buffer.duration;
            this._playOfWebAudio(offset);
        }
    },
    _resumeOfAudio: function(){
        var audio = this._element;
        if(audio){
            audio.play();
        }
    },
    setVolume: function(volume){
        if(volume > 1) volume = 1;
        if(volume < 0) volume = 0;
        this.volume = volume;
        if(this._AUDIO_TYPE === "AUDIO"){
            if(this._element){
                this._element.volume = volume;
            }
        }else{
            if(this._volume){
                this._volume["gain"].value = volume;
            }
        }
    },
    getVolume: function(){
        return this.volume;
    },
    cloneNode: function(){
        var audio, self;
        if(this._AUDIO_TYPE === "AUDIO"){
            audio = new cc.Audio();
            var elem = document.createElement("audio");
            elem.src = this.src;
            audio.setElement(elem);
        }else{
            var volume = this._context["createGain"]();
            volume["gain"].value = 1;
            volume["connect"](this._context["destination"]);
            audio = new cc.Audio(this._context, volume, this.src);
            if(this._buffer){
                audio.setBuffer(this._buffer);
            }else{
                self = this;
                this._setBufferCallback = function(buffer){
                    audio.setBuffer(buffer);
                    self._setBufferCallback = null;
                };
            }
            audio._manualLoop = this._manualLoop;
        }
        audio._AUDIO_TYPE = this._AUDIO_TYPE;
        return audio;
    }
});
(function(polyfill){
    var SWA = polyfill.WEB_AUDIO,
        SWB = polyfill.MULTI_CHANNEL,
        SWC = polyfill.AUTOPLAY;
    var support = [];
    (function(){
        var audio = document.createElement("audio");
        if(audio.canPlayType) {
            var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
            if (ogg && ogg !== "") support.push(".ogg");
            var mp3 = audio.canPlayType("audio/mpeg");
            if (mp3 && mp3 !== "") support.push(".mp3");
            var wav = audio.canPlayType('audio/wav; codecs="1"');
            if (wav && wav !== "") support.push(".wav");
            var mp4 = audio.canPlayType("audio/mp4");
            if (mp4 && mp4 !== "") support.push(".mp4");
            var m4a = audio.canPlayType("audio/x-m4a");
            if (m4a && m4a !== "") support.push(".m4a");
        }
    })();
    try{
        if(SWA){
            var context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
            if(polyfill.DELAY_CREATE_CTX)
                setTimeout(function(){ context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); }, 0);
        }
    }catch(error){
        SWA = false;
        cc.log("browser don't support web audio");
    }
    var loader = {
        cache: {},
        load: function(realUrl, url, res, cb){
            if(support.length === 0)
                return cb("can not support audio!");
            var i;
            if(cc.loader.audioPath)
                realUrl = cc.path.join(cc.loader.audioPath, realUrl);
            var extname = cc.path.extname(realUrl);
            var typeList = [extname];
            for(i=0; i<support.length; i++){
                if(extname !== support[i]){
                    typeList.push(support[i]);
                }
            }
            var audio;
            if(loader.cache[url])
                return cb(null, loader.cache[url]);
            if(SWA){
                try{
                    var volume = context["createGain"]();
                    volume["gain"].value = 1;
                    volume["connect"](context["destination"]);
                    audio = new cc.Audio(context, volume, realUrl);
                    if(polyfill.NEED_MANUAL_LOOP)
                        audio._manualLoop = true;
                }catch(err){
                    SWA = false;
                    cc.log("browser don't support web audio");
                    audio = new cc.Audio(null, null, realUrl);
                }
            }else{
                audio = new cc.Audio(null, null, realUrl);
            }
            this.loadAudioFromExtList(realUrl, typeList, audio, cb);
            loader.cache[url] = audio;
        },
        loadAudioFromExtList: function(realUrl, typeList, audio, cb){
            if(typeList.length === 0){
                var ERRSTR = "can not found the resource of audio! Last match url is : ";
                ERRSTR += realUrl.replace(/\.(.*)?$/, "(");
                support.forEach(function(ext){
                    ERRSTR += ext + "|";
                });
                ERRSTR = ERRSTR.replace(/\|$/, ")");
                return cb({status:520, errorMessage:ERRSTR}, null);
            }
            realUrl = cc.path.changeExtname(realUrl, typeList.splice(0, 1));
            if(SWA){//Buffer
                if(polyfill.webAudioCallback)
                    polyfill.webAudioCallback(realUrl);
                var request = new XMLHttpRequest();
                request.open("GET", realUrl, true);
                request.responseType = "arraybuffer";
                request.onload = function () {
                    context["decodeAudioData"](request.response, function(buffer){
                        audio.setBuffer(buffer);
                        cb(null, audio);
                    }, function(){
                        loader.loadAudioFromExtList(realUrl, typeList, audio, cb);
                    });
                };
                request.onerror = function(){
                    cb({status:520, errorMessage:ERRSTR}, null);
                };
                request.send();
            }else{//DOM
                var element = document.createElement("audio");
                var cbCheck = false;
                var termination = false;
                var timer = setTimeout(function(){
                    if(element.readyState === 0){
                        emptied();
                    }else{
                        termination = true;
                        element.pause();
                        document.body.removeChild(element);
                        cb("audio load timeout : " + realUrl, audio);
                    }
                }, 10000);
                var success = function(){
                    if(!cbCheck){
                        try { element.currentTime = 0;
                            element.volume = 1; } catch (e) {}
                        document.body.removeChild(element);
                        audio.setElement(element);
                        element.removeEventListener("canplaythrough", success, false);
                        element.removeEventListener("error", failure, false);
                        element.removeEventListener("emptied", emptied, false);
                        !termination && cb(null, audio);
                        cbCheck = true;
                        clearTimeout(timer);
                    }
                };
                var failure = function(){
                    if(!cbCheck) return;
                    document.body.removeChild(element);
                    element.removeEventListener("canplaythrough", success, false);
                    element.removeEventListener("error", failure, false);
                    element.removeEventListener("emptied", emptied, false);
                    !termination && loader.loadAudioFromExtList(realUrl, typeList, audio, cb);
                    cbCheck = true;
                    clearTimeout(timer);
                };
                var emptied = function(){
                    termination = true;
                    success();
                    cb(null, audio);
                };
                element.addEventListener("canplaythrough", success, false);
                element.addEventListener("error", failure, false);
                if(polyfill.USE_EMPTIED_EVENT)
                    element.addEventListener("emptied", emptied, false);
                element.src = realUrl;
                document.body.appendChild(element);
                element.volume = 0;
            }
        }
    };
    cc.loader.register(["mp3", "ogg", "wav", "mp4", "m4a"], loader);
    cc.audioEngine = {
        _currMusic: null,
        _musicVolume: 1,
        features: polyfill,
        willPlayMusic: function(){return false;},
        playMusic: function(url, loop){
            var bgMusic = this._currMusic;
            if(bgMusic && bgMusic.src !== url && bgMusic.getPlaying()){
                bgMusic.stop();
            }
            var audio = loader.cache[url];
            if(!audio){
                cc.loader.load(url);
                audio = loader.cache[url];
            }
            audio.play(0, loop);
            audio.setVolume(this._musicVolume);
            this._currMusic = audio;
        },
        stopMusic: function(releaseData){
            var audio = this._currMusic;
            if(audio){
                audio.stop();
                if (releaseData)
                    cc.loader.release(audio.src);
            }
        },
        pauseMusic: function(){
            var audio = this._currMusic;
            if(audio)
                audio.pause();
        },
        resumeMusic: function(){
            var audio = this._currMusic;
            if(audio)
                audio.resume();
        },
        rewindMusic: function(){
            var audio = this._currMusic;
            if(audio){
                audio.stop();
                audio.play();
            }
        },
        getMusicVolume: function(){
            return this._musicVolume;
        },
        setMusicVolume: function(volume){
            volume = volume - 0;
            if(isNaN(volume)) volume = 1;
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;
            this._musicVolume = volume;
            var audio = this._currMusic;
            if(audio){
                audio.setVolume(volume);
            }
        },
        isMusicPlaying: function(){
            var audio = this._currMusic;
            if(audio){
                return audio.getPlaying();
            }else{
                return false;
            }
        },
        _audioPool: {},
        _maxAudioInstance: 5,
        _effectVolume: 1,
        playEffect: function(url, loop){
            if(!SWB){
                return null;
            }
            var effectList = this._audioPool[url];
            if(!effectList){
                effectList = this._audioPool[url] = [];
            }
            var i;
            for(i=0; i<effectList.length; i++){
                if(!effectList[i].getPlaying()){
                    break;
                }
            }
            if(effectList[i]){
                audio = effectList[i];
                audio.setVolume(this._effectVolume);
                audio.play(0, loop);
            }else if(!SWA && i > this._maxAudioInstance){
                cc.log("Error: %s greater than %d", url, this._maxAudioInstance);
            }else{
                var audio = loader.cache[url];
                if(!audio){
                    cc.loader.load(url);
                    audio = loader.cache[url];
                }
                audio = audio.cloneNode();
                audio.setVolume(this._effectVolume);
                audio.loop = loop || false;
                audio.play();
                effectList.push(audio);
            }
            return audio;
        },
        setEffectsVolume: function(volume){
            volume = volume - 0;
            if(isNaN(volume)) volume = 1;
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;
            this._effectVolume = volume;
            var audioPool = this._audioPool;
            for(var p in audioPool){
                var audioList = audioPool[p];
                if(Array.isArray(audioList))
                    for(var i=0; i<audioList.length; i++){
                        audioList[i].setVolume(volume);
                    }
            }
        },
        getEffectsVolume: function(){
            return this._effectVolume;
        },
        pauseEffect: function(audio){
            if(audio){
                audio.pause();
            }
        },
        pauseAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                    }
                }
            }
        },
        resumeEffect: function(audio){
            if(audio)
                audio.resume();
        },
        resumeAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    list[i].resume();
                }
            }
        },
        stopEffect: function(audio){
            if(audio)
                audio.stop();
        },
        stopAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    list[i].stop();
                }
            }
        },
        unloadEffect: function(url){
            if(!url){
                return;
            }
            cc.loader.release(url);
            var pool = this._audioPool[url];
            if(pool) pool.length = 0;
            delete this._audioPool[url];
            delete loader.cache[url];
        },
        end: function(){
            this.stopMusic();
            this.stopAllEffects();
        },
        _pauseCache: [],
        _pausePlaying: function(){
            var bgMusic = this._currMusic;
            if(bgMusic && bgMusic.getPlaying()){
                bgMusic.pause();
                this._pauseCache.push(bgMusic);
            }
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                        this._pauseCache.push(list[i]);
                    }
                }
            }
        },
        _resumePlaying: function(){
            var list = this._pauseCache;
            for(var i=0; i<list.length; i++){
                list[i].resume();
            }
            list.length = 0;
        }
    };
    if(!SWC){
        var reBGM = function(){
            var bg = cc.audioEngine._currMusic;
            if(
                bg &&
                bg._touch === false &&
                bg._playing &&
                bg.getPlaying()
            ){
                bg._touch = true;
                bg.play(0, bg.loop);
                !polyfill.REPLAY_AFTER_TOUCH && cc._canvas.removeEventListener("touchstart", reBGM);
            }
        };
        setTimeout(function(){
            if(cc._canvas){
                cc._canvas.addEventListener("touchstart", reBGM, false);
            }
        }, 150);
    }
})(window.__audioSupport);

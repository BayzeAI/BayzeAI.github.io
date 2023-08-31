"use strict";
(() => {
  // node_modules/bayze-gems-api/dist/esm/index.js
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var Strings;
  var language = typeof window !== "undefined" ? navigator.language : "";
  var StringMap = class {
  };
  var en_US = class extends StringMap {
    constructor() {
      super(...arguments);
      this.NO_BADGES = "No badges found.";
    }
  };
  var en_GB = class extends en_US {
  };
  var de_DE = class extends StringMap {
    constructor() {
      super(...arguments);
      this.NO_BADGES = "Keine Abzeichen gefunden.";
    }
  };
  function set(language2) {
    switch (language2) {
      default:
      case "en-US":
        Strings = new en_US();
        break;
      case "en-GB":
        Strings = new en_GB();
        break;
      case "de-DE":
        Strings = new de_DE();
        break;
    }
    return Strings;
  }
  Strings = set(language);
  Strings["set"] = set;
  var EffectsManager = class {
    static registerEffect(name, implementation) {
      this.effects[name] = implementation;
    }
    static startEffect(name, target, container) {
      this.effects[name].startEffect(target, container);
    }
    static stopEffect(name) {
      this.effects[name].stopEffect();
    }
  };
  EffectsManager.effects = {};
  if (typeof window !== "undefined") {
    window["EffectsManager"] = EffectsManager;
  }
  var Particle = class {
    constructor() {
      this.color = "";
      this.x = 0;
      this.y = 0;
      this.diameter = 0;
      this.tilt = 0;
      this.tiltAngleIncrement = 0;
      this.tiltAngle = 0;
    }
  };
  var _ConfettiEffect = class {
    static resetParticle(particle, width, height) {
      particle.color = this._colors[Math.random() * this._colors.length | 0];
      particle.x = Math.random() * width;
      particle.y = Math.random() * height - height;
      particle.diameter = Math.random() * 10 + 5;
      particle.tilt = Math.random() * 10 - 10;
      particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
      particle.tiltAngle = 0;
      return particle;
    }
    static _startConfettiInner() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let canvas = document.createElement("canvas");
      canvas.setAttribute("id", "confetti-canvas");
      canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none; position:fixed; top:0; left: 0;");
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, true);
      let context = canvas.getContext("2d");
      while (this.particles.length < this.maxParticleCount)
        this.particles.push(this.resetParticle(new Particle(), width, height));
      this.streamingConfetti = true;
      if (this.animationTimer === null) {
        const runAnimation = () => {
          context.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (this.particles.length === 0)
            this.animationTimer = null;
          else {
            this.updateParticles();
            this.drawParticles(context);
            this.animationTimer = window.requestAnimationFrame(runAnimation);
          }
        };
        runAnimation();
      }
    }
    static _stopConfettiInner() {
      this.streamingConfetti = false;
    }
    static drawParticles(context) {
      let particle;
      let x;
      for (var i = 0; i < this.particles.length; i++) {
        particle = this.particles[i];
        context.beginPath();
        context.lineWidth = particle.diameter;
        context.strokeStyle = particle.color;
        x = particle.x + particle.tilt;
        context.moveTo(x + particle.diameter / 2, particle.y);
        context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
        context.stroke();
      }
    }
    static updateParticles() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let particle;
      this.waveAngle += 0.01;
      for (var i = 0; i < this.particles.length; i++) {
        particle = this.particles[i];
        if (!this.streamingConfetti && particle.y < -15)
          particle.y = height + 100;
        else {
          particle.tiltAngle += particle.tiltAngleIncrement;
          particle.x += Math.sin(this.waveAngle);
          particle.y += (Math.cos(this.waveAngle) + particle.diameter + this.particleSpeed) * 0.5;
          particle.tilt = Math.sin(particle.tiltAngle) * 15;
        }
        if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
          if (this.streamingConfetti && this.particles.length <= this.maxParticleCount)
            this.resetParticle(particle, width, height);
          else {
            this.particles.splice(i, 1);
            i--;
          }
        }
      }
    }
    startEffect(target, container) {
      _ConfettiEffect._startConfettiInner();
    }
    stopEffect() {
      _ConfettiEffect._stopConfettiInner();
    }
  };
  var ConfettiEffect = _ConfettiEffect;
  ConfettiEffect._colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
  ConfettiEffect.streamingConfetti = false;
  ConfettiEffect.animationTimer = null;
  ConfettiEffect.particles = [];
  ConfettiEffect.waveAngle = 0;
  ConfettiEffect.maxParticleCount = 150;
  ConfettiEffect.particleSpeed = 2;
  var GEMS = class {
    static _debugOut(...args) {
      if (this._debug) {
        console.log(...args);
      }
    }
    static _getTime() {
      const time = new Date();
      const currentDate = time.toISOString().substring(0, 19);
      return currentDate;
    }
    static async _wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    static async _waitForNextEvent(element, name) {
      return new Promise((resolve) => {
        element.addEventListener(name, (e) => resolve(true), { once: true });
      });
    }
    static version() {
      return "0.3.1";
    }
    static debug(on) {
      this._debug = on;
      console.log("GEMS: debug: on, version: " + this.version());
    }
    static signOut(eraseCookie = false) {
      this.state = {};
      if (eraseCookie) {
        this._setCookie("gems-user-id", "", 365);
      }
    }
    static async init(params) {
      console.assert(!!params.appId, "params.appId should not be falsy");
      console.assert(!!params.apiKey, "params.apiKey should not be falsy");
      this.state = __spreadValues({}, params);
      delete this.state.apiKey;
      try {
        if (!params.userId && params.clearCookie) {
          this._setCookie("gems-user-id", "", 365);
        } else if (!params.userId && params.useCookie) {
          params.userId = this._getCookie("gems-user-id");
        }
        let url = this._root + "init/" + params.appId + (params.userId ? "/" + params.userId : "");
        const response = await this._fetch(url, {
          method: params.userId ? "GET" : "POST",
          headers: {
            apikey: params.apiKey
          }
        });
        const result = await response.json();
        this._debugOut("init: result: " + JSON.stringify(result));
        this.state.userId = result.user_id;
        this.state.token = result.token;
        if (params.useCookie) {
          this._setCookie("gems-user-id", this.state.userId, 365);
        }
        return {
          userId: this.state.userId,
          token: this.state.token
        };
      } catch (error) {
        console.error("GEMS API error:");
        console.error(error);
        throw error;
      }
    }
    static setClientCredentials(userId, token) {
      console.assert(userId, "need userId for setClientCredentials");
      console.assert(token, "need token for setClientCredentials");
      this.state.userId = userId;
      this.state.token = token;
    }
    static async event(name, data = {}, options = { displayFirst: true }) {
      var _a;
      let result;
      const body = {
        user_id: this.state.userId,
        tagName: name,
        localTime: this._getTime(),
        data
      };
      if (Object.keys(data).length === 1 && "value" in data) {
        delete body["data"];
        body["value"] = data.value;
      }
      try {
        const response = await this._fetch(this._root + "event", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + this.state.token,
            "Content-Type": "text/plain"
          },
          body: JSON.stringify(body)
        });
        result = await response.json();
        this._debugOut("event: result: " + JSON.stringify(result));
        if (typeof window !== "undefined" && ((_a = result == null ? void 0 : result.achievements) == null ? void 0 : _a.length) > 0) {
          if (options.displayAll) {
            this._debugOut("auto-displaying all achievements");
            for (let a of result.achievements) {
              await this.displayAchievement(a);
            }
          } else if (options.displayFirst) {
            this._debugOut("auto-displaying first achievement");
            if (result.achievements && result.achievements.length > 0) {
              await this.displayAchievement(result.achievements[0]);
            }
          }
        }
        return result.achievements;
      } catch (error) {
        console.error("GEMS API error:");
        console.error(error);
        return null;
      }
    }
    static async displayAchievement(achievement, options = {}) {
      var _a, _b, _c;
      const scrim = document.createElement("div");
      scrim.className = "GEMS-scrim";
      (_a = options.container) != null ? _a : options.container = document.body;
      options.container.appendChild(scrim);
      const frame = document.createElement("div");
      frame.className = "GEMS-achievement-frame";
      const title = document.createElement("h2");
      title.className = "GEMS-achievement-title";
      title.innerText = achievement.title;
      const image = document.createElement("img");
      image.className = "GEMS-achievement-image";
      image.addEventListener("load", (e) => {
        scrim.appendChild(frame);
      });
      image.src = achievement.image;
      const description = document.createElement("h3");
      description.className = "GEMS-achievement-description";
      description.innerText = achievement.description;
      frame.appendChild(title);
      frame.appendChild(image);
      frame.appendChild(description);
      const timerPromise = this._wait((_b = options.duration) != null ? _b : 5e3);
      const clickPromise = this._waitForNextEvent(scrim, "click");
      (_c = options.effects) != null ? _c : options.effects = ["confetti"];
      for (const effect of options.effects) {
        this._debugOut("playing effect: " + effect);
        EffectsManager.startEffect(effect, options.centerOn, options.container);
      }
      await Promise.race([timerPromise, clickPromise]);
      for (const effect of options.effects) {
        EffectsManager.stopEffect(effect);
      }
      scrim.remove();
    }
    static async getAllBadges() {
      let result;
      try {
        if (!this.state.token) {
          throw new Error("getAllBadges: Token is missing");
        }
        const response = await this._fetch(this._root + "badges", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            Accept: "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`getAllBadges: HTTP error: Status: ${response.status}`);
        }
        result = await response.json();
        this._debugOut("getAllBadges: result: " + JSON.stringify(result));
        result != null ? result : result = [];
        return result;
      } catch (error) {
        console.error("GEMS API error: ");
        console.log(error);
        throw error;
      }
    }
    static async displayBadges(badges2, options = {}) {
      var _a, _b;
      const scrim = document.createElement("div");
      scrim.className = "GEMS-scrim";
      (_a = options.container) != null ? _a : options.container = document.body;
      options.container.appendChild(scrim);
      const frame = document.createElement("div");
      frame.className = "GEMS-badges-frame";
      if (badges2.length === 0) {
        const message = document.createElement("h2");
        message.innerText = Strings.NO_BADGES;
        frame.appendChild(message);
      } else {
        badges2.forEach((badge) => {
          const imageContainer = document.createElement("div");
          imageContainer.className = "GEMS-badge-image-container";
          const image = document.createElement("img");
          image.className = "GEMS-badge-image";
          image.src = badge.image;
          const title = document.createElement("h2");
          title.className = "GEMS-badge-title";
          title.innerText = badge.name;
          const description = document.createElement("h3");
          description.className = "GEMS-badge-description";
          description.innerText = badge.description;
          imageContainer.appendChild(image);
          imageContainer.appendChild(title);
          imageContainer.appendChild(description);
          if (badge.unlockedDate === "") {
            imageContainer.classList.add("GEMS-badge-image-unearned");
          }
          frame.appendChild(imageContainer);
        });
      }
      scrim.appendChild(frame);
      const timerPromise = this._wait((_b = options.duration) != null ? _b : 5e4);
      const clickPromise = this._waitForNextEvent(scrim, "click");
      await Promise.race([timerPromise, clickPromise]);
      scrim.remove();
    }
    static async displayAllBadges() {
      const result = await this.getAllBadges();
      return this.displayBadges(result);
    }
    static async _fetch(url, init) {
      var _a;
      this._debugOut("fetch: " + init.method + ": " + url);
      this._debugOut("    headers: " + JSON.stringify(init.headers));
      this._debugOut("    body   : " + JSON.stringify(init.body));
      let response;
      try {
        if (typeof window !== "undefined") {
          response = fetch(url, init);
        } else {
          const f = (_a = this.state.fetch) != null ? _a : globalThis.fetch;
          if (!f) {
            throw new Error("platform is lacking access to fetch function");
          }
          response = f(url, init);
        }
      } catch (error) {
        console.log("fetch: error response: " + error);
        throw error;
      }
      return response;
    }
    static _setCookie(cname, cvalue, exdays) {
      exdays = cvalue ? exdays : 0;
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    static _getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          let value = c.substring(name.length, c.length);
          if (value === "undefined") {
            value = "";
          }
          return value;
        }
      }
      return "";
    }
  };
  GEMS._root = "https://gemsapi.bayz.ai/user/";
  GEMS.state = {};
  GEMS._debug = false;
  GEMS.EffectsManager = EffectsManager;
  function _createStyle() {
    const style = document.createElement("style");
    const css = `
    .GEMS-scrim {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .GEMS-achievement-frame {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 5px;
        box-shadow: '4px 8px 36px #F4AAB9';
        background-color: white;
        width:600px;
        height: 400px;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    .GEMS-achievement-title {
        margin: 10px;
    }
    
    .GEMS-achievement-image {
        height: 70%;
        border-radius: 5px;
        box-shadow: '4px 8px 36px #F4AAB9';
    }
    
    .GEMS-achievement-description {
        margin: 10px;
    }

    .GEMS-badges-frame {
        display: flex;
        background-color: white;
        width: fit-content;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        border-radius: 5px;
        padding: 40px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .GEMS-badge-image-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 170px;
        margin-bottom: 5px;
    }

    .GEMS-badge-image {
        width: 100px;
        height: auto;
    }

    .GEMS-badge-image-container:hover {
        scale: 120%;
        transform-origin: center center;
    }


    .GEMS-badge-title {
        padding-top: 0.4rem;
        font-size: .8rem;
        color: rgb(91, 90, 90);
        text-transform: uppercase;
    }

    .GEMS-badge-description {
        font-size: .4rem;
        opacity: 60%;
        max-width: 50%;
        text-align: center;
    }

    .GEMS-badge-image-unearned {
        opacity: 0.5;
        filter: grayscale(80%);
    }

    .GEMS-badge-image-unearned:hover {
        opacity: 0.7;

    }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  if (typeof window !== "undefined") {
    _createStyle();
    EffectsManager.registerEffect("confetti", new ConfettiEffect());
  }

  // index.ts
  var scoreSpan = document.querySelector("#score");
  var startButton = document.querySelector("#start");
  var playButton = document.querySelector("#play");
  var scoreBox = document.querySelector("#scorebox");
  var finishButton = document.querySelector("#finish");
  var badgesButton = document.querySelector("#badges");
  var versionSpan = document.querySelector("#version");
  startButton.addEventListener("click", start);
  playButton.addEventListener("click", score);
  finishButton.addEventListener("click", finish);
  badgesButton.addEventListener("click", badges);
  versionSpan.innerText = GEMS.version();
  var apiKey = "i2slulN)U%7xvMoVACLSEYogOekNQoWE";
  var appId = "37675ac8-c0c0-42e9-8291-0f9529df5d47";
  GEMS.init({ apiKey, appId }).then(() => {
    GEMS.event("Demo-GamePage");
    startButton.disabled = false;
  });
  function start() {
    GEMS.event("Demo-GameStarted");
    scoreSpan.innerText = "0";
    playButton.disabled = false;
    scoreBox.disabled = false;
    startButton.disabled = true;
  }
  function score() {
    let n = Number(scoreSpan.innerText);
    let nNew = Number(scoreBox.value);
    if (isNaN(nNew)) {
      nNew = 0;
    }
    n += nNew;
    scoreSpan.innerText = String(n);
    finishButton.disabled = false;
  }
  function finish() {
    GEMS.event("Demo-GameFinished", { value: Number(scoreSpan.innerText) });
    playButton.disabled = true;
    scoreBox.disabled = true;
    finishButton.disabled = true;
    startButton.disabled = false;
  }
  function badges() {
    GEMS.displayAllBadges();
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL2JheXplLWdlbXMtYXBpL2Rpc3QvZXNtL2luZGV4LmpzIiwgImluZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ2YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19wcm9wSXNFbnVtID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBfX2RlZk5vcm1hbFByb3AgPSAob2JqLCBrZXksIHZhbHVlKSA9PiBrZXkgaW4gb2JqID8gX19kZWZQcm9wKG9iaiwga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlIH0pIDogb2JqW2tleV0gPSB2YWx1ZTtcbnZhciBfX3NwcmVhZFZhbHVlcyA9IChhLCBiKSA9PiB7XG4gIGZvciAodmFyIHByb3AgaW4gYiB8fCAoYiA9IHt9KSlcbiAgICBpZiAoX19oYXNPd25Qcm9wLmNhbGwoYiwgcHJvcCkpXG4gICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gIGlmIChfX2dldE93blByb3BTeW1ib2xzKVxuICAgIGZvciAodmFyIHByb3Agb2YgX19nZXRPd25Qcm9wU3ltYm9scyhiKSkge1xuICAgICAgaWYgKF9fcHJvcElzRW51bS5jYWxsKGIsIHByb3ApKVxuICAgICAgICBfX2RlZk5vcm1hbFByb3AoYSwgcHJvcCwgYltwcm9wXSk7XG4gICAgfVxuICByZXR1cm4gYTtcbn07XG5cbi8vIHNyYy9zdHJpbmdzLnRzXG52YXIgU3RyaW5ncztcbnZhciBsYW5ndWFnZSA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyBuYXZpZ2F0b3IubGFuZ3VhZ2UgOiBcIlwiO1xudmFyIFN0cmluZ01hcCA9IGNsYXNzIHtcbn07XG52YXIgZW5fVVMgPSBjbGFzcyBleHRlbmRzIFN0cmluZ01hcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgdGhpcy5OT19CQURHRVMgPSBcIk5vIGJhZGdlcyBmb3VuZC5cIjtcbiAgfVxufTtcbnZhciBlbl9HQiA9IGNsYXNzIGV4dGVuZHMgZW5fVVMge1xufTtcbnZhciBkZV9ERSA9IGNsYXNzIGV4dGVuZHMgU3RyaW5nTWFwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICB0aGlzLk5PX0JBREdFUyA9IFwiS2VpbmUgQWJ6ZWljaGVuIGdlZnVuZGVuLlwiO1xuICB9XG59O1xuZnVuY3Rpb24gc2V0KGxhbmd1YWdlMikge1xuICBzd2l0Y2ggKGxhbmd1YWdlMikge1xuICAgIGRlZmF1bHQ6XG4gICAgY2FzZSBcImVuLVVTXCI6XG4gICAgICBTdHJpbmdzID0gbmV3IGVuX1VTKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZW4tR0JcIjpcbiAgICAgIFN0cmluZ3MgPSBuZXcgZW5fR0IoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZS1ERVwiOlxuICAgICAgU3RyaW5ncyA9IG5ldyBkZV9ERSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIFN0cmluZ3M7XG59XG5TdHJpbmdzID0gc2V0KGxhbmd1YWdlKTtcblN0cmluZ3NbXCJzZXRcIl0gPSBzZXQ7XG5cbi8vIHNyYy9lZmZlY3RzLW1hbmFnZXIudHNcbnZhciBFZmZlY3RzTWFuYWdlciA9IGNsYXNzIHtcbiAgc3RhdGljIHJlZ2lzdGVyRWZmZWN0KG5hbWUsIGltcGxlbWVudGF0aW9uKSB7XG4gICAgdGhpcy5lZmZlY3RzW25hbWVdID0gaW1wbGVtZW50YXRpb247XG4gIH1cbiAgc3RhdGljIHN0YXJ0RWZmZWN0KG5hbWUsIHRhcmdldCwgY29udGFpbmVyKSB7XG4gICAgdGhpcy5lZmZlY3RzW25hbWVdLnN0YXJ0RWZmZWN0KHRhcmdldCwgY29udGFpbmVyKTtcbiAgfVxuICBzdGF0aWMgc3RvcEVmZmVjdChuYW1lKSB7XG4gICAgdGhpcy5lZmZlY3RzW25hbWVdLnN0b3BFZmZlY3QoKTtcbiAgfVxufTtcbkVmZmVjdHNNYW5hZ2VyLmVmZmVjdHMgPSB7fTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIHdpbmRvd1tcIkVmZmVjdHNNYW5hZ2VyXCJdID0gRWZmZWN0c01hbmFnZXI7XG59XG5cbi8vIHNyYy9lZmZlY3RzLWNvbmZldHRpLnRzXG52YXIgUGFydGljbGUgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSBcIlwiO1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLmRpYW1ldGVyID0gMDtcbiAgICB0aGlzLnRpbHQgPSAwO1xuICAgIHRoaXMudGlsdEFuZ2xlSW5jcmVtZW50ID0gMDtcbiAgICB0aGlzLnRpbHRBbmdsZSA9IDA7XG4gIH1cbn07XG52YXIgX0NvbmZldHRpRWZmZWN0ID0gY2xhc3Mge1xuICBzdGF0aWMgcmVzZXRQYXJ0aWNsZShwYXJ0aWNsZSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHBhcnRpY2xlLmNvbG9yID0gdGhpcy5fY29sb3JzW01hdGgucmFuZG9tKCkgKiB0aGlzLl9jb2xvcnMubGVuZ3RoIHwgMF07XG4gICAgcGFydGljbGUueCA9IE1hdGgucmFuZG9tKCkgKiB3aWR0aDtcbiAgICBwYXJ0aWNsZS55ID0gTWF0aC5yYW5kb20oKSAqIGhlaWdodCAtIGhlaWdodDtcbiAgICBwYXJ0aWNsZS5kaWFtZXRlciA9IE1hdGgucmFuZG9tKCkgKiAxMCArIDU7XG4gICAgcGFydGljbGUudGlsdCA9IE1hdGgucmFuZG9tKCkgKiAxMCAtIDEwO1xuICAgIHBhcnRpY2xlLnRpbHRBbmdsZUluY3JlbWVudCA9IE1hdGgucmFuZG9tKCkgKiAwLjA3ICsgMC4wNTtcbiAgICBwYXJ0aWNsZS50aWx0QW5nbGUgPSAwO1xuICAgIHJldHVybiBwYXJ0aWNsZTtcbiAgfVxuICBzdGF0aWMgX3N0YXJ0Q29uZmV0dGlJbm5lcigpIHtcbiAgICBsZXQgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImNvbmZldHRpLWNhbnZhc1wiKTtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrO3otaW5kZXg6OTk5OTk5O3BvaW50ZXItZXZlbnRzOm5vbmU7IHBvc2l0aW9uOmZpeGVkOyB0b3A6MDsgbGVmdDogMDtcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfSwgdHJ1ZSk7XG4gICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIHdoaWxlICh0aGlzLnBhcnRpY2xlcy5sZW5ndGggPCB0aGlzLm1heFBhcnRpY2xlQ291bnQpXG4gICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHRoaXMucmVzZXRQYXJ0aWNsZShuZXcgUGFydGljbGUoKSwgd2lkdGgsIGhlaWdodCkpO1xuICAgIHRoaXMuc3RyZWFtaW5nQ29uZmV0dGkgPSB0cnVlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvblRpbWVyID09PSBudWxsKSB7XG4gICAgICBjb25zdCBydW5BbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlcyhjb250ZXh0KTtcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRpbWVyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShydW5BbmltYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcnVuQW5pbWF0aW9uKCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBfc3RvcENvbmZldHRpSW5uZXIoKSB7XG4gICAgdGhpcy5zdHJlYW1pbmdDb25mZXR0aSA9IGZhbHNlO1xuICB9XG4gIHN0YXRpYyBkcmF3UGFydGljbGVzKGNvbnRleHQpIHtcbiAgICBsZXQgcGFydGljbGU7XG4gICAgbGV0IHg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHBhcnRpY2xlLmRpYW1ldGVyO1xuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IHBhcnRpY2xlLmNvbG9yO1xuICAgICAgeCA9IHBhcnRpY2xlLnggKyBwYXJ0aWNsZS50aWx0O1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCArIHBhcnRpY2xlLmRpYW1ldGVyIC8gMiwgcGFydGljbGUueSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyh4LCBwYXJ0aWNsZS55ICsgcGFydGljbGUudGlsdCArIHBhcnRpY2xlLmRpYW1ldGVyIC8gMik7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgdXBkYXRlUGFydGljbGVzKCkge1xuICAgIGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHBhcnRpY2xlO1xuICAgIHRoaXMud2F2ZUFuZ2xlICs9IDAuMDE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcbiAgICAgIGlmICghdGhpcy5zdHJlYW1pbmdDb25mZXR0aSAmJiBwYXJ0aWNsZS55IDwgLTE1KVxuICAgICAgICBwYXJ0aWNsZS55ID0gaGVpZ2h0ICsgMTAwO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHBhcnRpY2xlLnRpbHRBbmdsZSArPSBwYXJ0aWNsZS50aWx0QW5nbGVJbmNyZW1lbnQ7XG4gICAgICAgIHBhcnRpY2xlLnggKz0gTWF0aC5zaW4odGhpcy53YXZlQW5nbGUpO1xuICAgICAgICBwYXJ0aWNsZS55ICs9IChNYXRoLmNvcyh0aGlzLndhdmVBbmdsZSkgKyBwYXJ0aWNsZS5kaWFtZXRlciArIHRoaXMucGFydGljbGVTcGVlZCkgKiAwLjU7XG4gICAgICAgIHBhcnRpY2xlLnRpbHQgPSBNYXRoLnNpbihwYXJ0aWNsZS50aWx0QW5nbGUpICogMTU7XG4gICAgICB9XG4gICAgICBpZiAocGFydGljbGUueCA+IHdpZHRoICsgMjAgfHwgcGFydGljbGUueCA8IC0yMCB8fCBwYXJ0aWNsZS55ID4gaGVpZ2h0KSB7XG4gICAgICAgIGlmICh0aGlzLnN0cmVhbWluZ0NvbmZldHRpICYmIHRoaXMucGFydGljbGVzLmxlbmd0aCA8PSB0aGlzLm1heFBhcnRpY2xlQ291bnQpXG4gICAgICAgICAgdGhpcy5yZXNldFBhcnRpY2xlKHBhcnRpY2xlLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBzdGFydEVmZmVjdCh0YXJnZXQsIGNvbnRhaW5lcikge1xuICAgIF9Db25mZXR0aUVmZmVjdC5fc3RhcnRDb25mZXR0aUlubmVyKCk7XG4gIH1cbiAgc3RvcEVmZmVjdCgpIHtcbiAgICBfQ29uZmV0dGlFZmZlY3QuX3N0b3BDb25mZXR0aUlubmVyKCk7XG4gIH1cbn07XG52YXIgQ29uZmV0dGlFZmZlY3QgPSBfQ29uZmV0dGlFZmZlY3Q7XG5Db25mZXR0aUVmZmVjdC5fY29sb3JzID0gW1wiRG9kZ2VyQmx1ZVwiLCBcIk9saXZlRHJhYlwiLCBcIkdvbGRcIiwgXCJQaW5rXCIsIFwiU2xhdGVCbHVlXCIsIFwiTGlnaHRCbHVlXCIsIFwiVmlvbGV0XCIsIFwiUGFsZUdyZWVuXCIsIFwiU3RlZWxCbHVlXCIsIFwiU2FuZHlCcm93blwiLCBcIkNob2NvbGF0ZVwiLCBcIkNyaW1zb25cIl07XG5Db25mZXR0aUVmZmVjdC5zdHJlYW1pbmdDb25mZXR0aSA9IGZhbHNlO1xuQ29uZmV0dGlFZmZlY3QuYW5pbWF0aW9uVGltZXIgPSBudWxsO1xuQ29uZmV0dGlFZmZlY3QucGFydGljbGVzID0gW107XG5Db25mZXR0aUVmZmVjdC53YXZlQW5nbGUgPSAwO1xuQ29uZmV0dGlFZmZlY3QubWF4UGFydGljbGVDb3VudCA9IDE1MDtcbkNvbmZldHRpRWZmZWN0LnBhcnRpY2xlU3BlZWQgPSAyO1xuXG4vLyBzcmMvZ2Vtcy50c1xudmFyIEdFTVMgPSBjbGFzcyB7XG4gIHN0YXRpYyBfZGVidWdPdXQoLi4uYXJncykge1xuICAgIGlmICh0aGlzLl9kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBfZ2V0VGltZSgpIHtcbiAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHRpbWUudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTkpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZTtcbiAgfVxuICBzdGF0aWMgYXN5bmMgX3dhaXQobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbiAgfVxuICBzdGF0aWMgYXN5bmMgX3dhaXRGb3JOZXh0RXZlbnQoZWxlbWVudCwgbmFtZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIChlKSA9PiByZXNvbHZlKHRydWUpLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIFwiMC4zLjFcIjtcbiAgfVxuICBzdGF0aWMgZGVidWcob24pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IG9uO1xuICAgIGNvbnNvbGUubG9nKFwiR0VNUzogZGVidWc6IG9uLCB2ZXJzaW9uOiBcIiArIHRoaXMudmVyc2lvbigpKTtcbiAgfVxuICBzdGF0aWMgc2lnbk91dChlcmFzZUNvb2tpZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIGlmIChlcmFzZUNvb2tpZSkge1xuICAgICAgdGhpcy5fc2V0Q29va2llKFwiZ2Vtcy11c2VyLWlkXCIsIFwiXCIsIDM2NSk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBhc3luYyBpbml0KHBhcmFtcykge1xuICAgIGNvbnNvbGUuYXNzZXJ0KCEhcGFyYW1zLmFwcElkLCBcInBhcmFtcy5hcHBJZCBzaG91bGQgbm90IGJlIGZhbHN5XCIpO1xuICAgIGNvbnNvbGUuYXNzZXJ0KCEhcGFyYW1zLmFwaUtleSwgXCJwYXJhbXMuYXBpS2V5IHNob3VsZCBub3QgYmUgZmFsc3lcIik7XG4gICAgdGhpcy5zdGF0ZSA9IF9fc3ByZWFkVmFsdWVzKHt9LCBwYXJhbXMpO1xuICAgIGRlbGV0ZSB0aGlzLnN0YXRlLmFwaUtleTtcbiAgICB0cnkge1xuICAgICAgaWYgKCFwYXJhbXMudXNlcklkICYmIHBhcmFtcy5jbGVhckNvb2tpZSkge1xuICAgICAgICB0aGlzLl9zZXRDb29raWUoXCJnZW1zLXVzZXItaWRcIiwgXCJcIiwgMzY1KTtcbiAgICAgIH0gZWxzZSBpZiAoIXBhcmFtcy51c2VySWQgJiYgcGFyYW1zLnVzZUNvb2tpZSkge1xuICAgICAgICBwYXJhbXMudXNlcklkID0gdGhpcy5fZ2V0Q29va2llKFwiZ2Vtcy11c2VyLWlkXCIpO1xuICAgICAgfVxuICAgICAgbGV0IHVybCA9IHRoaXMuX3Jvb3QgKyBcImluaXQvXCIgKyBwYXJhbXMuYXBwSWQgKyAocGFyYW1zLnVzZXJJZCA/IFwiL1wiICsgcGFyYW1zLnVzZXJJZCA6IFwiXCIpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9mZXRjaCh1cmwsIHtcbiAgICAgICAgbWV0aG9kOiBwYXJhbXMudXNlcklkID8gXCJHRVRcIiA6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgYXBpa2V5OiBwYXJhbXMuYXBpS2V5XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhpcy5fZGVidWdPdXQoXCJpbml0OiByZXN1bHQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICB0aGlzLnN0YXRlLnVzZXJJZCA9IHJlc3VsdC51c2VyX2lkO1xuICAgICAgdGhpcy5zdGF0ZS50b2tlbiA9IHJlc3VsdC50b2tlbjtcbiAgICAgIGlmIChwYXJhbXMudXNlQ29va2llKSB7XG4gICAgICAgIHRoaXMuX3NldENvb2tpZShcImdlbXMtdXNlci1pZFwiLCB0aGlzLnN0YXRlLnVzZXJJZCwgMzY1KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZXJJZDogdGhpcy5zdGF0ZS51c2VySWQsXG4gICAgICAgIHRva2VuOiB0aGlzLnN0YXRlLnRva2VuXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiR0VNUyBBUEkgZXJyb3I6XCIpO1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbiAgc3RhdGljIHNldENsaWVudENyZWRlbnRpYWxzKHVzZXJJZCwgdG9rZW4pIHtcbiAgICBjb25zb2xlLmFzc2VydCh1c2VySWQsIFwibmVlZCB1c2VySWQgZm9yIHNldENsaWVudENyZWRlbnRpYWxzXCIpO1xuICAgIGNvbnNvbGUuYXNzZXJ0KHRva2VuLCBcIm5lZWQgdG9rZW4gZm9yIHNldENsaWVudENyZWRlbnRpYWxzXCIpO1xuICAgIHRoaXMuc3RhdGUudXNlcklkID0gdXNlcklkO1xuICAgIHRoaXMuc3RhdGUudG9rZW4gPSB0b2tlbjtcbiAgfVxuICBzdGF0aWMgYXN5bmMgZXZlbnQobmFtZSwgZGF0YSA9IHt9LCBvcHRpb25zID0geyBkaXNwbGF5Rmlyc3Q6IHRydWUgfSkge1xuICAgIHZhciBfYTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICB1c2VyX2lkOiB0aGlzLnN0YXRlLnVzZXJJZCxcbiAgICAgIHRhZ05hbWU6IG5hbWUsXG4gICAgICBsb2NhbFRpbWU6IHRoaXMuX2dldFRpbWUoKSxcbiAgICAgIGRhdGFcbiAgICB9O1xuICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT09IDEgJiYgXCJ2YWx1ZVwiIGluIGRhdGEpIHtcbiAgICAgIGRlbGV0ZSBib2R5W1wiZGF0YVwiXTtcbiAgICAgIGJvZHlbXCJ2YWx1ZVwiXSA9IGRhdGEudmFsdWU7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2ZldGNoKHRoaXMuX3Jvb3QgKyBcImV2ZW50XCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMuc3RhdGUudG9rZW4sXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3BsYWluXCJcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhpcy5fZGVidWdPdXQoXCJldmVudDogcmVzdWx0OiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgKChfYSA9IHJlc3VsdCA9PSBudWxsID8gdm9pZCAwIDogcmVzdWx0LmFjaGlldmVtZW50cykgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmRpc3BsYXlBbGwpIHtcbiAgICAgICAgICB0aGlzLl9kZWJ1Z091dChcImF1dG8tZGlzcGxheWluZyBhbGwgYWNoaWV2ZW1lbnRzXCIpO1xuICAgICAgICAgIGZvciAobGV0IGEgb2YgcmVzdWx0LmFjaGlldmVtZW50cykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNwbGF5QWNoaWV2ZW1lbnQoYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGlzcGxheUZpcnN0KSB7XG4gICAgICAgICAgdGhpcy5fZGVidWdPdXQoXCJhdXRvLWRpc3BsYXlpbmcgZmlyc3QgYWNoaWV2ZW1lbnRcIik7XG4gICAgICAgICAgaWYgKHJlc3VsdC5hY2hpZXZlbWVudHMgJiYgcmVzdWx0LmFjaGlldmVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc3BsYXlBY2hpZXZlbWVudChyZXN1bHQuYWNoaWV2ZW1lbnRzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQuYWNoaWV2ZW1lbnRzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiR0VNUyBBUEkgZXJyb3I6XCIpO1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGFzeW5jIGRpc3BsYXlBY2hpZXZlbWVudChhY2hpZXZlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3Qgc2NyaW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHNjcmltLmNsYXNzTmFtZSA9IFwiR0VNUy1zY3JpbVwiO1xuICAgIChfYSA9IG9wdGlvbnMuY29udGFpbmVyKSAhPSBudWxsID8gX2EgOiBvcHRpb25zLmNvbnRhaW5lciA9IGRvY3VtZW50LmJvZHk7XG4gICAgb3B0aW9ucy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2NyaW0pO1xuICAgIGNvbnN0IGZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBmcmFtZS5jbGFzc05hbWUgPSBcIkdFTVMtYWNoaWV2ZW1lbnQtZnJhbWVcIjtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcbiAgICB0aXRsZS5jbGFzc05hbWUgPSBcIkdFTVMtYWNoaWV2ZW1lbnQtdGl0bGVcIjtcbiAgICB0aXRsZS5pbm5lclRleHQgPSBhY2hpZXZlbWVudC50aXRsZTtcbiAgICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaW1hZ2UuY2xhc3NOYW1lID0gXCJHRU1TLWFjaGlldmVtZW50LWltYWdlXCI7XG4gICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKGUpID0+IHtcbiAgICAgIHNjcmltLmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICB9KTtcbiAgICBpbWFnZS5zcmMgPSBhY2hpZXZlbWVudC5pbWFnZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgICBkZXNjcmlwdGlvbi5jbGFzc05hbWUgPSBcIkdFTVMtYWNoaWV2ZW1lbnQtZGVzY3JpcHRpb25cIjtcbiAgICBkZXNjcmlwdGlvbi5pbm5lclRleHQgPSBhY2hpZXZlbWVudC5kZXNjcmlwdGlvbjtcbiAgICBmcmFtZS5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgZnJhbWUuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuICAgIGZyYW1lLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICBjb25zdCB0aW1lclByb21pc2UgPSB0aGlzLl93YWl0KChfYiA9IG9wdGlvbnMuZHVyYXRpb24pICE9IG51bGwgPyBfYiA6IDVlMyk7XG4gICAgY29uc3QgY2xpY2tQcm9taXNlID0gdGhpcy5fd2FpdEZvck5leHRFdmVudChzY3JpbSwgXCJjbGlja1wiKTtcbiAgICAoX2MgPSBvcHRpb25zLmVmZmVjdHMpICE9IG51bGwgPyBfYyA6IG9wdGlvbnMuZWZmZWN0cyA9IFtcImNvbmZldHRpXCJdO1xuICAgIGZvciAoY29uc3QgZWZmZWN0IG9mIG9wdGlvbnMuZWZmZWN0cykge1xuICAgICAgdGhpcy5fZGVidWdPdXQoXCJwbGF5aW5nIGVmZmVjdDogXCIgKyBlZmZlY3QpO1xuICAgICAgRWZmZWN0c01hbmFnZXIuc3RhcnRFZmZlY3QoZWZmZWN0LCBvcHRpb25zLmNlbnRlck9uLCBvcHRpb25zLmNvbnRhaW5lcik7XG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UucmFjZShbdGltZXJQcm9taXNlLCBjbGlja1Byb21pc2VdKTtcbiAgICBmb3IgKGNvbnN0IGVmZmVjdCBvZiBvcHRpb25zLmVmZmVjdHMpIHtcbiAgICAgIEVmZmVjdHNNYW5hZ2VyLnN0b3BFZmZlY3QoZWZmZWN0KTtcbiAgICB9XG4gICAgc2NyaW0ucmVtb3ZlKCk7XG4gIH1cbiAgc3RhdGljIGFzeW5jIGdldEFsbEJhZGdlcygpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUudG9rZW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0QWxsQmFkZ2VzOiBUb2tlbiBpcyBtaXNzaW5nXCIpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9mZXRjaCh0aGlzLl9yb290ICsgXCJiYWRnZXNcIiwge1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dGhpcy5zdGF0ZS50b2tlbn1gLFxuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZ2V0QWxsQmFkZ2VzOiBIVFRQIGVycm9yOiBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhpcy5fZGVidWdPdXQoXCJnZXRBbGxCYWRnZXM6IHJlc3VsdDogXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgIHJlc3VsdCAhPSBudWxsID8gcmVzdWx0IDogcmVzdWx0ID0gW107XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiR0VNUyBBUEkgZXJyb3I6IFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgYXN5bmMgZGlzcGxheUJhZGdlcyhiYWRnZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3Qgc2NyaW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHNjcmltLmNsYXNzTmFtZSA9IFwiR0VNUy1zY3JpbVwiO1xuICAgIChfYSA9IG9wdGlvbnMuY29udGFpbmVyKSAhPSBudWxsID8gX2EgOiBvcHRpb25zLmNvbnRhaW5lciA9IGRvY3VtZW50LmJvZHk7XG4gICAgb3B0aW9ucy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2NyaW0pO1xuICAgIGNvbnN0IGZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBmcmFtZS5jbGFzc05hbWUgPSBcIkdFTVMtYmFkZ2VzLWZyYW1lXCI7XG4gICAgaWYgKGJhZGdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgICBtZXNzYWdlLmlubmVyVGV4dCA9IFN0cmluZ3MuTk9fQkFER0VTO1xuICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhZGdlcy5mb3JFYWNoKChiYWRnZSkgPT4ge1xuICAgICAgICBjb25zdCBpbWFnZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGltYWdlQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiR0VNUy1iYWRnZS1pbWFnZS1jb250YWluZXJcIjtcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBpbWFnZS5jbGFzc05hbWUgPSBcIkdFTVMtYmFkZ2UtaW1hZ2VcIjtcbiAgICAgICAgaW1hZ2Uuc3JjID0gYmFkZ2UuaW1hZ2U7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcIkdFTVMtYmFkZ2UtdGl0bGVcIjtcbiAgICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gYmFkZ2UubmFtZTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIGRlc2NyaXB0aW9uLmNsYXNzTmFtZSA9IFwiR0VNUy1iYWRnZS1kZXNjcmlwdGlvblwiO1xuICAgICAgICBkZXNjcmlwdGlvbi5pbm5lclRleHQgPSBiYWRnZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgaW1hZ2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuICAgICAgICBpbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIGltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgaWYgKGJhZGdlLnVubG9ja2VkRGF0ZSA9PT0gXCJcIikge1xuICAgICAgICAgIGltYWdlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJHRU1TLWJhZGdlLWltYWdlLXVuZWFybmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGltYWdlQ29udGFpbmVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBzY3JpbS5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgY29uc3QgdGltZXJQcm9taXNlID0gdGhpcy5fd2FpdCgoX2IgPSBvcHRpb25zLmR1cmF0aW9uKSAhPSBudWxsID8gX2IgOiA1ZTQpO1xuICAgIGNvbnN0IGNsaWNrUHJvbWlzZSA9IHRoaXMuX3dhaXRGb3JOZXh0RXZlbnQoc2NyaW0sIFwiY2xpY2tcIik7XG4gICAgYXdhaXQgUHJvbWlzZS5yYWNlKFt0aW1lclByb21pc2UsIGNsaWNrUHJvbWlzZV0pO1xuICAgIHNjcmltLnJlbW92ZSgpO1xuICB9XG4gIHN0YXRpYyBhc3luYyBkaXNwbGF5QWxsQmFkZ2VzKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZ2V0QWxsQmFkZ2VzKCk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheUJhZGdlcyhyZXN1bHQpO1xuICB9XG4gIHN0YXRpYyBhc3luYyBfZmV0Y2godXJsLCBpbml0KSB7XG4gICAgdmFyIF9hO1xuICAgIHRoaXMuX2RlYnVnT3V0KFwiZmV0Y2g6IFwiICsgaW5pdC5tZXRob2QgKyBcIjogXCIgKyB1cmwpO1xuICAgIHRoaXMuX2RlYnVnT3V0KFwiICAgIGhlYWRlcnM6IFwiICsgSlNPTi5zdHJpbmdpZnkoaW5pdC5oZWFkZXJzKSk7XG4gICAgdGhpcy5fZGVidWdPdXQoXCIgICAgYm9keSAgIDogXCIgKyBKU09OLnN0cmluZ2lmeShpbml0LmJvZHkpKTtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJlc3BvbnNlID0gZmV0Y2godXJsLCBpbml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGYgPSAoX2EgPSB0aGlzLnN0YXRlLmZldGNoKSAhPSBudWxsID8gX2EgOiBnbG9iYWxUaGlzLmZldGNoO1xuICAgICAgICBpZiAoIWYpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF0Zm9ybSBpcyBsYWNraW5nIGFjY2VzcyB0byBmZXRjaCBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IGYodXJsLCBpbml0KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJmZXRjaDogZXJyb3IgcmVzcG9uc2U6IFwiICsgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuICBzdGF0aWMgX3NldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcbiAgICBleGRheXMgPSBjdmFsdWUgPyBleGRheXMgOiAwO1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDFlMyk7XG4gICAgbGV0IGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvVVRDU3RyaW5nKCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyBcIj1cIiArIGN2YWx1ZSArIFwiO1wiICsgZXhwaXJlcyArIFwiO3BhdGg9L1wiO1xuICB9XG4gIHN0YXRpYyBfZ2V0Q29va2llKGNuYW1lKSB7XG4gICAgbGV0IG5hbWUgPSBjbmFtZSArIFwiPVwiO1xuICAgIGxldCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGMgPSBjYVtpXTtcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSBcIiBcIikge1xuICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHtcbiAgICAgICAgbGV0IHZhbHVlID0gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn07XG5HRU1TLl9yb290ID0gXCJodHRwczovL2dlbXNhcGkuYmF5ei5haS91c2VyL1wiO1xuR0VNUy5zdGF0ZSA9IHt9O1xuR0VNUy5fZGVidWcgPSBmYWxzZTtcbkdFTVMuRWZmZWN0c01hbmFnZXIgPSBFZmZlY3RzTWFuYWdlcjtcbmZ1bmN0aW9uIF9jcmVhdGVTdHlsZSgpIHtcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIGNvbnN0IGNzcyA9IGBcbiAgICAuR0VNUy1zY3JpbSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG4gICAgXG4gICAgLkdFTVMtYWNoaWV2ZW1lbnQtZnJhbWUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICBib3gtc2hhZG93OiAnNHB4IDhweCAzNnB4ICNGNEFBQjknO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgd2lkdGg6NjAwcHg7XG4gICAgICAgIGhlaWdodDogNDAwcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICAgIH1cbiAgICBcbiAgICAuR0VNUy1hY2hpZXZlbWVudC10aXRsZSB7XG4gICAgICAgIG1hcmdpbjogMTBweDtcbiAgICB9XG4gICAgXG4gICAgLkdFTVMtYWNoaWV2ZW1lbnQtaW1hZ2Uge1xuICAgICAgICBoZWlnaHQ6IDcwJTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICBib3gtc2hhZG93OiAnNHB4IDhweCAzNnB4ICNGNEFBQjknO1xuICAgIH1cbiAgICBcbiAgICAuR0VNUy1hY2hpZXZlbWVudC1kZXNjcmlwdGlvbiB7XG4gICAgICAgIG1hcmdpbjogMTBweDtcbiAgICB9XG5cbiAgICAuR0VNUy1iYWRnZXMtZnJhbWUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICAgICAgICBtYXgtd2lkdGg6IDkwJTtcbiAgICAgICAgbWF4LWhlaWdodDogOTAlO1xuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgcGFkZGluZzogNDBweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG4gICAgfVxuXG4gICAgLkdFTVMtYmFkZ2UtaW1hZ2UtY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxNzBweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgIC5HRU1TLWJhZGdlLWltYWdlIHtcbiAgICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgfVxuXG4gICAgLkdFTVMtYmFkZ2UtaW1hZ2UtY29udGFpbmVyOmhvdmVyIHtcbiAgICAgICAgc2NhbGU6IDEyMCU7XG4gICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XG4gICAgfVxuXG5cbiAgICAuR0VNUy1iYWRnZS10aXRsZSB7XG4gICAgICAgIHBhZGRpbmctdG9wOiAwLjRyZW07XG4gICAgICAgIGZvbnQtc2l6ZTogLjhyZW07XG4gICAgICAgIGNvbG9yOiByZ2IoOTEsIDkwLCA5MCk7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgfVxuXG4gICAgLkdFTVMtYmFkZ2UtZGVzY3JpcHRpb24ge1xuICAgICAgICBmb250LXNpemU6IC40cmVtO1xuICAgICAgICBvcGFjaXR5OiA2MCU7XG4gICAgICAgIG1heC13aWR0aDogNTAlO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLkdFTVMtYmFkZ2UtaW1hZ2UtdW5lYXJuZWQge1xuICAgICAgICBvcGFjaXR5OiAwLjU7XG4gICAgICAgIGZpbHRlcjogZ3JheXNjYWxlKDgwJSk7XG4gICAgfVxuXG4gICAgLkdFTVMtYmFkZ2UtaW1hZ2UtdW5lYXJuZWQ6aG92ZXIge1xuICAgICAgICBvcGFjaXR5OiAwLjc7XG5cbiAgICB9XG4gICAgYDtcbiAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgX2NyZWF0ZVN0eWxlKCk7XG4gIEVmZmVjdHNNYW5hZ2VyLnJlZ2lzdGVyRWZmZWN0KFwiY29uZmV0dGlcIiwgbmV3IENvbmZldHRpRWZmZWN0KCkpO1xufVxuZXhwb3J0IHtcbiAgR0VNU1xufTtcbiIsICJpbXBvcnQge0dFTVN9IGZyb20gXCJiYXl6ZS1nZW1zLWFwaVwiO1xuXG4vLyBnYW1lIGVsZW1lbnRzICAgXG5jb25zdCBzY29yZVNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpISBhcyBIVE1MU3BhbkVsZW1lbnQ7XG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheVwiKSEgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5jb25zdCBzY29yZUJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NvcmVib3hcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuY29uc3QgZmluaXNoQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmaW5pc2hcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuY29uc3QgYmFkZ2VzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNiYWRnZXNcIikhIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuY29uc3QgdmVyc2lvblNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ZlcnNpb25cIikhIGFzIEhUTUxTcGFuRWxlbWVudDtcblxuc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0KTtcbnBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNjb3JlKTtcbmZpbmlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluaXNoKTtcbmJhZGdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFkZ2VzKTtcbnZlcnNpb25TcGFuLmlubmVyVGV4dCA9IEdFTVMudmVyc2lvbigpO1xuXG4vLyBpbml0IGFuZCBmaXJzdCBldmVudFxuY29uc3QgYXBpS2V5ID0gXCJpMnNsdWxOKVUlN3h2TW9WQUNMU0VZb2dPZWtOUW9XRVwiO1xuY29uc3QgYXBwSWQgPSBcIjM3Njc1YWM4LWMwYzAtNDJlOS04MjkxLTBmOTUyOWRmNWQ0N1wiO1xuR0VNUy5pbml0KHthcGlLZXk6YXBpS2V5LCBhcHBJZDphcHBJZH0pLnRoZW4oKCk9PntcbiAgICBHRU1TLmV2ZW50KFwiRGVtby1HYW1lUGFnZVwiKTtcbiAgICBzdGFydEJ1dHRvbiEuZGlzYWJsZWQgPSBmYWxzZTtcbn0pO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgICBHRU1TLmV2ZW50KFwiRGVtby1HYW1lU3RhcnRlZFwiKTtcbiAgICBzY29yZVNwYW4uaW5uZXJUZXh0ID0gXCIwXCI7XG4gICAgcGxheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHNjb3JlQm94LmRpc2FibGVkID0gZmFsc2U7XG4gICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBzY29yZSgpIHtcbiAgICBsZXQgbiA9IE51bWJlcihzY29yZVNwYW4uaW5uZXJUZXh0KTtcbiAgICBsZXQgbk5ldyA9IE51bWJlcihzY29yZUJveC52YWx1ZSk7XG4gICAgaWYgKGlzTmFOKG5OZXcpKXtcbiAgICAgICAgbk5ldyA9IDA7XG4gICAgfVxuICAgIG4gKz0gbk5ldztcbiAgICBzY29yZVNwYW4uaW5uZXJUZXh0ID0gU3RyaW5nKG4pO1xuICAgIGZpbmlzaEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgR0VNUy5ldmVudChcIkRlbW8tR2FtZUZpbmlzaGVkXCIsIHt2YWx1ZTpOdW1iZXIoc2NvcmVTcGFuLmlubmVyVGV4dCl9KTtcbiAgICBwbGF5QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBzY29yZUJveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgZmluaXNoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBiYWRnZXMoKSB7XG4gICAgR0VNUy5kaXNwbGF5QWxsQmFkZ2VzKClcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUFBLE1BQUksWUFBWSxPQUFPO0FBQ3ZCLE1BQUksc0JBQXNCLE9BQU87QUFDakMsTUFBSSxlQUFlLE9BQU8sVUFBVTtB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

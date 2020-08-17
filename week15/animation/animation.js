export class Timeline {
  constructor() {
    this.animations = [];
    this.requestID = null;
    this.state = 'initial';
  }

  tick() {
    let t = Date.now() - this.startTime;

    const animations = this.animations.filter(v => !v.isFinish)

    for(let animation of animations) {
      let { object, property, format, start, end, duration, delay, timingFunction, t0, startP } = animation;
      let progression = 0;

      if (t < delay + t0) {
        progression = timingFunction(startP / duration);
      } else {
        progression = timingFunction((t - delay - t0 + startP) / duration);
      }

      if (t > duration + delay + t0) {
        progression = 1;
        animation.isFinish = true;
      }

      object[property] = format(start + progression * (end - start));
    }

    if (animations.length) {
      this.requestID = requestAnimationFrame(() => {
        this.tick();
      });
    } else {
      this.state = 'pending';
    }
  }

  start() {
    if (this.state !== 'initial') {
      if (this.state === 'playing') {
        this.pause();
      }
      this.animations.forEach(v => {
        v.isFinish = false;
        v.t0 = 0;
      });
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  add(animation, startP) {
    this.animations.push(animation);
    animation.t0 = this.startTime ? Date.now() - this.startTime : 0;
    animation.startP = startP ?? animation.t0;
    if (this.state === 'pending') {
      this.state = 'playing';
      this.tick();
    }
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'pause';
    this.pauseTime = Date.now();
    cancelAnimationFrame(this.requestID);
  }

  resume() {
    if (this.state !== 'pause') return;
    this.state = 'playing';
    this.startTime = Date.now() - this.pauseTime + this.startTime;
    this.tick();
  }

  end() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.state = 'end';
    for (let animation of this.animations) {
      let { object, property, format, end } = animation;
      object[property] = format(end);
    }
    this.animations = [];
  }
}

export class Animation {
  constructor(object, property, format, start, end, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.format = format;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }
}
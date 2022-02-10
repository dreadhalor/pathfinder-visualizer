export class Animator {
  constructor() {
    this.animation_queue = [];
    this.delay = 0;
  }

  playAnimations = (animation_queue, frames_per_refresh = 1) => {
    this.flushAnimationQueue();
    this.animation_queue = animation_queue;
    // let threads = 2;
    this.animationLoop(frames_per_refresh);
    // for (let i = 0; i < threads; i++)
    //   setTimeout(
    //     () => this.animationLoop(frames_per_refresh),
    //     1000 / 60 / threads
    //   );
  };
  flushAnimationQueue = () => (this.animation_queue = []);
  animationLoop(frames_per_refresh = 1) {
    let animations = this.animation_queue.splice(0, frames_per_refresh);
    if (animations.length > 0) {
      for (let animation of animations) if (animation) animation();
      if (this.delay) {
        setTimeout(
          () =>
            requestAnimationFrame(() => this.animationLoop(frames_per_refresh)),
          this.delay
        );
      } else
        requestAnimationFrame(() => this.animationLoop(frames_per_refresh));
    }
  }
}

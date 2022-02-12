export class Animator {
  constructor(finish_function) {
    this.animation_queue = [];
    this.delay = 0;
    this.complete = finish_function;
    this.play_finish = false;
  }

  setFinishFunction = (fxn) => (this.complete = fxn);
  playAnimations = (animation_queue, frames_per_refresh = 1, finishFxn = false) => {
    this.flushAnimationQueue();
    this.play_finish = finishFxn;
    this.animation_queue = animation_queue;
    // let threads = 2;
    this.animationLoop(frames_per_refresh);
    // for (let i = 0; i < threads; i++)
    //   setTimeout(
    //     () => this.animationLoop(frames_per_refresh),
    //     1000 / 60 / threads
    //   );
  };
  animationsLeft = () => this.animation_queue.length;
  flushAnimationQueue = () => {
    this.animation_queue = [];
    this.play_finish = false;
  };
  animationLoop(frames_per_refresh = 1) {
    let calculated_local_delay = frames_per_refresh < 1 ? Math.floor(1 / frames_per_refresh) : 0;
    let final_local_delay = this.delay || calculated_local_delay;
    let fpr = frames_per_refresh >= 1 ? frames_per_refresh : 1;
    let animations = this.animation_queue.splice(0, fpr);
    if (animations.length > 0) {
      for (let animation of animations) if (animation) animation();
      if (final_local_delay) {
        setTimeout(
          () => requestAnimationFrame(() => this.animationLoop(frames_per_refresh)),
          final_local_delay
        );
      } else requestAnimationFrame(() => this.animationLoop(frames_per_refresh));
    } else if (this.play_finish) this.complete();
  }
}

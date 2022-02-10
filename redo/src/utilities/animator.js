export class Animator {
  constructor() {
    this.animation_queue = [];
    this.animation_delay = 5;
    this.animation_threads = 1;
    this.ontime = 0;
    this.delayed = 0;
    this.stamp = null;
  }

  playAnimations = (animation_queue, speed = this.animation_delay, num = 1) => {
    this.flushAnimationQueue();
    this.animation_queue = animation_queue;
    this.playThroughAnimationQueue(speed, num);
  };
  flushAnimationQueue = () => (this.animation_queue = []);
  playThroughAnimationQueue = (speed = this.animation_delay, num = 1) => {
    this.ontime = 0;
    this.delayed = 0;
    // let frames_per_second = 60;
    // let seconds_per_frame = 1000 / frames_per_second;
    //we want an animation to fire every n ms
    // let threads_per_frame = animation_threads;
    // let thread_stagger = seconds_per_frame / threads_per_frame;
    for (let i = 0; i < this.animation_threads; i++) {
      // setTimeout(() => animationLoop(speed), speed * i);
      //setTimeout(() => animationLoop(speed), thread_stagger * i);
      this.animationLoop(speed, null, num);
    }
  };
  animationLoop(speed = this.animation_delay, timestamp, num = 1) {
    //console.log(num);
    if (this.stamp) {
      let time = timestamp - this.stamp;
      //console.log(time);
      if (time < 17) this.ontime++;
      else this.delayed++;
      //console.log(ontime + ', ' + delayed);
    }
    this.stamp = timestamp;
    let animations = this.animation_queue.splice(0, num);
    //let animation = animation_queue.shift();
    if (animations.length > 0) {
      for (let animation of animations) {
        if (animation) animation();
      }
      requestAnimationFrame((timestamp) =>
        this.animationLoop(speed, timestamp, num)
      );
    }
    // if (animation) {
    //   animation();
    //   requestAnimationFrame(
    //     (timestamp) => animationLoop(speed, timestamp),
    //     speed * animation_threads
    //   );
    //   // setTimeout(() => animationLoop(speed), speed * animation_threads);
  }
}

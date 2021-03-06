import React, { forwardRef, useImperativeHandle } from 'react';
import './Card.scss';
import Sticker from 'components/Sticker';

import clamp from 'lodash-es/clamp'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-with-gesture'


const Card = forwardRef(({ nat, name, email, age, url, del, last }, ref) => {

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));

  const bind = useGesture(({ down, delta, velocity }) => {
    velocity = clamp(velocity, 1, 2);

    if (down) {
      set({ xy: down ? delta : [0, 0], config: { mass: velocity, tension: 500 * velocity, friction: 50 } })
    } else if (!down) {
      if (Math.abs(delta[0]) >= 200 && Math.abs(delta[1]) >= 50) {
        let [x, y] = [Math.sign(delta[0]) === 1 ? window.innerWidth : (window.innerWidth * -1), Math.sign(delta[1]) === 1 ? window.innerHeight : (window.innerHeight * -1)];
        set({ xy: [x, y], config: { mass: velocity, tension: 500 * velocity, friction: 50 } });
        setTimeout(() => {
          del();
        }, 100);
      } else if (Math.abs(delta[0]) <= 50 && delta[1] < -200) {
        set({ xy: [delta[0], window.innerHeight * -1], config: { mass: velocity, tension: 500 * velocity, friction: 50 } });
        setTimeout(() => {
          del();
        }, 100);
      } else {
        set({ xy: down ? delta : [0, 0], config: { mass: velocity, tension: 500 * velocity, friction: 50 } })
      }
    }
  })


  useImperativeHandle(ref, () => ({
    like() {
      set({ xy: [window.innerWidth, window.innerHeight], config: { mass: 1, tension: 500 * 0.4, friction: 50 } });
      setTimeout(() => {
        del();
      }, 400);
    },
    superlike() {
      set({ xy: [0, window.innerHeight * -1], config: { mass: 1, tension: 500 * 0.4, friction: 50 } });
      setTimeout(() => {
        del();
      }, 400);
    },
    dislike() {
      set({ xy: [window.innerWidth * -1, window.innerHeight], config: { mass: 1, tension: 500 * 0.5, friction: 50 } });
      setTimeout(() => {
        del();
      }, 400);
    },
  }));

  const stickerAnimation = (x, y, name) => {
    if (name === 'Bad') {
      if (x < -50 && Math.abs(y) >= 50) {
        return `${(x * -0.005)}`;
      }
    } else if (name === 'Good') {
      if (x > 50 && Math.abs(y) >= 50) {
        return `${(x * 0.005)}`;
      }
    } else if (name === 'SuperLike') {
      if (Math.abs(x) <= 50 && y <= -50) {
        return `${(y * -0.005)}`;
      }
    }
    return 0;
  }

  return (
    <React.Fragment>
      {last ?
        <React.Fragment>
          <Sticker name={'Bad'} style={{ opacity: xy.interpolate((x, y) => { return stickerAnimation(x, y, 'Bad') }) }} />
          <Sticker name={'SuperLike'} style={{ opacity: xy.interpolate((x, y) => { return stickerAnimation(x, y, 'SuperLike') }) }} />
          <Sticker name={'Good'} style={{ opacity: xy.interpolate((x, y) => { return stickerAnimation(x, y, 'Good') }) }} />
        </React.Fragment>
        :
        null
      }

      <animated.div className="Card" {...bind()} style={{ transform: xy.interpolate((x, y) => { return `translate3d(${x}px,${y}px,0) rotate(${x * -0.09}deg)` }) }}>
        <div className="img-wrap" style={{ backgroundImage: `url(http://flags.fmcdn.net/data/flags/w580/${nat.toLowerCase()}.png)` }}>
          <img src={url} alt={url} />
        </div>
        <div className="text-wrap">
          <p className="name" >{name}, {age}</p>
          <p className="email">{email}</p>
        </div>
      </animated.div >

    </React.Fragment>

  );
});

export default Card;
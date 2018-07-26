'use strict';

import * as color   from 'colors';
import * as libTwit from './lib/twitter';

// env load
require('dotenv').config();

const twStream = libTwit.getTwitterStream(
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET,
  process.env.TWITTER_ACCESS_TOKEN,
  process.env.TWITTER_ACCESS_TOKEN_SECRET
);

twStream.on(
  'tweet', 
  (tweetSrc:any) => {
    let tweetData = libTwit.getTweetData(tweetSrc)
    if(!tweetData || tweetData.text.match(/\[PR\]/)) {
      return;
    }
    console.log(
      color.bgCyan(`${tweetData.screen_name}(@${tweetData.tweet_acount})`),
      tweetData.text.replace(/\r?\n/g, "")
    );
  }
);

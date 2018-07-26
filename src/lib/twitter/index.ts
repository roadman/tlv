'use strict';

import * as Twit    from 'twit';
import * as dotenv  from 'dotenv';

// env load
dotenv.config();

// twitter stream
export let getTwitterStream = (
  consumer_key:string,
  consumer_secret:string,
  access_token:string,
  access_token_secret:string
):Twit.Stream => {
  const twIns = new Twit({
    "consumer_key"       : consumer_key,
    "consumer_secret"    : consumer_secret,
    "access_token"       : access_token,
    "access_token_secret": access_token_secret
  });
  return twIns.stream('user')
}

interface ITweetData {
  tweet_src     :any;
  tweet         :any;
  tweet_id      :string;
  is_rt         :boolean;
  is_qt         :boolean;
  is_extend     :boolean;
  text          :string;
  name          :string;
  screen_name   :string;
  tweet_acount  :string;
  retweet_acount:string;
  timestamp_ms  :string;

}

export let getTweetData = (tweetSrc:any):ITweetData => {
  let tweetData:ITweetData = {
    tweet_src     : tweetSrc,
    tweet         : null,
    tweet_id      : null,
    is_rt         : ('retweeted_status' in tweetSrc ? true : false),
    is_qt         : false,
    is_extend     : false,
    text          : null,
    name          : null,
    screen_name   : null,
    tweet_acount  : tweetSrc.user.screen_name,
    retweet_acount: null,
    timestamp_ms  : tweetSrc.timestamp_ms
  }

  // RTの場合はRT tweetを使用
  if (tweetData.is_rt) {
    tweetData.tweet = tweetData.tweet_src.retweeted_status
    tweetData.retweet_acount = tweetData.tweet_src.user.screen_name
  } else {
    tweetData.tweet = tweetSrc
  }
  tweetData.tweet_id = tweetData.tweet.id_str
  tweetData.text = tweetData.tweet.text
  tweetData.name = tweetData.tweet.user.name
  tweetData.screen_name = tweetData.tweet.user.screen_name
  tweetData.tweet_acount = tweetData.tweet.user.screen_name

  // qtの場合はqt tweetを使用
  tweetData.is_qt = ('quoted_status' in tweetData.tweet ? true : false)
  if (tweetData.is_qt) {
    //console.log(tweetData.tweet.quoted_status)

    tweetData.tweet = tweetData.tweet.quoted_status

    // RTされたQTではない場合はQTしたaccountをRTしたaccountとして設定
    if (tweetData.retweet_acount === null) {
      tweetData.retweet_acount = tweetData.tweet.user.screen_name
    }

    // quoteの場合はquoteのtextを利用
    tweetData.tweet_id = tweetData.tweet.id_str
    tweetData.text = tweetData.tweet.text
    tweetData.name = tweetData.tweet.user.name
    tweetData.screen_name = tweetData.tweet.user.screen_name
    tweetData.tweet_acount = tweetData.tweet.user.screen_name
  }

  // 拡張仕様
  tweetData.is_extend = ('extended_tweet' in tweetData.tweet ? true : false)
  if (tweetData.is_extend) {
    //console.log(tweetData.tweet.extended_tweet)

    tweetData.tweet = tweetData.tweet.extended_tweet
      // extendの場合はextendのfull textを利用
    tweetData.text = tweetData.tweet.full_text
  }

  return tweetData;
}

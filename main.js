$(document).ready(function () {
  var $main = $('.main');
  var $refresh = $('<a href="#" class="refresh"></a>');
  $refresh.text('refresh feed');
  $refresh.prependTo($main);
  var $input = $('<input type="text" placeholder="compose new tweet & then press enter"></input>');
  $input.appendTo($main);
  var $feed = $('<div></div>');
  $feed.appendTo($main);

  var publish = function (x) {
    var tweet;
    var $tweet;
    var $user;
    var $time;
    var source;
    var index;
    var readableTime;
    $feed.html('');

    if (x === 'all') {
      source = streams.home; // {streams} comes from data_generator.js
    } else if (x) {
      source = streams.users[x];
    }

    for (index = source.length - 1; index >= 0; index -= 1) {
      tweet = source[index];
      $tweet = $('<div></div>');
      $tweet.addClass('tweet');

      $user = $('<a></a>');
      $user.attr({'href': '#', 'data-user': tweet.user, 'class': 'username'});
      $user.text('@' + tweet.user);
      $user.appendTo($tweet);
      $tweet.append(': ' + tweet.message);
      $time = $('<span></span>');
      $time.addClass('timestamp');
      readableTime = moment(tweet.created_at).fromNow();
      $time.text(readableTime);
      $time.appendTo($tweet);
      $tweet.appendTo($feed);
    }
    $('.username').on('click', function (e) {
      e.preventDefault();
      publish($(this).data('user'));
    });
  };
  $refresh.clone().appendTo($main);
  publish('all');

  $('.refresh').on('click', function (e) {
    e.preventDefault();
    publish('all');
  });

  $('input').keypress(function (e) {
    if (e.which === 13) {
      window.visitor = 'guest';
      if (!streams.users[window.visitor]) {
        streams.users[window.visitor] = [];
      }
      writeTweet($(this).val());
      $(this).val('');
      publish('all');
    }
  });
});


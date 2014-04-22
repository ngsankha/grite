var queue = 0;
var toBeLoaded = 0;
var loaded = 0;

function setTitle() {
  $('#title').html(config.title);
  document.title = config.title;
}

function setNavbar() {
  for (var i = 0; i < config.navbar.length; i++) {
    var dom = '<a href="' + config.navbar[i].link + '">' + config.navbar[i].text + '</a>';
    if (i != 0)
      $('<span> • </span>').appendTo('#navbar');
    $(dom).appendTo('#navbar');
  }
}

function createPlaceholders() {
  for (var i = 0; i < config.atOnce; i++) {
    if (toBeLoaded != config.posts.length) {
      var dom = '<div id="post' + config.posts[toBeLoaded] + '"></div>';
      $(dom).appendTo('#posts');
      toBeLoaded++;
    } else
      break;
  }
}

function loadPosts() {
  $('#loader').show();
  for (;loaded < toBeLoaded; loaded++) {
    queue ++;
    $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
      var gist = '';
      for (var j in data.files)
        gist = gist + marked.parse(data.files[j].content);
      var dom = '<div class="post">' +
                '<div class="post-text">' + gist + '</div>' +
                '<span class="date"><a href="' + data.html_url + '">' + new Date(data.updated_at) + '</a></span>' +
                ' • <span class="author">Posted by <a href="https://github.com/' + data.owner.login + '">' + data.owner.login + '</a></span>' +
                '</div><hr>';
      $(dom).appendTo('#post' + data.id);
    }, 'json').done(function() {
      queue --;
      if (queue == 0)
        $('#loader').hide();
    });
  }
}

function loadFooter() {
  $('#footer-text').html(config.footerText);
}

function loadOlder() {
  createPlaceholders();
  loadPosts();
  if (toBeLoaded == config.posts.length)
    $('#old-posts').hide();
}

$('#loader').hide();
setTitle();
setNavbar();
loadFooter();
$('#old-posts').bind('click', loadOlder);
createPlaceholders();
loadPosts();
if (toBeLoaded == config.posts.length)
  $('#old-posts').hide();

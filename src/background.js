function fetchWallpaper(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://unsplash.com/rss');
  xhr.overrideMimeType('text/xml');
  xhr.onload = function() {
    chrome.wallpaper.setWallpaper(
        {
          'url': parseWallpaperFeed(xhr.responseXML),
          'layout': 'CENTER_CROPPED',
          'filename': 'unsplash'
        }, callback);
  }
  xhr.onerror = callback;
  xhr.send();
}

function parseWallpaperFeed(doc) {
  var walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);
  var fragment = null;

  do {
    fragment = walker.nextNode();
  } while (fragment.tagName.toLowerCase() != 'channel');

  var itemFragments = fragment.getElementsByTagName('item');
  return itemFragments[Math.floor((Math.random() * itemFragments.length))]
      .getElementsByTagName('image')[0]
      .getElementsByTagName('url')[0]
      .textContent;
}

function onAlarm() {
  fetchWallpaper(function() {
    chrome.alarms.create('fetch', { when: Date.now() + 30e3 });
    window.close();
  });
}

chrome.alarms.create('fetch', { when: Date.now() });
chrome.alarms.onAlarm.addListener(onAlarm);

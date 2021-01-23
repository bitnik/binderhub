/* State transitions that are valid are:
  start -> waiting
  start -> built
  start -> failed
  waiting -> building
  waiting -> failed
  building -> pushing
  building -> failed
  pushing -> built
  pushing -> failed */

import BinderImage from './image';

var BASE_URL = $('#base-url').data().url;

function update_favicon(path) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = path;
    document.getElementsByTagName('head')[0].appendChild(link);
}

export function build(providerSpec, log, path, pathType) {
    update_favicon(BASE_URL + "favicon_building.ico");
    // split provider prefix off of providerSpec
    var spec = providerSpec.slice(providerSpec.indexOf('/') + 1);
    // Update the text of the loading page if it exists
    if ($('div#loader-text').length > 0) {
      $('div#loader-text p.launching').text("Starting repository: " + decodeURIComponent(spec))
    }
  
    $('#build-progress .progress-bar').addClass('hidden');
    log.clear();
  
    $('.on-build').removeClass('hidden');
  
    var image = new BinderImage(providerSpec);
  
    image.onStateChange('*', function(oldState, newState, data) {
      if (data.message !== undefined) {
        log.write(data.message);
        log.fit();
      } else {
        console.log(data);
      }
    });
  
    image.onStateChange('waiting', function(oldState, newState, data) {
      $('#phase-waiting').removeClass('hidden');
    });
  
    image.onStateChange('building', function(oldState, newState, data) {
      $('#phase-building').removeClass('hidden');
      log.show();
    });
  
    image.onStateChange('pushing', function(oldState, newState, data) {
      $('#phase-pushing').removeClass('hidden');
    });
  
    image.onStateChange('failed', function(oldState, newState, data) {
      $('#build-progress .progress-bar').addClass('hidden');
      $('#phase-failed').removeClass('hidden');
  
      $("#loader").addClass("paused");
  
      // If we fail for any reason, show an error message and logs
      update_favicon(BASE_URL + "favicon_fail.ico");
      log.show();
      if ($('div#loader-text').length > 0) {
        $('#loader').addClass("error");
        $('div#loader-text p.launching').html('Error loading ' + spec + '!<br /> See logs below for details.');
      }
      image.close();
    });
  
    image.onStateChange('built', function(oldState, newState, data) {
      if (oldState === null) {
        $('#phase-already-built').removeClass('hidden');
        $('#phase-launching').removeClass('hidden');
      }
      $('#phase-launching').removeClass('hidden');
      update_favicon(BASE_URL + "favicon_success.ico");
    });
  
    image.onStateChange('ready', function(oldState, newState, data) {
      image.close();
      // user server is ready, redirect to there
      image.launch(data.url, data.token, path, pathType);
    });
  
    image.fetch();
    return image;
  }

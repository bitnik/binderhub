import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function setUpLog() {
    const log = new Terminal({
      convertEol: true,
      disableStdin: true
    });
    const fitAddon = new FitAddon();
    log.loadAddon(fitAddon);
  
    var $logContainer = $("div#log-container");
    var $panelBody = $("div.panel-body");
    log.fit = function () {
      if (!$panelBody.hasClass('hidden')) {
        fitAddon.fit();
      }
    };
  
    // https://xtermjs.org/docs/api/terminal/classes/terminal/#open says that
    // `parent` must be visible (have dimensions) when open is called 
    // as several DOM- based measurements need to be performed when this function is called.
    $panelBody.removeClass('hidden');
    $logContainer.removeClass('hidden');
    log.open(parent=document.getElementById('log'), false);
    $logContainer.addClass('hidden');
    $panelBody.addClass('hidden');
    log.fit();
  
    $(window).resize(function() {
      log.fit();
    });
  
    log.show = function () {
      $('#toggle-logs button').text('hide');
      $panelBody.removeClass('hidden');
    };
  
    log.hide = function () {
      $('#toggle-logs button').text('show');
      $panelBody.addClass('hidden');
    };
  
    log.toggle = function () {
      if ($panelBody.hasClass('hidden')) {
        log.show();
      } else {
        log.hide();
      }
    };
  
    $('#toggle-logs').click(log.toggle);
    return log;
  }


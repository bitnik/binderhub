import ClipboardJS from 'clipboard';
import 'bootstrap';

import { setUpLog } from './src/log';
import { updatePathText } from './src/path';
import { updateRepoText, getBuildFormValues, updateUrls } from './src/form';
import { build } from './src/build';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import '../index.css';

function indexMain() {
    var log = setUpLog();

    // setup badge dropdown and default values.
    updateUrls();

    $("#provider_prefix_sel li").click(function(event){
      event.preventDefault();

      $("#provider_prefix-selected").text($(this).text());
      $("#provider_prefix").val($(this).attr("value"));
      updateRepoText();
      updateUrls();
    });

    $("#url-or-file-btn").find("a").click(function (evt) {
      evt.preventDefault();

      $("#url-or-file-selected").text($(this).text());
      updatePathText();
      updateUrls();
    });
    updatePathText();
    updateRepoText();

    $('#repository').on('keyup paste change', function(event) {updateUrls();});

    $('#ref').on('keyup paste change', function(event) {updateUrls();});

    $('#filepath').on('keyup paste change', function(event) {updateUrls();});

    $('#toggle-badge-snippet').on('click', function() {
        var badgeSnippets = $('#badge-snippets');
        if (badgeSnippets.hasClass('hidden')) {
            badgeSnippets.removeClass('hidden');
            $("#badge-snippet-caret").removeClass("glyphicon-triangle-right");
            $("#badge-snippet-caret").addClass("glyphicon-triangle-bottom");
        } else {
            badgeSnippets.addClass('hidden');
            $("#badge-snippet-caret").removeClass("glyphicon-triangle-bottom");
            $("#badge-snippet-caret").addClass("glyphicon-triangle-right");
        }

        return false;
    });

    $('#build-form').submit(function() {
        var formValues = getBuildFormValues();
        updateUrls(formValues);
        build(
          formValues.providerPrefix + '/' + formValues.repo + '/' + formValues.ref,
          log,
          formValues.path,
          formValues.pathType
        );
        return false;
    });
}

// export entrypoints
window.indexMain = indexMain;

// Load the clipboard after the page loads so it can find the buttons it needs
window.onload = function() {
  new ClipboardJS('.clipboard');
};

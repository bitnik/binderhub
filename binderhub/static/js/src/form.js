import { markdownBadge, rstBadge } from './badge';
import { getPathType } from './path';

var BASE_URL = $('#base-url').data().url;
var BADGE_BASE_URL = $('#badge-base-url').data().url;

function v2url(providerPrefix, repository, ref, path, pathType) {
    // return a v2 url from a providerPrefix, repository, ref, and (file|url)path
    if (repository.length === 0) {
      // no repo, no url
      return null;
    }
    if (BADGE_BASE_URL) {
      var url = BADGE_BASE_URL + 'v2/' + providerPrefix + '/' + repository + '/' + ref;
    }
    else {
      var url = window.location.origin + BASE_URL + 'v2/' + providerPrefix + '/' + repository + '/' + ref;
    }
    if (path && path.length > 0) {
      // encode the path, it will be decoded in loadingMain
      url = url + '?' + pathType + 'path=' + encodeURIComponent(path);
    }
    return url;
  }

export function updateRepoText() {
    var text;
    var provider = $("#provider_prefix").val();
    var tag_text = "Git ref (branch, tag, or commit)";
    var placeholder = "HEAD";
    // first enable branch/ref field, some providers later disable it
    $("#ref").prop("disabled", false);
    $("label[for=ref]").prop("disabled", false);
    if (provider === "gh") {
      text = "GitHub repository name or URL";
    } else if (provider === "gl") {
      text = "GitLab.com repository or URL";
    }
    else if (provider === "gist") {
      text = "Gist ID (username/gistId) or URL";
      tag_text = "Git commit SHA";
    }
    else if (provider === "git") {
      text = "Arbitrary git repository URL (http://git.example.com/repo)";
    }
    else if (provider === "zenodo") {
      text = "Zenodo DOI (10.5281/zenodo.3242074)";
      $("#ref").prop("disabled", true);
      $("label[for=ref]").prop("disabled", true);
    }
    else if (provider === "figshare") {
      text = "Figshare DOI (10.6084/m9.figshare.9782777.v1)";
      $("#ref").prop("disabled", true);
      $("label[for=ref]").prop("disabled", true);
    }
    else if (provider === "hydroshare") {
      text = "Hydroshare resource id or URL";
      $("#ref").prop("disabled", true);
      $("label[for=ref]").prop("disabled", true);
    }
    else if (provider === "dataverse") {
      text = "Dataverse DOI (10.7910/DVN/TJCLKP)";
      $("#ref").prop("disabled", true);
      $("label[for=ref]").prop("disabled", true);
    }
    $("#repository").attr('placeholder', text);
    $("label[for=repository]").text(text);
    $("#ref").attr('placeholder', placeholder);
    $("label[for=ref]").text(tag_text);
  }
  
export function getBuildFormValues() {
    var providerPrefix = $('#provider_prefix').val().trim();
    var repo = $('#repository').val().trim();
    if (providerPrefix !== 'git') {
      repo = repo.replace(/^(https?:\/\/)?gist.github.com\//, '');
      repo = repo.replace(/^(https?:\/\/)?github.com\//, '');
      repo = repo.replace(/^(https?:\/\/)?gitlab.com\//, '');
    }
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, '');
    // git providers encode the URL of the git repository as the repo
    // argument.
    if (repo.includes("://") || providerPrefix === 'gl') {
      repo = encodeURIComponent(repo);
    }
  
    var ref = $('#ref').val().trim() || $("#ref").attr("placeholder");
    if (providerPrefix === 'zenodo' || providerPrefix === 'figshare' || providerPrefix === 'dataverse' ||
        providerPrefix === 'hydroshare') {
      ref = "";
    }
    var path = $('#filepath').val().trim();
    return {'providerPrefix': providerPrefix, 'repo': repo,
            'ref': ref, 'path': path, 'pathType': getPathType()}
  }
  
export function updateUrls(formValues) {
    if (typeof formValues === "undefined") {
        formValues = getBuildFormValues();
    }
    var url = v2url(
                 formValues.providerPrefix,
                 formValues.repo,
                 formValues.ref,
                 formValues.path,
                 formValues.pathType
              );
  
    if ((url||'').trim().length > 0){
      // update URLs and links (badges, etc.)
      $("#badge-link").attr('href', url);
      $('#basic-url-snippet').text(url);
      $('#markdown-badge-snippet').text(markdownBadge(url));
      $('#rst-badge-snippet').text(rstBadge(url));
    } else {
      ['#basic-url-snippet', '#markdown-badge-snippet', '#rst-badge-snippet' ].map(function(item, ind){
        var el = $(item);
        el.text(el.attr('data-default'));
      })
    }
  }

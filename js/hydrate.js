document.addEventListener('DOMContentLoaded', function () {
  function fetchText(path) {
    return fetch(path).then(function (r) { if (!r.ok) throw r; return r.text(); });
  }
  function fetchJSON(path) {
    return fetch(path).then(function (r) { if (!r.ok) throw r; return r.json(); });
  }

  function buildPortfolio(container, items) {
    container.innerHTML = '';
    items.forEach(function (it) {
      var a = document.createElement('a');
      a.target = '_blank';
      a.href = it.href;
      a.innerHTML = [
        '<div class="row middle-md">',
        '  <div class="col-xs-12 col-sm-2 col-md-2"></div>',
        '  <div class="col-xs-12 col-sm-8 col-md-8">',
        '    <p class="venue font-purple nmb uppercase">' + (it.venue || '') + '</p>',
        '    <p class="title nmb capitalize"><b>' + (it.title || '') + '</b></p>',
        '    <p class="excerpt nmb">' + (it.excerpt || '') + '</p>',
        '  </div>',
        '</div>'
      ].join('\n');
      container.appendChild(a);
    });
  }

  function buildOfNote(container, items) {
    container.innerHTML = '';
    items.forEach(function (it) {
      var a = document.createElement('a');
      a.className = 'ofnote-item';
      a.target = '_blank';
      a.href = it.href;
      var inner = document.createElement('div');
      var p1 = document.createElement('p'); p1.className = 'font-purple nmb'; p1.textContent = it.role || '';
      var p2 = document.createElement('p'); p2.className = 'font-purple nmb'; p2.innerHTML = '<b>' + (it.publication || '') + '</b>';
      inner.appendChild(p1); inner.appendChild(p2);
      if (it.note) { var p3 = document.createElement('p'); p3.className = 'nmb'; p3.innerHTML = '<b>' + it.note + '</b>'; inner.appendChild(p3); }
      a.appendChild(inner);
      container.appendChild(a);
    });
  }

  // Hydrate portfolio(s)
  var page = (window.location.pathname || '').split('/').pop();
  var portfolioContainers = document.querySelectorAll('.portfolio');
  if (portfolioContainers && portfolioContainers.length) {
    var dataPath = page === 'portfolio.html' ? '/content/portfolio-portfolio-items.json' : '/content/index-portfolio-items.json';
    fetchJSON(dataPath).then(function (items) {
      portfolioContainers.forEach(function (c) { buildPortfolio(c, items); });
    }).catch(function (err) { console.error('portfolio load failed', err); });
  }

  // Hydrate content-main and portfolio-content-main
  var cm = document.getElementById('content-main');
  var pcm = document.getElementById('portfolio-content-main');
  if (cm) {
    fetchText('/content/index-content-main.txt').then(function (t) { cm.innerHTML = t; }).catch(function (e) { console.error(e); });
  }
  if (pcm) {
    fetchText('/content/index-content-main.txt').then(function (t) { pcm.innerHTML = t; }).catch(function (e) { console.error(e); });
  }

  // Hydrate content-quote and portfolio-content-quote
  var cq = document.getElementById('content-quote');
  var pcq = document.getElementById('portfolio-content-quote');
  if (cq) {
    fetchText('/content/index-content-quote.txt').then(function (t) { cq.innerHTML = t; }).catch(function (e) { console.error(e); });
  }
  if (pcq) {
    fetchText('/content/index-content-quote.txt').then(function (t) { pcq.innerHTML = t; }).catch(function (e) { console.error(e); });
  }

  // Hydrate ofnote
  var ofnote = document.querySelector('#content-ofnote');
  if (ofnote) {
    fetchJSON('/content/index-ofnote-items.json').then(function (items) {
      // keep the header if present
      var header = ofnote.querySelector('.grey-header');
      ofnote.innerHTML = '';
      if (header) ofnote.appendChild(header);
      var container = document.createElement('div'); container.id = 'ofnote-items';
      buildOfNote(container, items);
      ofnote.appendChild(container);
    }).catch(function (e) { console.error('ofnote load failed', e); });
  }
});

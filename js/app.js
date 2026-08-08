(async () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');
  const page = document.body.dataset.page;
  if (!page) return;
  const content = document.querySelector('#content');
  const data = await fetch('./data/walchsee.json').then(response => response.json());
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char]);
  const card = (title, body) => `<article class="card"><h2>${escape(title)}</h2>${body}</article>`;
  const text = value => `<p class="plain">${escape(value)}</p>`;
  const mapButton = query => `<a class="map-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(query)}" target="_blank" rel="noopener">📍 Google Maps</a>`;
  const dayMaps = [
    ['Walchsee, 6344 Walchsee, Austria'], ['Zahmer Kaiser, 6344 Walchsee, Austria'], ['Parkgarage Zentrum, Kufstein, Austria'], ['Wilder Kaiser, Ellmau, Austria'],
    ['Prien am Chiemsee, Germany'], ['Kaisertal, Kufstein, Austria'], ['Kitzbühel, Austria', 'Reit im Winkl, Germany', 'Kössen, Austria'], []
  ];
  const restaurantMaps = {
    'Postgasthof Fischerwirt':'Postgasthof Fischerwirt, Walchsee, Austria', 'Seestüberl Walchsee':'Seestüberl Walchsee, Austria', 'Das Lakes Restaurant':'Das Lakes Restaurant, Walchsee, Austria',
    'Auracher Löchl':'Auracher Löchl, Kufstein, Austria', 'Purlepaus':'Restaurant Purlepaus, Kufstein, Austria', 'Brentenjochalm':'Brentenjochalm, Kufstein, Austria',
    'Aschinger Alm':'Aschinger Alm, Ebbs, Austria', 'Gruttenhütte':'Gruttenhütte, Scheffau am Wilden Kaiser, Austria', 'Café Praschberger':'Café Praschberger, Walchsee, Austria', 'Café im Zentrum Kufstein':'Café im Zentrum, Kufstein, Austria'
  };
  const walkMaps = {
    'Rondje Walchsee':'Walchsee, 6344 Walchsee, Austria', 'Lochner Wasserfall':'Lochner Wasserfall, Walchsee, Austria', 'Heuberg':'Heuberg, Kössen, Austria', 'Zahmer Kaiser':'Zahmer Kaiser, 6344 Walchsee, Austria', 'Kaisertal':'Kaisertal, Kufstein, Austria'
  };
  if (page === 'planning') content.innerHTML = data.days.map((day, dayIndex) => card(day.title, day.sections.map(([heading, body]) => `<h3>${escape(heading)}</h3>${text(body)}${heading === '📍 Locaties' ? dayMaps[dayIndex].map(mapButton).join('') : ''}`).join(''))).join('');
  if (page === 'restaurants') {
    content.innerHTML = `<p class="section-intro">Compact overzicht van de restaurants uit het oorspronkelijke vakantiedossier, opnieuw vormgegeven.</p>${data.restaurants.map(([name, why, recommendation, reservation]) => card(name, `<h3>📍 Locatie</h3>${text('Open in Google Maps (bestaande link uit bronbestand behouden)')}${mapButton(restaurantMaps[name])}<h3>👍 Waarom</h3>${text(why)}<h3>🍽 Aanrader</h3>${text(recommendation)}<h3>📞 Reserveren</h3>${text(reservation)}<h3>⭐ Opmerking</h3>${text('Onderdeel van het oorspronkelijke vakantiedossier')}`)).join('')}${card('Lokale specialiteiten', text(data.specialties.split('\n').slice(1).join('\n')))}`;
  }
  if (page === 'walks') {
    content.innerHTML = `<p class="section-intro">Overzicht van de wandelingen uit het oorspronkelijke vakantiedossier in een uniforme opmaak.</p>${data.walks.map(([name, distance, elevation, duration, difficulty, description]) => card(name, `<div class="facts"><div class="fact"><strong>🥾 Afstand</strong>${escape(distance)}</div><div class="fact"><strong>⛰ Hoogtemeters</strong>${escape(elevation)}</div><div class="fact"><strong>🕒 Duur</strong>${escape(duration)}</div><div class="fact"><strong>⭐ Moeilijkheid</strong>${escape(difficulty)}</div></div><h3>📍 Locatie</h3>${text('Open in Google Maps (bestaande link uit bronbestand behouden)')}${mapButton(walkMaps[name])}<h3>Beschrijving:</h3>${text(description)}`)).join('')}`;
  }
  if (page === 'practical') content.innerHTML = data.practical.map(([title, body]) => body ? card(title, `${text(body)}${title === '📍 Handige adressen' ? ['Walchsee centrum, Austria', 'Kufstein centrum, Austria', 'Festung Kufstein, Austria', 'Kaiserlift Kufstein, Austria', 'Prien/Stock Hafen, Prien am Chiemsee, Germany'].map(mapButton).join('') : ''}`) : `<p class="section-intro">${escape(title)}</p>`).join('');
})().catch(() => { const content = document.querySelector('#content'); if (content) content.textContent = 'De inhoud kan niet worden geladen.'; });

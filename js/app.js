(async () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');
  const page = document.body.dataset.page;
  if (!page) return;
  const content = document.querySelector('#content');
  const data = await fetch('./data/walchsee.json').then(response => response.json());
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char]);
  const card = (title, body) => `<article class="card"><h2>${escape(title)}</h2>${body}</article>`;
  const text = value => `<p class="plain">${escape(value)}</p>`;
  const withoutMapReference = value => value.split('\n').filter(line => !line.includes('Open in Google Maps') && !line.includes('Alle bestaande Google Maps-links')).join('\n');
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
  const sights = [
    ['Festung Kufstein', 'Een meer dan 800 jaar oude vesting boven Kufstein, met musea, een rotsgang en de Heldenorgel: de grootste vrijstaande orgel ter wereld.', 'Festung Kufstein, Austria'],
    ['RIEDEL Manufaktur & Museum', 'Glasfabriek en museum in Kufstein: een bijzonder kijkje in het Oostenrijkse glasambacht.', 'RIEDEL Manufaktur, Kufstein, Austria'],
    ['Tischoferhöhle', 'Een bijzondere grot bij Ebbs in het Kaisertal, gevormd in kalksteen en bekend als archeologische vindplaats.', 'Tischoferhöhle, Ebbs, Austria'],
    ['Schloss Herrenchiemsee', 'Het koninklijke slot op Herreninsel is de enige kopie van Versailles ter wereld en sinds 2025 UNESCO-werelderfgoed. Het eiland is alleen per boot bereikbaar.', 'Schloss Herrenchiemsee, Germany'],
    ['Kampenwand', 'Een berg met opvallende, grillige rotsen boven de Chiemsee; bereikbaar met de Kampenwandbahn.', 'Kampenwandbahn, Aschau im Chiemgau, Germany']
  ];
  const events = [
    ['Woensdag 26 augustus · Kaiserwinkl Sommernachtstraum', 'Van 19:00 tot ongeveer 22:00 uur aan de Seepromenade in Walchsee: foodtrucks, cocktailbars, een liveband bij Café See la Vie en DJ-sets. De toegang is gratis.', 'Seepromenade, 6344 Walchsee, Austria'],
    ['Vrijdag 28 augustus · Mondkönig – Märchenkönig', 'Een avondexcursie bij volle maan op Herreninsel: om 21:30 uur vertrekt de boot vanuit Prien/Stock, gevolgd door een nachtwandeling met vier haltes in het slotpark. Terugkomst rond 00:00 uur.', 'Chiemsee Schifffahrt Prien/Stock, Germany'],
    ['Zaterdag 29 augustus · Mondkönig – Märchenkönig', 'De tweede avond van dezelfde vollemaanexcursie op Herreninsel, met boottocht vanaf Prien/Stock en een begeleide nachtwandeling naar het slotpark.', 'Chiemsee Schifffahrt Prien/Stock, Germany']
  ];
  if (page === 'planning') content.innerHTML = data.days.map((day, dayIndex) => card(day.title, day.sections.map(([heading, body]) => `<h3>${escape(heading)}</h3>${text(withoutMapReference(body))}${heading === '📍 Locaties' ? dayMaps[dayIndex].map(mapButton).join('') : ''}`).join(''))).join('');
  if (page === 'restaurants') {
    content.innerHTML = `<p class="section-intro">Compact overzicht van de restaurants uit het oorspronkelijke vakantiedossier, opnieuw vormgegeven.</p>${data.restaurants.map(([name, why, recommendation, reservation]) => card(name, `<h3>📍 Locatie</h3>${mapButton(restaurantMaps[name])}<h3>👍 Waarom</h3>${text(why)}<h3>🍽 Aanrader</h3>${text(recommendation)}<h3>📞 Reserveren</h3>${text(reservation)}<h3>⭐ Opmerking</h3>${text('Onderdeel van het oorspronkelijke vakantiedossier')}`)).join('')}${card('Lokale specialiteiten', text(data.specialties.split('\n').slice(1).join('\n')))}`;
  }
  if (page === 'walks') {
    content.innerHTML = `<p class="section-intro">Overzicht van de wandelingen uit het oorspronkelijke vakantiedossier in een uniforme opmaak.</p>${data.walks.map(([name, distance, elevation, duration, difficulty, description]) => card(name, `<div class="facts"><div class="fact"><strong>🥾 Afstand</strong>${escape(distance)}</div><div class="fact"><strong>⛰ Hoogtemeters</strong>${escape(elevation)}</div><div class="fact"><strong>🕒 Duur</strong>${escape(duration)}</div><div class="fact"><strong>⭐ Moeilijkheid</strong>${escape(difficulty)}</div></div><h3>📍 Locatie</h3>${mapButton(walkMaps[name])}<h3>Beschrijving:</h3>${text(description)}`)).join('')}`;
  }
  if (page === 'practical') content.innerHTML = data.practical.map(([title, body]) => body ? card(title, `${text(withoutMapReference(body))}${title === '📍 Handige adressen' ? ['Walchsee centrum, Austria', 'Kufstein centrum, Austria', 'Festung Kufstein, Austria', 'Kaiserlift Kufstein, Austria', 'Prien/Stock Hafen, Prien am Chiemsee, Germany'].map(mapButton).join('') : ''}`) : `<p class="section-intro">${escape(title)}</p>`).join('');
  if (page === 'sights') content.innerHTML = `<p class="section-intro">Bijzondere uitstapjes voor een andere vakantiedag, binnen ongeveer 50 km van Walchsee.</p>${sights.map(([name, description, map]) => card(name, `${text(description)}${mapButton(map)}`)).join('')}<h2 class="section-title">Tijdens jullie verblijf</h2>${events.map(([name, description, map]) => card(name, `${text(description)}${mapButton(map)}`)).join('')}`;
})().catch(() => { const content = document.querySelector('#content'); if (content) content.textContent = 'De inhoud kan niet worden geladen.'; });

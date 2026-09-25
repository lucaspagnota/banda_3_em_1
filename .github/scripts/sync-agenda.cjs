const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ical = require('node-ical');

const root = path.resolve(__dirname, '../..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'dist/conteudo.js'), 'utf8'), context);
const config = context.window.BANDA.agendaGoogle;
const zone = config.fusoHorario;
const text = value => typeof value === 'string' ? value : value?.val || '';
function day(date, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone, year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(date).map(p => [p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function convert(source, now = new Date()) {
  if (!source.includes('BEGIN:VCALENDAR') || !source.includes('END:VCALENDAR')) throw Error('Resposta inválida do Google');
  const parsed = ical.sync.parseICS(source);
  const from = new Date(now.getTime() - 86400000);
  const to = new Date(now.getTime() + 730 * 86400000);
  const events = [];
  for (const event of Object.values(parsed)) {
    if (event.type !== 'VEVENT') continue;
    for (const instance of ical.expandRecurringEvent(event, { from, to, expandOngoing:true })) {
      const data = instance.event;
      if (data.status === 'CANCELLED' || ['PRIVATE','CONFIDENTIAL'].includes(data.class)) continue;
      const title = text(instance.summary || data.summary).trim();
      if (!title || /\[nao-site\]/i.test(title + text(data.description))) continue;
      const timeZone = instance.isFullDay ? (instance.start.tz || event.start.tz || Intl.DateTimeFormat().resolvedOptions().timeZone) : zone;
      const start = day(instance.start, timeZone);
      const end = instance.end ? day(new Date(instance.end.getTime() - 1), timeZone) : start;
      if (end < day(now, zone)) continue;
      const location = text(data.location).trim();
      events.push({
        id: String(data.uid) + ':' + instance.start.toISOString(),
        data: start, dataFim: end > start ? end : '', evento:title,
        horario: instance.isFullDay ? '' : new Intl.DateTimeFormat('pt-BR', { timeZone:zone, hour:'2-digit', minute:'2-digit' }).format(instance.start),
        local:location, cidade:'', endereco:location,
        linkMapa: location ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location) : '',
        mapaEmbed: location ? 'https://www.google.com/maps?q=' + encodeURIComponent(location) + '&output=embed' : ''
      });
    }
  }
  return { atualizadoEm:now.toISOString(), eventos:events.sort((a,b) => (a.data+a.horario).localeCompare(b.data+b.horario)) };
}

async function main() {
  const url = 'https://calendar.google.com/calendar/ical/' + encodeURIComponent(config.id) + '/public/basic.ics';
  let source;
  if (process.argv[2]) source = fs.readFileSync(process.argv[2], 'utf8');
  else {
    const response = await fetch(url, {signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw Error('Google Agenda: HTTP ' + response.status);
    source = await response.text();
  }
  const output = convert(source);
  const destination = path.join(root, 'dist/assets/agenda.json');
  fs.writeFileSync(destination + '.tmp', JSON.stringify(output,null,2) + '\n');
  fs.renameSync(destination + '.tmp', destination);
  console.log(`Agenda atualizada: ${output.eventos.length} eventos.`);
}
if (require.main === module) main().catch(error => {console.error(error.message); process.exitCode=1;});
module.exports = {convert};

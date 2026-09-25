const {test} = require('node:test');
const assert = require('node:assert/strict');
const {convert} = require('./sync-agenda.cjs');
const now = new Date('2026-09-24T12:00:00Z');
const calendar = events => 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n' + events + '\r\nEND:VCALENDAR';
const event = (uid, fields) => `BEGIN:VEVENT\r\nUID:${uid}\r\n${fields}\r\nEND:VEVENT`;
test('preserva dia inteiro e fim exclusivo, converte horário e endereço', () => {
  const data = convert(calendar([
    event('all','DTSTART;VALUE=DATE:20261003\r\nDTEND;VALUE=DATE:20261005\r\nSUMMARY:Festival'),
    event('time','DTSTART:20261004T010000Z\r\nDTEND:20261004T030000Z\r\nSUMMARY:Show\r\nLOCATION:Rua A\\, 10')
  ].join('\r\n')),now).eventos;
  assert.equal(data.length,2);
  assert.equal(data[0].data,'2026-10-03');
  assert.equal(data[0].dataFim,'2026-10-04');
  assert.equal(data[0].horario,'');
  assert.equal(data[1].data,'2026-10-03');
  assert.equal(data[1].horario,'22:00');
  assert.equal(data[1].endereco,'Rua A, 10');
  assert.match(data[1].linkMapa,/Rua%20A%2C%2010/);
});
test('recorrências respeitam exclusões e cancelamentos', () => {
  const source=calendar([
    event('repeat','DTSTART;VALUE=DATE:20261003\r\nDTEND;VALUE=DATE:20261004\r\nRRULE:FREQ=WEEKLY;COUNT=3\r\nEXDATE;VALUE=DATE:20261010\r\nSUMMARY:Semanal'),
    event('cancel','DTSTART;VALUE=DATE:20261004\r\nSUMMARY:Cancelado\r\nSTATUS:CANCELLED'),
    event('private','DTSTART;VALUE=DATE:20261004\r\nSUMMARY:Privado\r\nCLASS:PRIVATE'),
    event('hide','DTSTART;VALUE=DATE:20261004\r\nSUMMARY:Lembrete [nao-site]')
  ].join('\r\n'));
  assert.deepEqual(convert(source,now).eventos.map(e=>e.data),['2026-10-03','2026-10-17']);
});
test('agenda vazia remove eventos anteriores; erro não vira agenda vazia', () => {
  assert.deepEqual(convert(calendar(''),now).eventos,[]);
  assert.throws(()=>convert('<html>Erro</html>',now));
});

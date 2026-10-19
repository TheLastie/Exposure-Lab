(() => {
  const button = document.querySelector('#saveFieldNote');
  const status = document.querySelector('#fieldNoteStatus');
  if (!button || !status) return;

  const value = (id) => document.querySelector(`#${id}`)?.textContent.trim() || '—';
  const copy = (en) => ({
    button: en ? 'Save field note' : 'Сохранить заметку съёмки',
    saved: en ? 'Note saved' : 'Заметка сохранена',
    title: en ? 'EXPOSURE LAB · FIELD NOTE' : 'EXPOSURE LAB · ЗАМЕТКА СЪЁМКИ',
    scene: en ? 'Scene' : 'Сцена',
    aperture: en ? 'Aperture' : 'Диафрагма',
    shutter: en ? 'Shutter' : 'Выдержка',
    iso: 'ISO',
    meter: en ? 'Scene EV' : 'EV сцены',
    offset: en ? 'Meter offset' : 'Отклонение экспонометра',
    focus: en ? 'Focus' : 'Фокус',
    distance: en ? 'Distance' : 'Дистанция',
    whiteBalance: en ? 'White balance' : 'Баланс белого',
    tint: en ? 'Tint' : 'Оттенок',
    made: en ? 'Saved from Exposure Lab' : 'Сохранено из Exposure Lab'
  });

  const refreshButton = () => {
    const labels = copy(document.documentElement.lang.toLowerCase().startsWith('en'));
    const arrow = button.querySelector('span');
    button.textContent = labels.button;
    if (arrow) button.append(arrow);
    status.dataset.saved = labels.saved;
  };
  new MutationObserver(refreshButton).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  refreshButton();

  button.addEventListener('click', () => {
    const en = document.documentElement.lang.toLowerCase().startsWith('en');
    const labels = copy(en);
    const scene = document.querySelector('#panelExposure .preset.active:not(#autoExposure)')?.textContent.trim() || '—';
    const focusMode = document.querySelector('#focusMode option:checked')?.textContent.trim() || '—';
    const lines = [
      labels.title,
      `${labels.scene}: ${scene}`,
      `${labels.aperture}: ${value('apertureValue')}`,
      `${labels.shutter}: ${value('shutterValue')}`,
      `${labels.iso}: ${value('isoValue').replace(/^ISO\s*/i, '')}`,
      `${labels.meter}: ${value('evNumber')}`,
      `${labels.offset}: ${value('difference')}`,
      `${labels.focus}: ${focusMode}`,
      `${labels.distance}: ${value('focusDistanceValue')}`,
      `${labels.whiteBalance}: ${value('wbTemperatureValue')}`,
      `${labels.tint}: ${value('wbTintValue')}`,
      `${labels.made} · ${new Date().toLocaleString(en ? 'en' : 'ru')}`
    ];
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exposure-note-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = labels.saved;
    setTimeout(() => { status.textContent = ''; }, 2400);
  });
})();

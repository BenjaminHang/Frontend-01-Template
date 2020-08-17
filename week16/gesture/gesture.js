export default function gesture(element) {
  const context = Object.create(null);
  if (element.ontouchstart === undefined) {
    const MOUSE_SYMBOL = Symbol('mouse');
    element.addEventListener('mousedown', (e) => {
      context[MOUSE_SYMBOL] = Object.create(null);
      start(e, context[MOUSE_SYMBOL]);

      let mousemove = (e) => {
        move(e, context[MOUSE_SYMBOL])
      }
      let mouseend = (e) => {
        end(e, context[MOUSE_SYMBOL])
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseend);
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseend)
    })
  }

  element.addEventListener('touchstart', (e) => {
    for (let touch of e.changedTouches) {
      context[touch.identifier] = Object.create(null);
      start(touch, context[touch.identifier]);
    }
  })

  element.addEventListener('touchmove', e => {
    for (let touch of e.changedTouches) {
      move(touch, context[touch.identifier])
    }
  })

  element.addEventListener('touchend', e => {
    for (let touch of e.changedTouches) {
      end(touch, context[touch.identifier])
      delete context[touch.identifier]
    }
  })

  element.addEventListener('touchcancel', e => {
    for (let touch of e.changedTouches) {
      cancel(touch, context[touch.identifier])
      delete context[touch.identifier]
    }
  })

  let start = (point, context) => {
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];
    element.dispatchEvent(new CustomEvent('start', {
      detail: {
        clientX: point.clientX,
        clientY: point.clientY
      }
    }))
    context.tap = true;
    context.pan = false;
    context.press = false;
    context.flick = false;
    context.timer = setTimeout(() => {
      if (context.pan) {
        return;
      }
      context.tap = false;
      context.pan = false;
      context.press = true;
      element.dispatchEvent(new CustomEvent('pressstart', {
        detail: {
          clientX: point.clientX,
          clientY: point.clientY
        }
      }))
    }, 500);
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.pan) {
      context.tap = false;
      context.pan = true;
      context.press = false;
    }
    if (context.pan) {
      context.moves.push({
        dx, dy, t: Date.now()
      });
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      element.dispatchEvent(new CustomEvent('panmove', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        }
      }))
    }
    console.log('move')
  }

  let end = (point, context) => {
    let threshold = 1.5;
    let speed = 0;
    if (context.tap) {
      element.dispatchEvent(new CustomEvent('tapend', {
        detail: {
          clientX: point.clientX,
          clientY: point.clientY
        }
      }))
    }
    if (context.pan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      let record = context.moves[0];
      if (record) {
        speed = Math.sqrt((dx - record.dx) ** 2 + (dy - record.dy) ** 2) / (Date.now() - record.t)
      }
      if (speed > threshold) {
        console.log('flick')
        element.dispatchEvent(new CustomEvent('flick', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed: speed,
            isFlick: true
          }
        }))
      }
      element.dispatchEvent(new CustomEvent('panend', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed,
          isFlick: speed > threshold
        }
      }))
    }
    if (context.press) {
      element.dispatchEvent(new CustomEvent('pressend', {
        detail: {
          clientX: point.clientX,
          clientY: point.clientY
        }
      }))
    }
    element.dispatchEvent(new CustomEvent('end', {
      detail: {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed: speed,
        isFlick: speed > threshold
      }
    }))
    clearTimeout(context.timer);
  }

  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('cancel', {}))
    clearTimeout(context.timer);
  }
}
(function() {
  class PeekJWT {
    constructor() {
      this.bindEvent();
    }
    
    bindEvent() {
      const peek = this.peek.bind(this);
      window.addEventListener('mouseup', function(e) {
        // for separating "mouse up" and "text unselected" events,
        // and preventing mishandling
        setTimeout(function() {
          const selection = window.getSelection();
          const str = selection.toString();
          if (str.length == 0) {
            return;
          }
          const position = selection.getRangeAt(0).getBoundingClientRect();
          peek(str, position);
        }, 0);
      }, false);
    }

    peek(str, position) {
      const decoded = this._decodeJWT(str);
      if (decoded === null) {
        return;
      }
      const header = decoded[0];
      const payload = decoded[1];

      // setup element for tooltip
      let toolTipInsertDiv = document.createElement('div');
      const relative = document.body.parentNode.getBoundingClientRect();
      const positionLeft = position.left + (-relative.left) + 100; // 100 is adhoc buffer
      const positionTop = position.top + (-relative.top) + 10; // 10 is adhoc buffer
      toolTipInsertDiv.style = `position: absolute; left: ${positionLeft}px; top: ${positionTop}px;`;
      document.body.appendChild(toolTipInsertDiv);

      // wait for toolTipInsertDiv being appended
      setTimeout(function() {
        let toolTipContentDiv = document.createElement('div');
        const headerContent = JSON.stringify(header, null, 2);
        const payloadContent = JSON.stringify(payload, null, 2);
        toolTipContentDiv.innerHTML = `
          <div class="peek-jwt--container">
            <div class="peek-jwt--container--item">
              <span class="peek-jwt--container--item--heading">HEADER</span>
              <span><pre class="peek-jwt--container--item--code">${headerContent}</pre></span>
            </div>
            <div class="peek-jwt--container--item">
              <span class="peek-jwt--container--item--heading">PAYLOAD</span>
              <span><pre class="peek-jwt--container--item--code">${payloadContent}</pre></span>
            </div>
          </div>
        `;
        
        const tip = tippy(toolTipInsertDiv, {
          trigger: 'manual',
          interactive: true,
          arrow: true,
          html: toolTipContentDiv,
          onHidden: function() {
            toolTipInsertDiv._tippy.destroy();
          },
          theme: 'peek-jwt bordered',
        });
        toolTipInsertDiv._tippy.show();
      }, 0);
    }

    _decodeJWT(str) {
      const splited = str.split('.');
      if (splited.length != 3) {
        return null;
      }
      const header = splited[0];
      const payload = splited[1];
      const _sig = splited[2];

      try {
        const decodedHeader = window.atob(header.replace('-', '+').replace('_', '/'));
        const decodedPayload = window.atob(payload.replace('-', '+').replace('_', '/'));
        return [JSON.parse(decodedHeader), JSON.parse(decodedPayload)];
      } catch (err) {
        return null;
      }
    }
  }

  new PeekJWT();
}());

'use strict';

(function() {
  var leftInput = document.querySelector('#resize-x');
  var topInput = document.querySelector('#resize-y');
  var sideInput = document.querySelector('#resize-size');

  function setFieldConstraint(imageWidth, imageHeight) {
    var sideMax = Math.min(imageWidth - leftInput.value, imageHeight - topInput.value);
    sideInput.max = sideMax >= 0 ? sideMax : 0;
    var leftMax = imageWidth - sideInput.value;
    leftInput.max = leftMax >= 0 ? leftMax : 0;
    var topMax = imageHeight - sideInput.value;
    topInput.max = topMax >= 0 ? topMax : 0;
  }

  /**
   * @constructor
   * @param {string} image
   */
  var Resizer = function(image) {
    // Изображение, с которым будет вестись работа.
    this._image = new Image();
    this._image.src = image;

    // Холст.
    this._container = document.createElement('canvas');
    this._ctx = this._container.getContext('2d');

    // Создаем холст только после загрузки изображения.
    this._image.onload = function() {
      // Размер холста равен размеру загруженного изображения. Это нужно
      // для удобства работы с координатами.
      this._container.width = this._image.naturalWidth;
      this._container.height = this._image.naturalHeight;

      /**
       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
       * стороны изображения.
       * @const
       * @type {number}
       */
      var INITIAL_SIDE_RATIO = 0.75;

      // Размер меньшей стороны изображения.
      var side = Math.min(
          this._container.width * INITIAL_SIDE_RATIO,
          this._container.height * INITIAL_SIDE_RATIO);

      leftInput.value = parseInt(this._container.width / 2 - side / 2, 10);
      topInput.value = parseInt(this._container.height / 2 - side / 2, 10);
      sideInput.value = parseInt(side, 10);
      setFieldConstraint(this._image.naturalWidth, this._image.naturalHeight);

      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
      // от размера меньшей стороны.
      this._resizeConstraint = new Square(this._container.width / 2 - side / 2, this._container.height / 2 - side / 2, side);

      // Отрисовка изначального состояния канваса.
      this.setConstraint();
    }.bind(this);

    // Фиксирование контекста обработчиков.
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDrag = this._onDrag.bind(this);
  };

  var drawDot = function(coordinate, dotRadius, color, context) {
    context.beginPath();
    context.arc(coordinate.x, coordinate.y, dotRadius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  };

  var drawDottedLine = function(firstPoint, secondPoint, lineWidth, color, context) {
    var dotRadius = lineWidth / 2;
    var indent = 2 * dotRadius;
    var currentDotCoord = new Coordinate(firstPoint.x, firstPoint.y);

    var dx = secondPoint.x - firstPoint.x;
    var dy = secondPoint.y - firstPoint.y;

    var steps = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      steps = parseInt(Math.abs(dx) / (2 * dotRadius + indent), 10);
    } else {
      steps = parseInt(Math.abs(dy) / (2 * dotRadius + indent), 10);
    }

    var xIncrement = dx / steps;
    var yIncrement = dy / steps;

    for(var i = 0; i < steps; i++) {
      drawDot(currentDotCoord, dotRadius, color, context);
      currentDotCoord.x += xIncrement;
      currentDotCoord.y += yIncrement;
    }
  };

  var drawDottedSquare = function(strokeWidth, color, context, square) {
    var array = [new Coordinate(square.x, square.y),
                 new Coordinate(square.x + square.side, square.y),
                 new Coordinate(square.x + square.side, square.y + square.side),
                 new Coordinate(square.x, square.y + square.side),
                 new Coordinate(square.x, square.y)];

    for (var i = 0; i < array.length - 1; i++) {
      drawDottedLine(array[i], array[i + 1], strokeWidth, color, context);
    }
  };

  Resizer.prototype = {
    /**
     * Родительский элемент канваса.
     * @type {Element}
     * @private
     */
    _element: null,

    /**
     * Положение курсора в момент перетаскивания. От положения курсора
     * рассчитывается смещение на которое нужно переместить изображение
     * за каждую итерацию перетаскивания.
     * @type {Coordinate}
     * @private
     */
    _cursorPosition: null,

    /**
     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
     * от верхнего левого угла исходного изображения.
     * @type {Square}
     * @private
     */
    _resizeConstraint: null,

    /**
     * Отрисовка канваса.
     */
    redraw: function() {
      // Очистка изображения.
      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

      // Сохранение состояния канваса.
      // Подробней см. строку 132.
      this._ctx.save();

      // Установка начальной точки системы координат в центр холста.
      this._ctx.translate(this._container.width / 2, this._container.height / 2);

      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);

      // Отрисовка изображения на холсте. Параметры задают изображение, которое
      // нужно отрисовать и координаты его верхнего левого угла.
      // Координаты задаются от центра холста.
      this._ctx.drawImage(this._image, displX, displY);

      var strokeWidth = 4;

      var square = new Square(
          -this._resizeConstraint.side / 2,
          -this._resizeConstraint.side / 2,
          this._resizeConstraint.side);

      // Отрисовка пунктирной рамки
      drawDottedSquare(strokeWidth, '#ffe753', this._ctx, square);

      var clippingRegion = new Square(
          (-this._resizeConstraint.side / 2) - strokeWidth / 2,
          (-this._resizeConstraint.side / 2) - strokeWidth / 2,
          this._resizeConstraint.side + strokeWidth);

      this._ctx.beginPath();
      this._ctx.moveTo(-this._container.width / 2, -this._container.height / 2);
      this._ctx.lineTo(-this._container.width / 2, this._container.height / 2);
      this._ctx.lineTo(this._container.width / 2, this._container.height / 2);
      this._ctx.lineTo(this._container.width / 2, -this._container.height / 2);
      this._ctx.lineTo(-this._container.width / 2, -this._container.height / 2);

      this._ctx.moveTo(clippingRegion.x, clippingRegion.y);
      this._ctx.lineTo(clippingRegion.x + clippingRegion.side, clippingRegion.y);
      this._ctx.lineTo(clippingRegion.x + clippingRegion.side, clippingRegion.y + clippingRegion.side);
      this._ctx.lineTo(clippingRegion.x, clippingRegion.y + clippingRegion.side);
      this._ctx.lineTo(clippingRegion.x, clippingRegion.y);
      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this._ctx.fill('evenodd');

      this._ctx.fillStyle = 'white';
      this._ctx.font = '16px Tahoma';
      this._ctx.textAlign = 'center';
      this._ctx.textBaseline = 'bottom';
      this._ctx.fillText(this._image.naturalWidth + ' x ' + this._image.naturalHeight, 0, clippingRegion.y - 5);

      // Восстановление состояния канваса, которое было до вызова ctx.save
      // и последующего изменения системы координат. Нужно для того, чтобы
      // следующий кадр рисовался с привычной системой координат, где точка
      // 0 0 находится в левом верхнем углу холста, в противном случае
      // некорректно сработает даже очистка холста или нужно будет использовать
      // сложные рассчеты для координат прямоугольника, который нужно очистить.
      this._ctx.restore();
    },

    /**
     * Включение режима перемещения. Запоминается текущее положение курсора,
     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
     * позволяющие перерисовывать изображение по мере перетаскивания.
     * @param {number} x
     * @param {number} y
     * @private
     */
    _enterDragMode: function(x, y) {
      this._cursorPosition = new Coordinate(x, y);
      document.body.addEventListener('mousemove', this._onDrag);
      document.body.addEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Выключение режима перемещения.
     * @private
     */
    _exitDragMode: function() {
      this._cursorPosition = null;
      document.body.removeEventListener('mousemove', this._onDrag);
      document.body.removeEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Перемещение изображения относительно кадра.
     * @param {number} x
     * @param {number} y
     * @private
     */
    updatePosition: function(x, y) {
      this.moveConstraint(
          this._cursorPosition.x - x,
          this._cursorPosition.y - y);
      this._cursorPosition = new Coordinate(x, y);
    },

    /**
     * @param {MouseEvent} evt
     * @private
     */
    _onDragStart: function(evt) {
      this._enterDragMode(evt.clientX, evt.clientY);
    },

    /**
     * Обработчик окончания перетаскивания.
     * @private
     */
    _onDragEnd: function() {
      this._exitDragMode();
    },

    /**
     * Обработчик события перетаскивания.
     * @param {MouseEvent} evt
     * @private
     */
    _onDrag: function(evt) {
      this.updatePosition(evt.clientX, evt.clientY);
    },

    /**
     * Добавление элемента в DOM.
     * @param {Element} element
     */
    setElement: function(element) {
      if (this._element === element) {
        return;
      }

      this._element = element;
      this._element.insertBefore(this._container, this._element.firstChild);
      // Обработчики начала и конца перетаскивания.
      this._container.addEventListener('mousedown', this._onDragStart);
    },

    /**
     * Возвращает кадрирование элемента.
     * @return {Square}
     */
    getConstraint: function() {
      return this._resizeConstraint;
    },

    /**
     * Смещает кадрирование на значение указанное в параметрах.
     * @param {number} deltaX
     * @param {number} deltaY
     * @param {number} deltaSide
     */
    moveConstraint: function(deltaX, deltaY, deltaSide) {
      this.setConstraint(
          this._resizeConstraint.x + (deltaX || 0),
          this._resizeConstraint.y + (deltaY || 0),
          this._resizeConstraint.side + (deltaSide || 0));
    },

    constraintIsValid: function(x, y, side) {
      return x + side <= this._image.naturalWidth
       && y + side <= this._image.naturalHeight
       && x >= 0 && y >= 0 && side >= 0
       && x !== 'undefined'
       && y !== 'undefined'
       && side !== 'undefined';
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} side
     */
    setConstraint: function(x, y, side) {
      if (this.constraintIsValid(x, y, side)) {
        this._resizeConstraint.x = x;
        this._resizeConstraint.y = y;
        this._resizeConstraint.side = side;
        leftInput.value = parseInt(x, 10);
        topInput.value = parseInt(y, 10);
        sideInput.value = parseInt(side, 10);
        setFieldConstraint(this._image.naturalWidth, this._image.naturalHeight);
      }

      requestAnimationFrame(function() {
        this.redraw();
        window.dispatchEvent(new CustomEvent('resizerchange'));
      }.bind(this));
    },

    /**
     * Удаление. Убирает контейнер из родительского элемента, убирает
     * все обработчики событий и убирает ссылки.
     */
    remove: function() {
      this._element.removeChild(this._container);

      this._container.removeEventListener('mousedown', this._onDragStart);
      this._container = null;
    },

    /**
     * Экспорт обрезанного изображения как HTMLImageElement и исходником
     * картинки в src в формате dataURL.
     * @return {Image}
     */
    exportImage: function() {
      // Создаем Image, с размерами, указанными при кадрировании.
      var imageToExport = new Image();

      // Создается новый canvas, по размерам совпадающий с кадрированным
      // изображением, в него добавляется изображение взятое из канваса
      // с измененными координатами и сохраняется в dataURL, с помощью метода
      // toDataURL. Полученный исходный код, записывается в src у ранее
      // созданного изображения.
      var temporaryCanvas = document.createElement('canvas');
      var temporaryCtx = temporaryCanvas.getContext('2d');
      temporaryCanvas.width = this._resizeConstraint.side;
      temporaryCanvas.height = this._resizeConstraint.side;
      temporaryCtx.drawImage(this._image,
          -this._resizeConstraint.x,
          -this._resizeConstraint.y);
      imageToExport.src = temporaryCanvas.toDataURL('image/png');

      return imageToExport;
    }
  };

  /**
   * Вспомогательный тип, описывающий квадрат.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} side
   * @private
   */
  var Square = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  /**
   * Вспомогательный тип, описывающий координату.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @private
   */
  var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

  window.Resizer = Resizer;
})();

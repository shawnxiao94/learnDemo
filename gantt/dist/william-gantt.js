/*
 * @Author: your name
 * @Date: 2020-04-17 11:06:37
 * @LastEditTime: 2020-04-17 11:06:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gantt/dist/william-gantt.js
 */
var Gantt = (function () {
  'use strict';

  const YEAR = 'year';
  const MONTH = 'month';
  const DAY = 'day';
  const HOUR = 'hour';
  const MINUTE = 'minute';
  const SECOND = 'second';
  const MILLISECOND = 'millisecond';

  const month_names = {
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    zh: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
  };

  var date_utils = {
    parse(date, date_separator = '-', time_separator = /[.:]/) {
      if (date instanceof Date) {
        return date;
      }
      if (typeof date === 'string') {
        let date_parts, time_parts;
        const parts = date.split(' ');

        date_parts = parts[0]
          .split(date_separator)
          .map((val) => parseInt(val, 10));
        time_parts = parts[1] && parts[1].split(time_separator);

        date_parts[1] = date_parts[1] - 1;

        let vals = date_parts;

        if (time_parts && time_parts.length) {
          if (time_parts.length == 4) {
            time_parts[3] = '0.' + time_parts[3];
            time_parts[3] = parseFloat(time_parts[3]) * 1000;
          }
          vals = vals.concat(time_parts);
        }

        return new Date(...vals);
      }
    },

    to_string(date, with_time = false) {
      if (!(date instanceof Date)) {
        throw new TypeError('Invalid argument type');
      }
      const vals = this.get_date_values(date).map((val, i) => {
        if (i === 1) {
          val = val + 1;
        }

        if (i === 6) {
          return padStart(val + '', 3, '0');
        }

        return padStart(val + '', 2, '0');
      });
      const date_string = `${vals[0]}-${vals[1]}-${vals[2]}`;
      const time_string = `${vals[3]}:${vals[4]}:${vals[5]}.${vals[6]}`;

      return date_string + (with_time ? ' ' + time_string : '');
    },

    format(date, format_string = 'YYYY-MM-DD HH:mm:ss.SSS', lang = 'en') {
      const values = this.get_date_values(date).map((d) => padStart(d, 2, 0));
      const format_map = {
        YYYY: values[0],
        MM: padStart(+values[1] + 1, 2, 0),
        DD: values[2],
        HH: values[3],
        mm: values[4],
        ss: values[5],
        SSS: values[6],
        D: values[2],
        MMMM: month_names[lang][+values[1]],
        MMM: month_names[lang][+values[1]],
      };

      let str = format_string;
      const formatted_values = [];

      Object.keys(format_map)
        .sort((a, b) => b.length - a.length)
        .forEach((key) => {
          if (str.includes(key)) {
            str = str.replace(key, `$${formatted_values.length}`);
            formatted_values.push(format_map[key]);
          }
        });

      formatted_values.forEach((value, i) => {
        str = str.replace(`$${i}`, value);
      });

      return str;
    },

    diff(date_a, date_b, scale = DAY) {
      let milliseconds, seconds, hours, minutes, days, months, years;

      milliseconds = date_a - date_b;
      seconds = milliseconds / 1000;
      minutes = seconds / 60;
      hours = minutes / 60;
      days = hours / 24;
      months = days / 30;
      years = months / 12;

      if (!scale.endsWith('s')) {
        scale += 's';
      }

      return Math.floor(
        {
          milliseconds,
          seconds,
          minutes,
          hours,
          days,
          months,
          years,
        }[scale]
      );
    },

    today() {
      const vals = this.get_date_values(new Date()).slice(0, 3);
      return new Date(...vals);
    },

    now() {
      return new Date();
    },

    add(date, qty, scale) {
      qty = parseInt(qty, 10);
      const vals = [
        date.getFullYear() + (scale === YEAR ? qty : 0),
        date.getMonth() + (scale === MONTH ? qty : 0),
        date.getDate() + (scale === DAY ? qty : 0),
        date.getHours() + (scale === HOUR ? qty : 0),
        date.getMinutes() + (scale === MINUTE ? qty : 0),
        date.getSeconds() + (scale === SECOND ? qty : 0),
        date.getMilliseconds() + (scale === MILLISECOND ? qty : 0),
      ];
      return new Date(...vals);
    },

    start_of(date, scale) {
      const scores = {
        [YEAR]: 6,
        [MONTH]: 5,
        [DAY]: 4,
        [HOUR]: 3,
        [MINUTE]: 2,
        [SECOND]: 1,
        [MILLISECOND]: 0,
      };

      function should_reset(_scale) {
        const max_score = scores[scale];
        return scores[_scale] <= max_score;
      }

      const vals = [
        date.getFullYear(),
        should_reset(YEAR) ? 0 : date.getMonth(),
        should_reset(MONTH) ? 1 : date.getDate(),
        should_reset(DAY) ? 0 : date.getHours(),
        should_reset(HOUR) ? 0 : date.getMinutes(),
        should_reset(MINUTE) ? 0 : date.getSeconds(),
        should_reset(SECOND) ? 0 : date.getMilliseconds(),
      ];

      return new Date(...vals);
    },

    clone(date) {
      return new Date(...this.get_date_values(date));
    },

    get_date_values(date) {
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ];
    },

    get_days_in_month(date) {
      const no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      const month = date.getMonth();

      if (month !== 1) {
        return no_of_days[month];
      }

      const year = date.getFullYear();
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return 29;
      }
      return 28;
    },
  };

  function padStart(str, targetLength, padString) {
    str = str + '';
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length > targetLength) {
      return String(str);
    } else {
      targetLength = targetLength - str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(str);
    }
  }

  function $(expr, con) {
    return typeof expr === 'string'
      ? (con || document).querySelector(expr)
      : expr || null;
  }

  function createHTML(tag, attrs, noSVG) {
    const elem = document.createElement(tag);
    for (let attr in attrs) {
      if (attr === 'append_to') {
        const parent = attrs.append_to;
        parent.appendChild(elem);
      } else if (attr === 'innerHTML') {
        elem.innerHTML = attrs.innerHTML;
      } else if (attr === 'width' || attr === 'height') {
        elem.style[attr] =
          String(attrs[attr]).indexOf('%') > -1
            ? attrs[attr]
            : attrs[attr] + 'px';
        elem.setAttribute(attr, attrs[attr]);
      } else if (attr === 'x') {
        elem.style.left = attrs[attr] + 'px';
        elem.setAttribute(attr, attrs[attr]);
      } else if (attr === 'y') {
        elem.style.top = attrs[attr] + 'px';
        elem.setAttribute(attr, attrs[attr]);
      } else {
        elem.setAttribute(attr, attrs[attr]);
      }
    }
    if (!noSVG) {
      elem.classList.add('gantt-svg');
    }
    return elem;
  }

  $.on = (element, event, selector, callback) => {
    if (!callback) {
      callback = selector;
      $.bind(element, event, callback);
    } else {
      $.delegate(element, event, selector, callback);
    }
  };

  $.off = (element, event, handler) => {
    element.removeEventListener(event, handler);
  };

  $.bind = (element, event, callback) => {
    event.split(/\s+/).forEach(function (event) {
      element.addEventListener(event, callback);
    });
  };

  $.delegate = (element, event, selector, callback) => {
    element.addEventListener(event, function (e) {
      const delegatedTarget = e.target.closest(selector);
      if (delegatedTarget) {
        e.delegatedTarget = delegatedTarget;
        callback.call(this, e, delegatedTarget);
      }
    });
  };

  $.closest = (selector, element) => {
    if (!element) return null;

    if (element.matches(selector)) {
      return element;
    }

    return $.closest(selector, element.parentNode);
  };

  $.attr = (element, attr, value) => {
    if (!value && value !== 0 && typeof attr === 'string') {
      return element.getAttribute(attr);
    }

    if (typeof attr === 'object') {
      for (let key in attr) {
        $.attr(element, key, attr[key]);
      }
      return;
    }
    if (attr === 'width' || attr === 'height') {
      element.style[attr] =
        String(value).indexOf('%') > -1 ? value : value + 'px';
    } else if (attr === 'x') {
      element.style.left = value + 'px';
    } else if (attr === 'y') {
      element.style.top = value + 'px';
    }
    element.setAttribute(attr, value);
  };

  /* eslint-disable */
  if (!Element.prototype.matches)
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest)
    Element.prototype.closest = function (s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };

  class Bar {
    constructor(gantt, task) {
      this.set_defaults(gantt, task);
      this.prepare();
      this.draw();
      this.bind();
    }

    set_defaults(gantt, task) {
      this.action_completed = false;
      this.gantt = gantt;
      this.task = task;
    }

    prepare() {
      this.prepare_values();
      this.prepare_helpers();
    }

    prepare_values() {
      this.invalid = this.task.invalid;
      this.height = this.gantt.options.bar_height;
      this.x = this.compute_x();
      this.y = this.compute_y();
      this.corner_radius = this.gantt.options.bar_corner_radius;
      this.duration =
        date_utils.diff(this.task._end, this.task._start, 'hour') /
        this.gantt.options.step;
      this.width = this.gantt.options.column_width * this.duration;
      this.progress_width =
        this.gantt.options.column_width *
          this.duration *
          (this.task.progress / 100) || 0;
      this.group = createHTML('div', {
        class: 'bar-wrapper ' + (this.task.custom_class || ''),
        'data-id': this.task.id,
      });
      this.bar_group = createHTML('div', {
        class: 'bar-group',
        append_to: this.group,
      });
      this.handle_group = createHTML('div', {
        class: 'handle-group',
        append_to: this.group,
      });
    }

    prepare_helpers() {
      HTMLElement.prototype.getX = function () {
        return +this.getAttribute('x');
      };
      HTMLElement.prototype.getY = function () {
        return +this.getAttribute('y');
      };
      HTMLElement.prototype.getWidth = function () {
        return +this.getAttribute('width');
      };
      HTMLElement.prototype.getHeight = function () {
        return +this.getAttribute('height');
      };
      HTMLElement.prototype.getEndX = function () {
        return this.getX() + this.getWidth();
      };
      HTMLElement.prototype.getEndY = function () {
        return this.getY() + this.getHeight();
      };
    }

    draw() {
      this.draw_bar();
      this.draw_progress_bar();
      this.draw_label();
      this.draw_resize_handles();
    }

    draw_bar() {
      this.$bar = createHTML('div', {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        class: 'bar',
        append_to: this.bar_group,
      });
      this.$bar.style.borderRadius = this.corner_radius + 'px';

      if (this.invalid) {
        this.$bar.classList.add('bar-invalid');
      }
    }

    draw_progress_bar() {
      if (this.invalid) return;
      this.$bar_progress = createHTML('div', {
        x: this.x,
        y: this.y,
        width: this.progress_width,
        height: this.height,
        class: 'bar-progress',
        append_to: this.bar_group,
      });
      this.$bar_progress.style.borderRadius = this.corner_radius + 'px';
    }

    draw_label() {
      createHTML('div', {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        innerHTML: this.task.name,
        class: 'bar-label',
        append_to: this.bar_group,
      });
      requestAnimationFrame(() => this.update_label_position());
    }

    draw_resize_handles() {
      if (this.invalid) return;

      const bar = this.$bar;
      const handle_width = 8;

      const $handle_right = createHTML('div', {
        x: bar.getX() + bar.getWidth() - 9,
        y: bar.getY() + 1,
        width: handle_width,
        height: this.height - 2,
        class: 'handle right',
        append_to: this.handle_group,
      });
      $handle_right.style.borderRadius = this.corner_radius + 'px';

      const $handle_left = createHTML('div', {
        x: bar.getX() + 1,
        y: bar.getY() + 1,
        width: handle_width,
        height: this.height - 2,
        class: 'handle left',
        append_to: this.handle_group,
      });
      $handle_left.style.borderRadius = this.corner_radius + 'px';

      if (this.task.progress && this.task.progress < 100) {
        this.$handle_progress = createHTML('div', {
          x: this.$bar_progress.getEndX() - 5,
          y: this.$bar_progress.getEndY() - 10,
          width: 0,
          height: 0,
          class: 'handle progress',
          append_to: this.handle_group,
        });
      }
    }

    bind() {
      if (this.invalid) return;
      this.setup_click_event();
    }

    setup_click_event() {
      $.on(this.group, 'focus ' + this.gantt.options.popup_trigger, (e) => {
        if (this.action_completed) {
          return;
        }

        if (e.type === 'click') {
          this.gantt.trigger_event('click', [this.task]);
        }

        this.gantt.unselect_all();
        this.group.classList.toggle('active');

        this.show_popup();
      });
    }

    show_popup() {
      if (this.gantt.bar_being_dragged) return;

      const start_date = date_utils.format(
        this.task._start,
        'YYYY年MM月D日 HH:mm:ss',
        this.gantt.options.language
      );
      const end_date = date_utils.format(
        date_utils.add(this.task._end, -1, 'second'),
        'YYYY年MM月D日 HH:mm:ss',
        this.gantt.options.language
      );
      const subtitle = start_date + ' - ' + end_date;

      this.gantt.show_popup({
        target_element: this.$bar,
        title: this.task.name,
        subtitle: subtitle,
        task: this.task,
      });
    }

    update_bar_position({ x = null, width = null }) {
      const bar = this.$bar;
      if (x) {
        const xs = this.task.dependencies.map((dep) => {
          return this.gantt.get_bar(dep).$bar.getX();
        });
        const valid_x = xs.reduce((prev, curr) => {
          return x >= curr;
        }, x);
        if (!valid_x) {
          width = null;
          return;
        }
        this.update_attr(bar, 'x', x);
      }
      if (width && width >= this.gantt.options.column_width) {
        this.update_attr(bar, 'width', width);
      }
      this.update_label_position();
      this.update_handle_position();
      this.update_progressbar_position();
      this.update_arrow_position();
    }

    date_changed() {
      let changed = false;
      const { new_start_date, new_end_date } = this.compute_start_end_date();

      if (Number(this.task._start) !== Number(new_start_date)) {
        changed = true;
        this.task._start = new_start_date;
      }

      if (Number(this.task._end) !== Number(new_end_date)) {
        changed = true;
        this.task._end = new_end_date;
      }

      if (!changed) return;

      this.gantt.trigger_event('date_change', [
        this.task,
        new_start_date,
        date_utils.add(new_end_date, -1, 'second'),
      ]);
    }

    progress_changed() {
      const new_progress = this.compute_progress();
      this.task.progress = new_progress;
      this.gantt.trigger_event('progress_change', [this.task, new_progress]);
    }

    set_action_completed() {
      this.action_completed = true;
      setTimeout(() => {
        this.action_completed = false;
      }, 100);
    }

    compute_start_end_date() {
      const bar = this.$bar;
      const x_in_units = bar.getX() / this.gantt.options.column_width;
      const new_start_date = date_utils.add(
        this.gantt.gantt_start,
        x_in_units * this.gantt.options.step,
        'hour'
      );
      const width_in_units = bar.getWidth() / this.gantt.options.column_width;
      const new_end_date = date_utils.add(
        new_start_date,
        width_in_units * this.gantt.options.step,
        'hour'
      );

      return { new_start_date, new_end_date };
    }

    compute_progress() {
      const progress =
        (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100;
      return parseInt(progress, 10);
    }

    compute_x() {
      const { step, column_width } = this.gantt.options;
      const task_start = this.task._start;
      const gantt_start = this.gantt.gantt_start;

      const diff = date_utils.diff(task_start, gantt_start, 'hour');
      let x = (diff / step) * column_width;

      if (this.gantt.view_is('Month')) {
        const diff = date_utils.diff(task_start, gantt_start, 'day');
        x = (diff * column_width) / 30;
      }
      return x;
    }

    compute_y() {
      return (
        this.gantt.options.header_height +
        this.gantt.options.padding +
        this.task._index * (this.height + this.gantt.options.padding)
      );
    }

    get_snap_position(dx) {
      let odx = dx,
        rem,
        position;

      if (this.gantt.view_is('Week')) {
        rem = dx % (this.gantt.options.column_width / 7);
        position =
          odx -
          rem +
          (rem < this.gantt.options.column_width / 14
            ? 0
            : this.gantt.options.column_width / 7);
      } else if (this.gantt.view_is('Month')) {
        rem = dx % (this.gantt.options.column_width / 30);
        position =
          odx -
          rem +
          (rem < this.gantt.options.column_width / 60
            ? 0
            : this.gantt.options.column_width / 30);
      } else {
        rem = dx % this.gantt.options.column_width;
        position =
          odx -
          rem +
          (rem < this.gantt.options.column_width / 2
            ? 0
            : this.gantt.options.column_width);
      }
      return position;
    }

    update_attr(element, attr, value) {
      value = +value;
      if (!isNaN(value)) {
        $.attr(element, attr, value);
      }
      return element;
    }

    update_progressbar_position() {
      $.attr(this.$bar_progress, 'x', this.$bar.getX());
      $.attr(
        this.$bar_progress,
        'width',
        this.$bar.getWidth() * (this.task.progress / 100)
      );
    }

    update_label_position() {
      const bar = this.$bar,
        label = this.group.querySelector('.bar-label');
      if (label.offsetWidth > bar.getWidth()) {
        label.classList.add('big');
        $.attr(label, 'x', bar.getX() + bar.getWidth() + 5);
        label.style.transform = 'translate(0,-50%)';
      } else {
        label.classList.remove('big');
        $.attr(label, 'x', bar.getX() + bar.getWidth() / 2);
        label.style.transform = 'translate(-50%,-50%)';
      }
    }

    update_handle_position() {
      const bar = this.$bar;
      $.attr(
        this.handle_group.querySelector('.handle.left'),
        'x',
        bar.getX() + 1
      );
      $.attr(
        this.handle_group.querySelector('.handle.right'),
        'x',
        bar.getEndX() - 9
      );
      const handle = this.group.querySelector('.handle.progress');
      if (handle) {
        $.attr(handle, 'x', this.get_progress_polygon_points().x);
        $.attr(handle, 'y', this.get_progress_polygon_points().y);
      }
    }

    get_progress_polygon_points() {
      const bar_progress = this.$bar_progress;
      return {
        x: bar_progress.getEndX() - 5,
        y: bar_progress.getEndY() - 10,
      };
    }

    update_arrow_position() {
      this.arrows = this.arrows || [];
      for (let arrow of this.arrows) {
        arrow.update();
      }
    }
  }

  class Arrow {
    constructor(gantt, from_task, to_task) {
      this.gantt = gantt;
      this.from_task = from_task;
      this.to_task = to_task;

      this.calculate_path();
      if (this.from_is_below_to) {
        return false;
      }
      this.draw();
      this.resize();
    }

    calculate_path() {
      let start_x =
        this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;

      const condition = () =>
        this.to_task.$bar.getX() < start_x + this.gantt.options.padding &&
        start_x > this.from_task.$bar.getX() + this.gantt.options.padding;

      while (condition()) {
        start_x -= 10;
      }

      const start_y =
        this.gantt.options.header_height +
        this.gantt.options.bar_height +
        (this.gantt.options.padding + this.gantt.options.bar_height) *
          this.from_task.task._index +
        this.gantt.options.padding;

      const end_x = this.to_task.$bar.getX() - this.gantt.options.padding / 2;
      const end_y =
        this.gantt.options.header_height +
        this.gantt.options.bar_height / 2 +
        (this.gantt.options.padding + this.gantt.options.bar_height) *
          this.to_task.task._index +
        this.gantt.options.padding;

      this.from_is_below_to =
        this.from_task.task._index > this.to_task.task._index;
      const curve = this.gantt.options.arrow_curve;
      const curve_y = this.from_is_below_to ? -curve : curve;
      const offset = this.from_is_below_to
        ? end_y + this.gantt.options.arrow_curve
        : end_y - this.gantt.options.arrow_curve;

      this.element = createHTML('div', {
        'data-from': this.from_task.task.id,
        'data-to': this.to_task.task.id,
        class: 'bar-arrow',
      });

      this.path = {
        start_x,
        start_y,
        offset,
        end_x,
      };

      if (
        this.to_task.$bar.getX() <
        this.from_task.$bar.getX() + this.gantt.options.padding
      ) {
        const down_1 = this.gantt.options.padding / 2;
        const down_2 =
          this.to_task.$bar.getY() +
          this.to_task.$bar.getHeight() / 2 -
          curve_y;
        const left = this.to_task.$bar.getX() - this.gantt.options.padding;

        this.path = {
          start_x,
          start_y,
          down_1,
          offset,
          end_x,
          down_2,
          left,
        };
      }
    }

    draw() {
      this.element_path_a = createHTML('div', {
        append_to: this.element,
        class: 'gantt-arrow',
      });
      this.element_path_b = createHTML('div', {
        append_to: this.element,
        class: 'gantt-arrow',
      });
      this.element_path_c = createHTML('div', {
        append_to: this.element,
        class: 'gantt-arrow',
      });
      this.element_path_d = createHTML('div', {
        append_to: this.element,
        class: 'gantt-arrow',
      });
      this.element_path_e = createHTML('div', {
        append_to: this.element,
        class: 'gantt-arrow-icon',
      });
    }

    resize() {
      if (
        this.to_task.$bar.getX() <
        this.from_task.$bar.getX() + this.gantt.options.padding
      ) {
        this.element_path_c.style.display = 'block';
        this.element_path_d.style.display = 'block';
        $.attr(this.element_path_a, 'data', 'left_a');
        $.attr(this.element_path_a, 'x', this.path.start_x);
        $.attr(this.element_path_a, 'y', this.path.start_y);
        $.attr(this.element_path_a, 'width', 2);
        $.attr(this.element_path_a, 'height', this.path.down_1);
        $.attr(this.element_path_b, 'data', 'left_b');
        $.attr(this.element_path_b, 'x', this.path.left);
        $.attr(
          this.element_path_b,
          'y',
          this.path.start_y + this.path.down_1 - 2
        );
        $.attr(
          this.element_path_b,
          'width',
          this.path.start_x - this.path.left
        );
        $.attr(this.element_path_b, 'height', 2);
        $.attr(this.element_path_c, 'data', 'left_c');
        $.attr(this.element_path_c, 'x', this.path.left);
        $.attr(
          this.element_path_c,
          'y',
          this.path.start_y + this.path.down_1 - 2
        );
        $.attr(this.element_path_c, 'width', 2);
        $.attr(
          this.element_path_c,
          'height',
          this.path.down_2 - (this.path.start_y + this.path.down_1 - 2)
        );
        $.attr(this.element_path_d, 'data', 'left_d');
        $.attr(this.element_path_d, 'x', this.path.left);
        $.attr(this.element_path_d, 'y', this.path.down_2);
        $.attr(this.element_path_d, 'width', this.path.end_x - this.path.left);
        $.attr(this.element_path_d, 'height', 2);
        $.attr(this.element_path_e, 'data', 'left_e');
        $.attr(this.element_path_e, 'x', this.path.end_x - 4);
        $.attr(this.element_path_e, 'y', this.path.down_2 - 4);
      } else {
        $.attr(this.element_path_a, 'data', 'center_a');
        $.attr(this.element_path_a, 'x', this.path.start_x);
        $.attr(this.element_path_a, 'y', this.path.start_y);
        $.attr(this.element_path_a, 'width', 2);
        $.attr(
          this.element_path_a,
          'height',
          this.path.offset - this.path.start_y
        );
        $.attr(this.element_path_b, 'data', 'center_b');
        $.attr(this.element_path_b, 'x', this.path.start_x);
        $.attr(this.element_path_b, 'y', this.path.offset);
        $.attr(
          this.element_path_b,
          'width',
          this.path.end_x - this.path.start_x
        );
        $.attr(this.element_path_b, 'height', 2);
        $.attr(this.element_path_e, 'data', 'left_e');
        $.attr(this.element_path_e, 'x', this.path.end_x - 4);
        $.attr(this.element_path_e, 'y', this.path.offset - 4);
        this.element_path_c.style.display = 'none';
        this.element_path_d.style.display = 'none';
      }
    }

    update() {
      this.calculate_path();
      if (this.from_is_below_to) {
        return false;
      }
      this.resize();
    }
  }

  class Popup {
    constructor(parent, custom_html) {
      this.parent = parent;
      this.custom_html = custom_html;
      this.make();
    }

    make() {
      this.parent.innerHTML = `
              <div class="title"></div>
              <div class="subtitle"></div>
              <div class="pointer"></div>
          `;

      this.hide();

      this.title = this.parent.querySelector('.title');
      this.subtitle = this.parent.querySelector('.subtitle');
      this.pointer = this.parent.querySelector('.pointer');
    }

    show(options) {
      if (!options.target_element) {
        throw new Error('target_element is required to show popup');
      }
      if (!options.position) {
        options.position = 'left';
      }
      const target_element = options.target_element;

      if (this.custom_html) {
        let html = this.custom_html(options.task);
        html += '<div class="pointer"></div>';
        this.parent.innerHTML = html;
        this.pointer = this.parent.querySelector('.pointer');
      } else {
        this.title.innerHTML = options.title;
        this.subtitle.innerHTML =
          options.subtitle + `<br>进度:${options.task.progress}%`;
        this.parent.style.width = this.parent.clientWidth || 200 + 'px';
      }

      if (options.position === 'left') {
        this.parent.style.left =
          target_element.offsetLeft + target_element.offsetWidth + 15 + 'px';
        this.parent.style.top = target_element.offsetTop + 'px';

        this.pointer.style.transform = 'rotateZ(90deg)';
        this.pointer.style.left = '-7px';
        this.pointer.style.top = '2px';
      }

      this.parent.style.display = 'block';
    }

    hide() {
      this.parent.style.display = 'none';
    }
  }

  class TaskTable {
    constructor(gantt, options) {
      this.setup_options(gantt, options);
      this.render();
      this.bind();
    }
    setup_options(gantt, options) {
      this.gantt = gantt;
      this.tasks = gantt.tasks;
      const default_options = {
        grid: [
          {
            key: 'id',
            name: 'ID',
            width: 50,
          },
          {
            key: 'name',
            name: '任务名称',
            width: 150,
          },
          {
            key: 'start',
            name: '开始时间',
            width: 100,
          },
          {
            key: 'end',
            name: '结束时间',
            width: 100,
          },
          {
            key: 'progress',
            name: '进度',
            width: 60,
          },
        ],
      };
      this.options = Object.assign(default_options, options);
    }
    render() {
      this.make_tables();
    }
    make_tables() {
      const row_height =
        this.gantt.options.bar_height + this.gantt.options.padding;
      let row_y =
        this.gantt.options.header_height + this.gantt.options.padding / 2;
      this.$rows = [];
      for (let task of this.tasks) {
        let $row;
        $row = createHTML('div', {
          x: 0,
          y: row_y,
          height: row_height,
          'data-id': task.id,
          class: 'task-table-row',
          append_to: this.gantt.$task_table,
        });
        this.make_tables_row(task, $row);
        this.$rows.push($row);
        row_y += this.gantt.options.bar_height + this.gantt.options.padding;
      }
      this.make_tables_header();
    }
    make_tables_row(task, $row) {
      for (let column of this.options.grid) {
        switch (column.key) {
          case 'id':
            createHTML(
              'div',
              {
                class: 'task-table-column task-table-column-id',
                innerHTML: `<span>${task.id}</span>`,
                width: column.width,
                append_to: $row,
              },
              true
            );
            break;
          case 'name':
            createHTML(
              'div',
              {
                class: 'task-table-column task-table-column-name',
                innerHTML: `<span>${task.name}</span>`,
                width: column.width,
                append_to: $row,
              },
              true
            );
            break;
          case 'start':
            createHTML(
              'div',
              {
                class: 'task-table-column task-table-column-start',
                innerHTML: `<span>${task.start}</span>`,
                width: column.width,
                append_to: $row,
              },
              true
            );
            break;
          case 'end':
            createHTML(
              'div',
              {
                class: 'task-table-column task-table-column-end',
                innerHTML: `<span>${task.end}</span>`,
                width: column.width,
                append_to: $row,
              },
              true
            );
            break;
          case 'progress':
            createHTML(
              'div',
              {
                class: 'task-table-column task-table-column-progress',
                innerHTML: `<span>${task.progress}%</span>`,
                width: column.width,
                append_to: $row,
              },
              true
            );
            break;
        }
      }
    }
    make_tables_header() {
      let header_height =
        this.gantt.options.header_height + this.gantt.options.padding / 2;
      const $header = createHTML('div', {
        x: 0,
        y: 0,
        height: header_height,
        class: 'task-table-header',
        append_to: this.gantt.$task_table,
      });
      for (let column of this.options.grid) {
        createHTML(
          'div',
          {
            class:
              'task-table-header-column' + ` task-table-column-${column.key}`,
            innerHTML: `<span>${column.name}</span>`,
            width: column.width,
            append_to: $header,
          },
          true
        );
      }
    }
    bind() {}
  }

  class Gantt {
    constructor(wrapper, tasks, options) {
      this.setup_wrapper(wrapper);
      this.setup_options(options);
      this.setup_tasks(tasks);
      this.change_view_mode();
      this.bind_events();
    }

    setup_wrapper(element) {
      let svg_element;

      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      if (element instanceof HTMLElement) {
        svg_element = element.querySelector('.gantt');
      } else {
        throw new TypeError(
          'Frappé Gantt only supports usage of a string CSS selector,' +
            " HTML DOM element or SVG DOM element for the 'element' parameter"
        );
      }

      if (!svg_element) {
        this.$svg = createHTML(
          'div',
          {
            class: 'gantt',
          },
          true
        );
      } else {
        this.$svg = svg_element;
        this.$svg.classList.add('gantt');
      }
      this.$popup_wrapper = document.createElement('div');
      this.$popup_wrapper.classList.add('popup-wrapper');
      this.$container = document.createElement('div');
      this.$container.classList.add('gantt-container');
      this.$container.appendChild(this.$svg);
      this.$container.appendChild(this.$popup_wrapper);

      this.$task_table = document.createElement('div');
      this.$task_table.classList.add('gantt-task-table');

      this.$layout_line_left = document.createElement('div');
      this.$layout_line_left.classList.add('gantt-layout-line-left');
      this.$layout_line_right = document.createElement('div');
      this.$layout_line_right.classList.add('gantt-layout-line-right');
      this.$layout_line = document.createElement('div');
      this.$layout_line.classList.add('gantt-layout-line');
      this.$layout_line.appendChild(this.$layout_line_left);
      this.$layout_line.appendChild(this.$layout_line_right);

      this.$layout = document.createElement('div');
      this.$layout.classList.add('gantt-layout');
      this.$layout.appendChild(this.$task_table);
      this.$layout.appendChild(this.$layout_line);
      this.$layout.appendChild(this.$container);
      element.appendChild(this.$layout);
    }

    setup_options(options) {
      const default_options = {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month', 'Year'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        popup_trigger: 'click',
        custom_popup_html: null,
        layout_left_width: 460,
        layout_height: 300,
        language: 'en',
      };
      this.options = Object.assign({}, default_options, options);
    }

    setup_tasks(tasks) {
      this.tasks = tasks.map((task, i) => {
        task._start = date_utils.parse(task.start);
        task._end = date_utils.parse(task.end);

        if (date_utils.diff(task._end, task._start, 'year') > 10) {
          task.end = null;
        }

        task._index = i;

        if (!task.start && !task.end) {
          const today = date_utils.today();
          task._start = today;
          task._end = date_utils.add(today, 2, 'day');
        }

        if (!task.start && task.end) {
          task._start = date_utils.add(task._end, -2, 'day');
        }

        if (task.start && !task.end) {
          task._end = date_utils.add(task._start, 2, 'day');
        }

        // const task_end_values = date_utils.get_date_values(task._end);
        // if (task_end_values.slice(3).every(d => d === 0)) {
        //     task._end = date_utils.add(task._end, 24, 'hour');
        // }

        if (!task.start || !task.end) {
          task.invalid = true;
        }

        if (typeof task.dependencies === 'string' || !task.dependencies) {
          let deps = [];
          if (task.dependencies) {
            deps = task.dependencies
              .split(',')
              .map((d) => d.trim())
              .filter((d) => d);
          }
          task.dependencies = deps;
        }

        if (!task.id) {
          task.id = generate_id(task);
        }

        return task;
      });

      this.setup_dependencies();
    }

    setup_dependencies() {
      this.dependency_map = {};
      for (let t of this.tasks) {
        for (let d of t.dependencies) {
          this.dependency_map[d] = this.dependency_map[d] || [];
          this.dependency_map[d].push(t.id);
        }
      }
    }

    refresh(tasks) {
      this.setup_tasks(tasks);
      this.change_view_mode();
    }

    change_view_mode(mode = this.options.view_mode) {
      this.update_view_scale(mode);
      this.setup_dates();
      this.render();
      this.trigger_event('view_change', [mode]);
    }

    update_view_scale(view_mode) {
      this.options.view_mode = view_mode;

      if (view_mode === 'Day') {
        this.options.step = 24;
        this.options.column_width = 38;
      } else if (view_mode === 'Half Day') {
        this.options.step = 24 / 2;
        this.options.column_width = 38;
      } else if (view_mode === 'Quarter Day') {
        this.options.step = 24 / 4;
        this.options.column_width = 38;
      } else if (view_mode === 'Week') {
        this.options.step = 24 * 7;
        this.options.column_width = 140;
      } else if (view_mode === 'Month') {
        this.options.step = 24 * 30;
        this.options.column_width = 120;
      } else if (view_mode === 'Year') {
        this.options.step = 24 * 365;
        this.options.column_width = 120;
      }
    }

    setup_dates() {
      this.setup_gantt_dates();
      this.setup_date_values();
    }

    setup_gantt_dates() {
      this.gantt_start = this.gantt_end = null;

      for (let task of this.tasks) {
        if (!this.gantt_start || task._start < this.gantt_start) {
          this.gantt_start = task._start;
        }
        if (!this.gantt_end || task._end > this.gantt_end) {
          this.gantt_end = task._end;
        }
      }

      this.gantt_start = date_utils.start_of(this.gantt_start, 'day');
      this.gantt_end = date_utils.start_of(this.gantt_end, 'day');

      if (this.view_is(['Quarter Day', 'Half Day'])) {
        this.gantt_start = date_utils.add(this.gantt_start, -7, 'day');
        this.gantt_end = date_utils.add(this.gantt_end, 7, 'day');
      } else if (this.view_is('Month')) {
        this.gantt_start = date_utils.start_of(this.gantt_start, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'year');
      } else if (this.view_is('Year')) {
        this.gantt_start = date_utils.add(this.gantt_start, -2, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 2, 'year');
      } else {
        this.gantt_start = date_utils.add(this.gantt_start, -1, 'month');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'month');
      }
    }

    setup_date_values() {
      this.dates = [];
      let cur_date = null;

      while (cur_date === null || cur_date < this.gantt_end) {
        if (!cur_date) {
          cur_date = date_utils.clone(this.gantt_start);
        } else {
          if (this.view_is('Year')) {
            cur_date = date_utils.add(cur_date, 1, 'year');
          } else if (this.view_is('Month')) {
            cur_date = date_utils.add(cur_date, 1, 'month');
          } else {
            cur_date = date_utils.add(cur_date, this.options.step, 'hour');
          }
        }
        this.dates.push(cur_date);
      }
    }

    bind_events() {
      this.bind_grid_click();
      this.bind_bar_events();
      this.bind_layout_line_move();
    }

    render() {
      this.clear();
      this.setup_layers();
      this.make_grid();
      this.make_task_tables();
      this.make_dates();
      this.make_bars();
      this.make_arrows();
      this.map_arrows_on_bars();
      this.set_width();
      this.set_scroll_position();
    }

    setup_layers() {
      this.layers = {};
      this.layers.header = createHTML('div', {
        class: 'gantt-header',
        append_to: this.$svg,
      });
      this.layers.main = createHTML('div', {
        class: 'gantt-main',
        append_to: this.$svg,
      });
      const layers = ['grid', 'date', 'arrow', 'progress', 'bar'];
      for (let layer of layers) {
        if (layer === 'date') {
          this.layers[layer] = createHTML('div', {
            class: layer,
            append_to: this.layers.header,
          });
        } else {
          this.layers[layer] = createHTML('div', {
            class: layer,
            append_to: this.layers.main,
          });
        }
      }
    }

    make_grid() {
      this.make_layout();
      this.make_grid_rows();
      this.make_grid_header();
      this.make_grid_ticks();
      this.make_grid_highlights();
    }

    make_layout() {
      const grid_width = this.dates.length * this.options.column_width;
      const grid_height =
        this.options.header_height +
        this.options.padding +
        (this.options.bar_height + this.options.padding) * this.tasks.length;
      const header_height =
        this.options.header_height + this.options.padding / 2;
      $.attr(this.$svg, {
        height: grid_height,
        width: grid_width,
      });
      $.attr(this.$container, {
        height: grid_height + 18,
      });
      $.attr(this.$task_table, {
        width: this.options.layout_left_width,
        height: grid_height + 18,
      });
      $.attr(this.$layout_line, {
        height: grid_height + 18,
      });
    }

    make_grid_rows() {
      const rows_layer = createHTML('div', {
        append_to: this.layers.grid,
        class: 'group-rows',
      });
      const lines_layer = createHTML('div', {
        append_to: this.layers.grid,
        class: 'group-lines',
      });

      const row_width = this.dates.length * this.options.column_width;
      const row_height = this.options.bar_height + this.options.padding;

      let row_y = this.options.header_height + this.options.padding / 2;

      for (let task of this.tasks) {
        createHTML('div', {
          x: 0,
          y: row_y,
          width: row_width,
          height: row_height,
          class: 'grid-row',
          append_to: rows_layer,
        });

        createHTML('div', {
          x1: 0,
          y1: row_y + row_height,
          x2: row_width,
          y2: row_y + row_height,
          class: 'row-line',
          append_to: lines_layer,
        });

        row_y += this.options.bar_height + this.options.padding;
      }
    }

    make_grid_header() {
      const header_width = this.dates.length * this.options.column_width;
      const header_height =
        this.options.header_height + this.options.padding / 2;
      createHTML('div', {
        x: 0,
        y: 0,
        width: header_width,
        height: header_height,
        class: 'grid-header',
        append_to: this.layers.date,
      });
    }

    make_grid_ticks() {
      let tick_x = 0;
      let tick_y = this.options.header_height + this.options.padding / 2;
      let tick_height =
        (this.options.bar_height + this.options.padding) * this.tasks.length;
      let $ticks = createHTML('div', {
        class: 'ticks',
        append_to: this.layers.grid,
      });
      for (let date of this.dates) {
        let tick_class = 'tick';
        if (this.view_is('Day') && date.getDate() === 1) {
          tick_class += ' thick';
        }
        if (this.view_is('Week') && date.getDate() >= 1 && date.getDate() < 8) {
          tick_class += ' thick';
        }
        if (this.view_is('Month') && (date.getMonth() + 1) % 3 === 1) {
          tick_class += ' thick';
        }

        createHTML('div', {
          x: tick_x,
          y: tick_y,
          width: 1,
          height: tick_height,
          class: tick_class,
          append_to: $ticks,
        });

        if (this.view_is('Month')) {
          tick_x +=
            (date_utils.get_days_in_month(date) * this.options.column_width) /
            30;
        } else {
          tick_x += this.options.column_width;
        }
      }
    }

    make_task_tables() {
      this.task_tables = new TaskTable(this, {});
    }

    make_grid_highlights() {
      if (this.view_is('Day')) {
        const x =
          (date_utils.diff(date_utils.today(), this.gantt_start, 'hour') /
            this.options.step) *
          this.options.column_width;
        const y = 0;

        const width = this.options.column_width;
        const height =
          (this.options.bar_height + this.options.padding) * this.tasks.length +
          this.options.header_height +
          this.options.padding / 2;

        createHTML('div', {
          x,
          y,
          width,
          height,
          class: 'today-highlight',
          append_to: this.layers.grid,
        });
      }
    }

    make_dates() {
      for (let date of this.get_dates_to_draw()) {
        createHTML('div', {
          x: date.lower_x,
          y: date.lower_y,
          innerHTML: date.lower_text,
          class: 'lower-text',
          append_to: this.layers.date,
        });

        if (date.upper_text) {
          createHTML('div', {
            x: date.upper_x,
            y: date.upper_y,
            innerHTML: date.upper_text,
            class: 'upper-text',
            append_to: this.layers.date,
          });
        }
      }
    }

    get_dates_to_draw() {
      let last_date = null;
      let is_month_width = 0;
      const dates = this.dates.map((date, i) => {
        let date_length_in_month = date_utils.get_days_in_month(date);
        const d = this.get_date_info(
          date,
          last_date,
          i,
          is_month_width,
          date_length_in_month
        );
        last_date = date;
        if (this.options.view_mode === 'Month') {
          is_month_width +=
            (this.options.column_width * date_length_in_month) / 30;
        }
        return d;
      });
      return dates;
    }

    get_date_info(date, last_date, i, is_month_width, date_length_in_month) {
      if (!last_date) {
        if (this.options.view_mode === 'Week') {
          last_date = date_utils.add(date, -1, 'month');
        } else {
          last_date = date_utils.add(date, -1, 'day');
        }
      }
      const date_text = {
        'Quarter Day_lower': date_utils.format(
          date,
          'HH',
          this.options.language
        ),
        'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
        Day_lower: date_utils.format(date, 'D', this.options.language),
        Week_lower:
          date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'MMMDD', this.options.language)
            : date_utils.format(date, 'D', this.options.language),
        Month_lower: date_utils.format(date, 'MMMM', this.options.language),
        Year_lower: date_utils.format(date, 'YYYY', this.options.language),
        'Quarter Day_upper':
          date.getDate() !== last_date.getDate()
            ? date_utils.format(date, 'MMMDD', this.options.language)
            : '',
        'Half Day_upper':
          date.getDate() !== last_date.getDate()
            ? date.getMonth() !== last_date.getMonth()
              ? date_utils.format(date, 'MMMDD', this.options.language)
              : date_utils.format(date, 'D', this.options.language)
            : '',
        Day_upper:
          date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'MMMM', this.options.language)
            : '',
        Week_upper:
          date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'MMMM', this.options.language)
            : '',
        Month_upper:
          date.getFullYear() !== last_date.getFullYear()
            ? date_utils.format(date, 'YYYY', this.options.language)
            : '',
        Year_upper:
          date.getFullYear() !== last_date.getFullYear()
            ? date_utils.format(date, 'YYYY', this.options.language)
            : '',
      };

      const base_pos = {
        x: i * this.options.column_width,
        lower_y: this.options.header_height,
        upper_y: this.options.header_height - 25,
      };
      const x_pos = {
        'Quarter Day_lower': 0,
        'Quarter Day_upper': (this.options.column_width * 4) / 2,
        'Quarter Day_upper_width': this.options.column_width * 4,
        'Half Day_lower': 0,
        'Half Day_upper': (this.options.column_width * 2) / 2,
        'Half Day_upper_width': this.options.column_width * 2,
        Day_lower: this.options.column_width / 2,
        Day_upper: (this.options.column_width * date_length_in_month) / 2,
        Day_upper_width: this.options.column_width * date_length_in_month,
        Week_lower: 0,
        Week_upper: (this.options.column_width * 4) / 2,
        Week_upper_width: this.options.column_width * 4,
        Month_lower:
          (this.options.column_width * date_length_in_month) / 30 / 2,
        Month_upper: ((this.options.column_width / 30) * 365) / 2,
        Month_upper_width: this.options.column_width * 12,
        Year_lower: this.options.column_width / 2,
        Year_upper: (this.options.column_width * date_length_in_month) / 2,
        Year_upper_width: this.options.column_width * date_length_in_month,
      };
      return {
        upper_width: x_pos[`${this.options.view_mode}_upper_width`],
        lower_width:
          this.options.view_mode === 'Month'
            ? (this.options.column_width * date_length_in_month) / 30
            : this.options.column_width,
        upper_text: date_text[`${this.options.view_mode}_upper`],
        lower_text: date_text[`${this.options.view_mode}_lower`],
        upper_x: base_pos.x + x_pos[`${this.options.view_mode}_upper`],
        upper_y: base_pos.upper_y,
        lower_x:
          this.options.view_mode === 'Month'
            ? is_month_width + this.options.column_width / 2
            : base_pos.x + x_pos[`${this.options.view_mode}_lower`],
        lower_y: base_pos.lower_y,
      };
    }

    make_bars() {
      this.bars = this.tasks.map((task) => {
        const bar = new Bar(this, task);
        this.layers.bar.appendChild(bar.group);
        return bar;
      });
    }

    make_arrows() {
      this.arrows = [];
      for (let task of this.tasks) {
        let arrows = [];
        arrows = task.dependencies
          .map((task_id) => {
            const dependency = this.get_task(task_id);
            if (!dependency) return;
            const arrow = new Arrow(
              this,
              this.bars[dependency._index],
              this.bars[task._index]
            );
            this.layers.arrow.appendChild(arrow.element);
            return arrow;
          })
          .filter(Boolean);
        this.arrows = this.arrows.concat(arrows);
      }
    }

    map_arrows_on_bars() {
      for (let bar of this.bars) {
        bar.arrows = this.arrows.filter((arrow) => {
          return (
            arrow.from_task.task.id === bar.task.id ||
            arrow.to_task.task.id === bar.task.id
          );
        });
      }
    }

    set_width() {
      const cur_width = this.$svg.getBoundingClientRect().width;
      const actual_width = this.$svg
        .querySelector('.grid .grid-row')
        .getAttribute('width');
      if (cur_width < actual_width) {
        this.$svg.setAttribute('width', actual_width);
      }
    }

    set_scroll_position() {
      const parent_element = this.$svg.parentElement;
      if (!parent_element) return;

      const hours_before_first_task = date_utils.diff(
        this.get_oldest_starting_date(),
        this.gantt_start,
        'hour'
      );

      const scroll_pos =
        (hours_before_first_task / this.options.step) *
          this.options.column_width -
        this.options.column_width * 2;

      parent_element.scrollLeft = scroll_pos;
    }

    bind_grid_click() {
      $.on(
        this.$svg,
        this.options.popup_trigger,
        '.grid-row, .grid-header',
        () => {
          this.unselect_all();
          this.hide_popup();
        }
      );
    }

    bind_bar_events() {
      let is_dragging;
      let x_on_start;
      let is_resizing_left;
      let is_resizing_right;
      let parent_bar_id;
      let bars = [];
      this.bar_being_dragged = null;

      function resize() {
        is_dragging = false;
        x_on_start = 0;
        is_resizing_left = false;
        is_resizing_right = false;
        parent_bar_id = null;
        bars = [];
      }
      resize();

      function action_in_progress() {
        return is_dragging || is_resizing_left || is_resizing_right;
      }

      $.on(this.$svg, 'mousedown', '.bar-wrapper, .handle', (e, element) => {
        const bar_wrapper = $.closest('.bar-wrapper', element);
        if (element.classList.contains('left')) {
          is_resizing_left = true;
        } else if (element.classList.contains('right')) {
          is_resizing_right = true;
        } else if (element.classList.contains('bar-wrapper')) {
          is_dragging = true;
        }
        bar_wrapper.classList.add('active');

        x_on_start = e.clientX;
        parent_bar_id = bar_wrapper.getAttribute('data-id');
        const ids = [
          parent_bar_id,
          ...this.get_all_dependent_tasks(parent_bar_id),
        ];
        bars = ids.map((id) => this.get_bar(id));

        this.bar_being_dragged = parent_bar_id;

        bars.forEach((bar) => {
          const $bar = bar.$bar;
          $bar.ox = $bar.getX();
          $bar.oy = $bar.getY();
          $bar.owidth = $bar.getWidth();
          $bar.finaldx = 0;
        });
      });

      $.on(this.$svg, 'mousemove', (e) => {
        if (!action_in_progress()) return;
        const dx = e.clientX - x_on_start;
        bars.forEach((bar) => {
          const $bar = bar.$bar;
          $bar.finaldx = this.get_snap_position(dx);

          if (is_resizing_left) {
            if (parent_bar_id === bar.task.id) {
              bar.update_bar_position({
                x: $bar.ox + $bar.finaldx,
                width: $bar.owidth - $bar.finaldx,
              });
            } else {
              bar.update_bar_position({
                x: $bar.ox + $bar.finaldx,
              });
            }
          } else if (is_resizing_right) {
            if (parent_bar_id === bar.task.id) {
              bar.update_bar_position({
                width: $bar.owidth + $bar.finaldx,
              });
            }
          } else if (is_dragging) {
            bar.update_bar_position({ x: $bar.ox + $bar.finaldx });
          }
        });
      });

      document.addEventListener('mouseup', (e) => {
        if (is_dragging || is_resizing_left || is_resizing_right) {
          bars.forEach((bar) => bar.group.classList.remove('active'));
        }

        is_dragging = false;
        is_resizing_left = false;
        is_resizing_right = false;
      });

      $.on(this.$svg, 'mouseup', (e) => {
        this.bar_being_dragged = null;
        bars.forEach((bar) => {
          const $bar = bar.$bar;
          if (!$bar.finaldx) return;
          bar.date_changed();
          bar.set_action_completed();
          // bar.show_popup();
        });
        resize();
      });

      this.bind_bar_progress();
    }

    bind_bar_progress() {
      let x_on_start;
      let is_resizing;
      let bar;
      let $bar_progress;
      let $bar;

      function resize() {
        x_on_start = 0;
        is_resizing = null;
        bar = null;
        $bar_progress = null;
        $bar = null;
      }
      resize();

      $.on(this.$svg, 'mousedown', '.handle.progress', (e, handle) => {
        is_resizing = true;
        x_on_start = e.clientX;

        const $bar_wrapper = $.closest('.bar-wrapper', handle);
        const id = $bar_wrapper.getAttribute('data-id');
        bar = this.get_bar(id);

        $bar_progress = bar.$bar_progress;
        $bar = bar.$bar;

        $bar_progress.finaldx = 0;
        $bar_progress.owidth = $bar_progress.getWidth();
        $bar_progress.min_dx = -$bar_progress.getWidth();
        $bar_progress.max_dx = $bar.getWidth() - $bar_progress.getWidth();
      });

      $.on(this.$svg, 'mousemove', (e) => {
        if (!is_resizing) return;
        let dx = e.clientX - x_on_start;

        if (dx > $bar_progress.max_dx) {
          dx = $bar_progress.max_dx;
        }
        if (dx < $bar_progress.min_dx) {
          dx = $bar_progress.min_dx;
        }

        const $handle = bar.$handle_progress;
        $.attr($bar_progress, 'width', $bar_progress.owidth + dx);
        $.attr($handle, 'x', bar.get_progress_polygon_points().x);
        $.attr($handle, 'y', bar.get_progress_polygon_points().y);
        $bar_progress.finaldx = dx;
      });

      $.on(this.$svg, 'mouseup', () => {
        is_resizing = false;
        if (!($bar_progress && $bar_progress.finaldx)) return;
        bar.progress_changed();
        bar.set_action_completed();

        resize();
      });
    }

    bind_layout_line_move() {
      let x_on_start;
      let is_resizing;
      let $layout_line;
      let $task_table;
      let dx;
      let layout_position;
      let maxWidth;
      const self = this;
      function resize() {
        x_on_start = 0;
        is_resizing = null;
        $layout_line = null;
        $task_table = null;
        dx = 0;
        layout_position = 'center';
        if (
          self.task_tables.$rows[0].offsetWidth <
          self.$layout.offsetWidth - 50
        ) {
          maxWidth = self.task_tables.$rows[0].offsetWidth;
        } else {
          maxWidth = self.$layout.offsetWidth - 50;
        }
      }
      resize();

      $.on(this.$layout, 'mousedown', '.gantt-layout-line', (e) => {
        is_resizing = true;
        x_on_start = e.clientX;

        $layout_line = this.$layout_line;
        $task_table = this.$task_table;
        $task_table.owidth = $task_table.offsetWidth;
      });

      $.on(this.$layout, 'mousemove', (e) => {
        if (!is_resizing) return;
        dx = $task_table.owidth + e.clientX - x_on_start;
        if (dx < 50) {
          dx = 50;
        } else if (dx > maxWidth) {
          dx = maxWidth;
        }
        $.attr($task_table, 'width', dx);
      });

      $.on(this.$layout, 'mouseup', () => {
        is_resizing = false;
        if (dx !== 0) {
          this.options.layout_left_width = this.$task_table.offsetWidth;
          this.trigger_event('layout_changed', [this.$task_table.offsetWidth]);
          resize();
        }
      });

      $.on(this.$layout, 'click', '.gantt-layout-line-left', (e) => {
        if (layout_position === 'right') {
          layout_position = 'center';
          $.attr(this.$task_table, 'width', this.options.layout_left_width);
          document
            .querySelector('.gantt-layout-line-right')
            .classList.remove('hide');
          document
            .querySelector('.gantt-layout-line-left')
            .classList.remove('hide');
        } else {
          layout_position = 'left';
          $.attr(this.$task_table, 'width', 0);
          document
            .querySelector('.gantt-layout-line-right')
            .classList.remove('hide');
          document
            .querySelector('.gantt-layout-line-left')
            .classList.add('hide');
        }
      });

      $.on(this.$layout, 'click', '.gantt-layout-line-right', (e) => {
        if (layout_position === 'left') {
          layout_position = 'center';
          $.attr(this.$task_table, 'width', this.options.layout_left_width);
          document
            .querySelector('.gantt-layout-line-right')
            .classList.remove('hide');
          document
            .querySelector('.gantt-layout-line-left')
            .classList.remove('hide');
        } else {
          layout_position = 'right';
          $.attr(this.$task_table, 'width', maxWidth);
          document
            .querySelector('.gantt-layout-line-left')
            .classList.remove('hide');
          document
            .querySelector('.gantt-layout-line-right')
            .classList.add('hide');
        }
      });
    }

    get_all_dependent_tasks(task_id) {
      let out = [];
      let to_process = [task_id];
      while (to_process.length) {
        const deps = to_process.reduce((acc, curr) => {
          acc = acc.concat(this.dependency_map[curr]);
          return acc;
        }, []);

        out = out.concat(deps);
        to_process = deps.filter((d) => !to_process.includes(d));
      }

      return out.filter(Boolean);
    }

    get_snap_position(dx) {
      let odx = dx,
        rem,
        position;

      if (this.view_is('Week')) {
        rem = dx % (this.options.column_width / 7);
        position =
          odx -
          rem +
          (rem < this.options.column_width / 14
            ? 0
            : this.options.column_width / 7);
      } else if (this.view_is('Month')) {
        rem = dx % (this.options.column_width / 30);
        position =
          odx -
          rem +
          (rem < this.options.column_width / 60
            ? 0
            : this.options.column_width / 30);
      } else {
        rem = dx % this.options.column_width;
        position =
          odx -
          rem +
          (rem < this.options.column_width / 2 ? 0 : this.options.column_width);
      }
      return position;
    }

    unselect_all() {
      [...this.$svg.querySelectorAll('.bar-wrapper')].forEach((el) => {
        el.classList.remove('active');
      });
    }

    view_is(modes) {
      if (typeof modes === 'string') {
        return this.options.view_mode === modes;
      }

      if (Array.isArray(modes)) {
        return modes.some((mode) => this.options.view_mode === mode);
      }

      return false;
    }

    get_task(id) {
      return this.tasks.find((task) => {
        return task.id === id;
      });
    }

    get_bar(id) {
      return this.bars.find((bar) => {
        return bar.task.id === id;
      });
    }

    show_popup(options) {
      if (!this.popup) {
        this.popup = new Popup(
          this.$popup_wrapper,
          this.options.custom_popup_html
        );
      }
      this.popup.show(options);
    }

    hide_popup() {
      this.popup && this.popup.hide();
    }

    trigger_event(event, args) {
      if (this.options['on_' + event]) {
        this.options['on_' + event].apply(null, args);
      }
    }

    get_oldest_starting_date() {
      return this.tasks
        .map((task) => task._start)
        .reduce((prev_date, cur_date) =>
          cur_date <= prev_date ? cur_date : prev_date
        );
    }

    clear() {
      this.$svg.innerHTML = '';
    }
  }

  function generate_id(task) {
    return task.name + '_' + Math.random().toString(36).slice(2, 12);
  }

  return Gantt;
})();

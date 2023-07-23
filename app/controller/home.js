'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async echo() {
    const { ctx } = this;
    const body = ctx.request.body;
    ctx.body = {
      type: ctx.get('content-type'),
      body,
    };
  }
}

module.exports = HomeController;

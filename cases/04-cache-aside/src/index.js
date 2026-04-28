'use strict';

const { FakeRedis } = require('./fake-redis');
const { ProductRepository } = require('./product-repository');
const { ProductCache } = require('./product-cache');

module.exports = { FakeRedis, ProductRepository, ProductCache };

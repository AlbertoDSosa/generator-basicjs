const assert = require('yeoman-assert')

describe('basicjs generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../generators/app')
    assert(app !== undefined)
  })
})

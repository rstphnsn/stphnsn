describe('app.js', function () {
    'use strict';

    it('defines the window.akqa namespace', function() {
        expect(window.akqa).toBeDefined();
    });

    it('defines the window.akqa.base namespace', function() {
        expect(window.akqa.base).toBeDefined();
    });

});
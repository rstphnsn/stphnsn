describe('app.js', function () {
    'use strict';

    it('defines the window.rps namespace', function() {
        expect(window.rps).toBeDefined();
    });

    it('defines the window.rps.mfc namespace', function() {
        expect(window.rps.mfc).toBeDefined();
    });

});
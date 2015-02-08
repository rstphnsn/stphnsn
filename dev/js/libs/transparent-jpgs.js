/*

The MIT License (MIT)

Copyright (c) 2014 Richard Stephenson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function (window, document) {

    var TransparentJPGs = function () {

        var transparentJPGs,
            i,

        init = function () {
            transparentJPGs = document.getElementsByClassName('transparent-jpg');
            for (i = 0; i < transparentJPGs.length; i++) {
                var canvasElement = transparentJPGs[i];
                loadImages({
                    rgb: canvasElement.getAttribute('data-rgb'),
                    mask: canvasElement.getAttribute('data-mask')
                }, render, i);
            }
        },

        loadImages = function (files, callback, count) {
            var toLoad = 0,
                images = {},
                id,
                image,
                loaded;
            loaded = function () {
                --toLoad;
                if (!toLoad) {
                    callback(images, count);
                }
            };
            for (id in files) {
                if (files.hasOwnProperty(id)) {
                    image = new Image();
                    ++toLoad;
                    image.onload = loaded;
                    image.src = files[id];
                    images[id] = image;
                }
            }
        },

        render = function (images, i) {
            var canvasContext = transparentJPGs[i].getContext('2d'),
                x = 0,
                y = 0;
            canvasContext.drawImage(images.rgb, x, y);
            canvasContext.globalCompositeOperation = 'xor';
            canvasContext.drawImage(images.mask, x, y);
        };

        init();

        return {
            init: init
        };
    };

    window.TransparentJPGs = new TransparentJPGs();

})(window, document);
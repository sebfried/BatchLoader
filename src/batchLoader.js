class BatchLoader {
    constructor(options = {}) {
        this.options = {
            observer: {
                root: options.observer?.root || null,
                rootMargin: options.observer?.rootMargin || '50px 0px',
                threshold: options.observer?.threshold || 0.01
            },
            log: options.log || false
        };
        this.init();
    }

    init() {
        const baseImages = this.getBaseImages();
        this.setupImages(baseImages);
    }

    setupImages(images) {
        images.forEach(img => {
            this.setupImg(img);
        });
    }

    setupImg(img) {
        this.setupIntersectionObserver(img);
    }

    getBaseImages() {
        try {
            const allImages = document.querySelectorAll('img[data-from][data-to][data-step]');
            this.log("allImages: " + allImages.length);
            this.logGroup("allImages: ", allImages);
            return allImages;
        } catch (error) {
            console.error("Error in getImages:", error.message);
            return null;
        }
    }

    getTargetWidthLow(img) {
        try {
            const rect = img.getBoundingClientRect();
            const targetWidthLow = rect.width;
            this.log("targetWidthLow: " + targetWidthLow);
            return targetWidthLow;
        } catch (error) {
            console.error("Error in getTargetWidthLow:", error.message);
            return 0;
        }
    }

    getTargetWidthHigh(img) {
        try {
            const rect = img.getBoundingClientRect();
            const targetWidthHigh = rect.width * window.devicePixelRatio;
            this.log("targetWidthHigh: " + targetWidthHigh);
            return targetWidthHigh;
        } catch (error) {
            console.error("Error in getTargetWidthHigh:", error.message);
            return 0;
        }
    }

    getBaseImgData(img) {

        const sortImgDataSizes = (from, to, step, specialSizes) => {
            try {
                const allSizes = new Set();
                allSizes.add(from);
                allSizes.add(to);
                for (let size = from + step; size < to; size += step) {
                    allSizes.add(size);
                }
                specialSizes.forEach(size => allSizes.add(size));
                return Array.from(allSizes).sort((a, b) => a - b);
            } catch (error) {
                console.error("Error in sortImgDataSizes:", error.message);
                return [];
            }
        };

        try {
            const imgData = {};
            imgData.from = parseInt(img.getAttribute('data-from'), 10);
            imgData.to = parseInt(img.getAttribute('data-to'), 10);
            imgData.step = parseInt(img.getAttribute('data-step'), 10);
            imgData.specialSizes = img.getAttribute('data-special') ? img.getAttribute('data-special').split(',').map(size => parseInt(size, 10)) : [];
            imgData.allSizes = sortImgDataSizes(imgData.from, imgData.to, imgData.step, imgData.specialSizes);
            this.log("imgData.allSizes: " + imgData.allSizes);
            return imgData;
        } catch (error) {
            console.error("Error in getBaseImgData:", error.message);
            return {};
        }
    }

    setupIntersectionObserver(img) {
        try {
            if ('IntersectionObserver' in window) {
                const imgObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.imgIsIntersecting(entry.target);
                            imgObserver.unobserve(entry.target);
                        }
                    });
                }, this.options.observer);

                imgObserver.observe(img);
            } else {
                this.intersectionObserverFallback();
            }
        } catch (error) {
            console.error("Error in setupIntersectionObserver:", error.message);
            return null;
        }
    }

    imgIsIntersecting(img) {
        this.loadOptimalImage(img);
    }

    loadOptimalImage(img) {
        try {
            const optimalSize = this.selectOptimalImgSize(img);
            const optimalImgUrl = this.createOptimalImgPath(img, optimalSize);
            const optimalImg = this.createOptimalImgElement(img, optimalImgUrl);
            this.insertOptimalImgElement(img, optimalImg);
            optimalImg.onload = () => {
                this.log(`Optimal image loaded for ${optimalSize}px width.`);
            };
        } catch (error) {
            console.error("Error in loadOptimalImage:", error.message);
            return null;
        }
    }

    selectOptimalImgSize(img) {
        const imgData = this.getBaseImgData(img);
        const targetWidth = this.getTargetWidthLow(img);
        const optimalSize = imgData.allSizes.find(size => size >= targetWidth) || imgData.allSizes[imgData.allSizes.length - 1];
        this.log("optimalSize: " + optimalSize);
        return optimalSize;
    }

    createOptimalImgPath(baseImg, size) {
        const parts = baseImg.src.split('/');
        const filenameParts = parts.pop().split('.');
        const format = baseImg.getAttribute('data-format') || this.options.defaultFormat || filenameParts.pop();
        const baseFilenameWithoutSize = filenameParts[0].replace(/-\d+$/, '');
        const newPath = `${parts.join('/')}/${baseFilenameWithoutSize}-${size}.${format}`;
        this.log("newPath: " + newPath);
        return newPath;
    }

    createOptimalImgElement(baseImg, newPath) {
        const newImg = document.createElement('img');
        newImg.src = newPath;
        newImg.alt = baseImg.alt;
        newImg.width = baseImg.width;
        newImg.height = baseImg.height;
        return newImg;
    }

    insertOptimalImgElement(baseImg, newImg) {
        const parentDiv = baseImg.parentNode;
        parentDiv.appendChild(newImg);
    }

    intersectionObserverFallback() {
        // TODO: Fallback for browsers without IntersectionObserver support
        console.log("intersectionObserverFallback()");
    }

    log(message) {
        if (this.options.log) {
            console.log(message);
        }
    }

    logGroup(label, iterable) {
        if (this.options.log) {
            console.groupCollapsed(label);
            let index = 1;
            for (const item of iterable) {
                console.log(`${index}: `, item);
                index++;
            }
            console.groupEnd();
        }
    }
}
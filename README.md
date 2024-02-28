# Pixel Loader: Responsive Image Loader Documentation

The `PixelLoader` class for websites is designed to enhance performance through responsive and network-aware image loading. It leverages modern web technologies to load images efficiently, adapting to both the viewport and network conditions. This documentation covers its configuration, usage, and integration into web projects.

## Usage

1. **Include the Script**: Ensure the `PixelLoader` class script is included in your page.

2. **Initialization**: Instantiate the loader with your desired options when the DOM is fully loaded:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const imageLoader = new PixelLoader({
    rootMargin: '50px',
    transitionDuration: '0.8s',
    defaultFormat: 'jpeg',
    lazyLoad: true,
    lowQualityOnSlowNetwork: true,
    fallbackImage: 'path/to/fallback-image.jpg',
    observeNetworkChanges: true,
  });
});
```

3. **Dynamic Content**: For content added dynamically to the page after initial load, invoke `refreshImages()` to apply the image loading logic to new images:

```javascript
// After dynamically adding images to the DOM
imageLoader.refreshImages();
```

4. **Image Markup**: Mark up your images with the necessary `data-*` attributes for the loader to process them:

```html
<img src="/path/to/placeholder.jpg"
     data-from="100"
     data-to="1000"
     data-steps="100"
     data-format="webp"
     data-special="300,600"
     alt="Descriptive text">
```

## Options

When initializing `PixelLoader`, you can configure its behavior through the following options:

- `rootMargin`: A string defining the margin around the viewport used by the Intersection Observer to preload images. Default is `'100px'`.
- `transitionDuration`: The duration of the opacity transition effect applied when an image is loaded. Default is `'0.5s'`.
- `transitionEffect`: The CSS property to transition. Default is `'opacity'`.
- `defaultFormat`: The default image format to use if not specified in the image element's `data-format` attribute. Default is `'webp'`.
- `lazyLoad`: A boolean indicating whether to apply native lazy loading (`loading="lazy"`) to images. Default is `true`.
- `lowQualityOnSlowNetwork`: When `true`, the loader will select smaller image sizes on slower network connections to improve loading times. Default is `true`.
- `fallbackImage`: The path to a fallback image to use if loading the desired image fails. No default value; if not provided, the original `src` will remain unchanged on error.
- `observeNetworkChanges`: A boolean indicating whether the loader should adjust image sizes in response to network condition changes. Default is `true`.
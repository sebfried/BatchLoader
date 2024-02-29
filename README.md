# Batch Loader: Responsive Image Batch Loader 
## Work in Progress

The `BatchLoader` for websites is designed to deliver the optimal image sizes from directories containing batch-resized images.

## Usage

Check the demo directory...

```html
<img src="img/name/name-1.webp"
data-from="600"
data-to="1200"
data-step="100"
data-format="webp"
data-special="50,2000"
loading="lazy"
alt="Descriptive text">
```

## Limits of a JavaScript Loader
* There is no reliabe solution to get the native screen size of the user.
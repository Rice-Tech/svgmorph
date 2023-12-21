# SVG Resample and Animator

This project aims to make a convenient way to make morph animations between different SVGs.

I used the following projects along the way:

- [@figmania/svg-toolkit](https://github.com/figmania/svg-toolkit) Handy Figma Plugin to get SVGs
- [@danmarshall/google-font-to-svg-path](https://github.com/danmarshall/google-font-to-svg-path) Useful for getting Google Fonts as SVG
- [@luncheon/simplify-svg-path](https://github.com/luncheon/simplify-svg-path) Used this to simplify paths and make them all curves
- [@cure53/DOMPurify](https://github.com/cure53/DOMPurify) For sanitizing pasted SVG code.

## To do

I would like to implement:
-Saving SVGs after importing
-Renaming paths
-Adding or resampling to normalize the number of points between two paths
-Timeline for animating between different paths

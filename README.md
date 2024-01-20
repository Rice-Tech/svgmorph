# SVG Resample and Animator

SVG Morph makes complex morph animations between any two SVG images possible using vanilla CSS. To use CSS animations, paths must have identical transformations. This utility resamples SVGs to a standard format and creates the necessary CSS for up to hundreds of shapes.

## Quick Start
Check out the demo at ([svgmorph.ricecodes.com](https://svgmorph.ricecodes.com/))

TODO: Currently the selects are the only way to select the two SVGs to animate. I plan to use then nicer table in the future but haven't implemented that yet.


##Aknowledgements
I used the following projects along the way:
- [@figmania/svg-toolkit](https://github.com/figmania/svg-toolkit) Handy Figma Plugin to get SVGs
- [@danmarshall/google-font-to-svg-path](https://github.com/danmarshall/google-font-to-svg-path) Useful for getting Google Fonts as SVG
- [@luncheon/simplify-svg-path](https://github.com/luncheon/simplify-svg-path) Used this to simplify paths and make them all curves
- [@cure53/DOMPurify](https://github.com/cure53/DOMPurify) For sanitizing pasted SVG code.

# SVG Morph

SVG Morph makes complex morph animations between any two SVG images possible using SVG SMIL animations. Morph animations, require matching paths with identical number and type of transformations. This utility resamples SVGs to a standard format and creates the SVG SMIL animations. The repo includes legacy code that utilitzed CSS animations, but animating the d element of an SVG is not supported by WebKit. I plan to offer that as an option as well as provide a GUI interface to many of the other animation options which are currently hardcoded as an options constant.

![The Mona Lisa painting morphs into Fra Angelico's Annunciation](/public/DemoMonaLisaAnnunciation.svg)

## Quick Start
Check out the demo at [svgmorph.ricecodes.com](https://svgmorph.ricecodes.com/)

- Upload SVGs (use low res inputs to [Adobe's image to SVG converter](https://www.adobe.com/express/feature/image/convert/svg) for great results)
- Choose timing options
- Animate
- Download!

## Stack
- Everything is on the front-end
- React
- Typescript
- shadcn and Tailwind CSS
- I spun up this project using Vite

## Aknowledgements
I used the following projects along the way:
- [@figmania/svg-toolkit](https://github.com/figmania/svg-toolkit) Handy Figma Plugin to get SVGs
- [@danmarshall/google-font-to-svg-path](https://github.com/danmarshall/google-font-to-svg-path) Useful for getting Google Fonts as SVG
- [@luncheon/simplify-svg-path](https://github.com/luncheon/simplify-svg-path) Used this to simplify paths and make them all curves
- [@cure53/DOMPurify](https://github.com/cure53/DOMPurify) For sanitizing pasted SVG code.

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";
import { ProjectContext, SavedPath, SavedSVG } from "./ProjectProvider";
import AnimationTiming from "./AnimationTiming";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SVGPlayground from "./SVGPlayground";
import { processDropFile, processFileInput } from "@/lib/manageFiles";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [svgPathCSSVarsString, setSVGPathCSSVarsString] = useState("");
  const { settings, updateSettings } = useContext(SettingsContext)!;
  const { savedSVGs, animation, project } = useContext(ProjectContext)!;

  const svgTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const pathVarsStyleElement = document.getElementById("svgPathCSSVariables");
    if (!pathVarsStyleElement) {
      return;
    }
    pathVarsStyleElement.innerHTML = `
    :root{
      ${svgPathCSSVarsString}
    }`;
  }, [svgPathCSSVarsString]);

  const getVertexCount = (path: string) => {
    const curveOperations = path.split("c");
    return curveOperations.length - 1;
  };
  const createStandardPath = (path: string, targetCount: number) => {
    const vertexCount = getVertexCount(path);
    console.log(vertexCount);
    const numberedVertexPath =
      path + "c0,0 0,0 0,0".repeat(targetCount - vertexCount);
    console.log(numberedVertexPath.split("c").length - 1);

    return numberedVertexPath;
  };

  const getMaxVertexCount = (
    paths: { path: SavedPath; animationPoints: number[] }[]
  ) => {
    const vertexCounts = paths.map((item) => getVertexCount(item.path.path));
    return Math.max(...vertexCounts);
  };

  const createAnimationSVG = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      /* if (project.animation.length < 2) {
        return;
      } */
      const activeSVGs = animation.filter(
        (item) => item.animationPoints.length
      );
      if (activeSVGs.length < 2) {
        return;
      }

      const clearPreviousAnimations = () => {
        const animationSVG = document.getElementById(
          "morph"
        ) as SVGSVGElement | null;
        if (animationSVG) {
          animationSVG.innerHTML = "";
        }

        const morphStyleSheet = document.getElementById("morphAnimationStyle");
        if (morphStyleSheet) {
          morphStyleSheet.innerHTML = "";
        }
      };

      clearPreviousAnimations();
      setSVGPathCSSVarsString("");
      activeSVGs;
      const generateSVGAnimations = async (
        activeSVGs: {
          svg: SavedSVG;
          animationPoints: number[];
        }[]
      ) => {
        let index = 0;
        let maxSVG = activeSVGs[0].svg;
        let firstSVG = 0;
        let lastSVG = 0;
        let firstTime = activeSVGs[0].animationPoints[0];
        project.updateAnimation
        let lastTime = activeSVGs[0].animationPoints[0];
        activeSVGs.forEach((item, index) => {
          if (item.svg.paths.length > maxSVG.paths.length) {
            maxSVG = item.svg;
          }
          item.animationPoints.forEach((point) => {
            if (point < firstTime) {
              console.log("First: ",point)
              firstTime = point;
              firstSVG = index;
            }
            if (point > lastTime) {
              console.log("Last: ",point)
              lastTime = point;
              lastSVG = index;
            }
          });
        });
        if (lastTime < 100) {
          activeSVGs[lastSVG].animationPoints.push(100);
        }
        if (firstTime > 0) {
          activeSVGs[firstSVG].animationPoints.unshift(0);
        }

        const baseSVG = maxSVG;
        const max = baseSVG.paths.length;
        for await (const basePath of baseSVG.paths) {
          //svg1.paths.forEach((path, index) => {
          console.log("Progress:", index / max);
          setProgress(index / max);
          const animationPaths = activeSVGs.map((item) => {
            if (item.svg.paths[index]) {
              console.log(item.svg.paths[index]);
              return {
                path: item.svg.paths[index],
                animationPoints: item.animationPoints,
              };
            } else {
              const tempPath = {
                ...item.svg.paths[
                  Math.floor(item.svg.paths.length * Math.random())
                ],
              };
              tempPath.fill = "rgba(255,255,255,0)";
              tempPath.id += "placeholder";
              return {
                path: tempPath,
                animationPoints: item.animationPoints,
              };
            }
          });
          const option: string = "svg";
          if (option == "css") {
            animatePathsCSS(basePath, animationPaths, index);
          } else {
            animatePathsSVG(basePath, animationPaths, index);
          }

          index += 1;
        }
      };

      generateSVGAnimations(activeSVGs);
    } catch {
      console.error("could not create animations");
    } finally {
      setLoading(false);
    }
  };

  const animatePathsSVG = (
    path1: SavedPath,
    otherPaths: { path: SavedPath; animationPoints: number[] }[],
    id: number
  ) => {
    const vertexCount = getMaxVertexCount(otherPaths);

    const numberedpath1 = createStandardPath(path1.path, vertexCount);

    const numberedpaths = otherPaths.map((item) => {
      const standardPath = createStandardPath(item.path.path, vertexCount);
      return {
        standardPath: standardPath,
        animationPoints: item.animationPoints,
        fill: item.path.fill,
        id: item.path.id,
      };
    });
    const generateAnimateElement = (
      name: string,
      keyframePoints: { value: string; time: number }[]
    ) => {
      const options = {
        dur: "10s",
        repeatCount: "indefinite",
        begin: "0s", //morph.mouseenter
        fill: "freeze",
        calcMode: "spline",
        spline: ".50 0 .50  1",
      };
      let values = "";
      let keyTimes = "";
      let keySplines = "";
      keyframePoints
        .sort((a, b) => a.time - b.time)
        .forEach((point, index) => {
          if (index) {
            values += "; ";
            keyTimes += "; ";
            keySplines += options.spline + ";";
          }
          values += point.value;
          keyTimes += point.time;
        });
      const animateElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );

      animateElement.setAttribute("attributeName", name);
      animateElement.setAttribute("dur", options.dur);
      animateElement.setAttribute("repeatCount", options.repeatCount);
      animateElement.setAttribute("begin", options.begin);
      animateElement.setAttribute("values", values);
      animateElement.setAttribute("keyTimes", keyTimes);
      animateElement.setAttribute("fill", options.fill);
      animateElement.setAttribute("calcMode", options.calcMode);
      animateElement.setAttribute("keySplines", keySplines);
      return animateElement;
    };

    const keyframePointsPaths: { value: string; time: number }[] = [];
    numberedpaths.forEach((numPath) => {
      numPath.animationPoints.forEach((animPoint) => {
        keyframePointsPaths.push({
          value: numPath.standardPath,
          time: animPoint / 100,
        });
      });
    });
    const animateElementPaths = generateAnimateElement(
      "d",
      keyframePointsPaths
    );

    const keyframePointsFill: { value: string; time: number }[] = [];
    numberedpaths.forEach((numPath) => {
      numPath.animationPoints.forEach((animPoint) => {
        console.log(numPath.fill);
        let fill = numPath.fill;
        if (fill == "var(--path-fill)") {
          fill = "rgba(255,255,255,0)";
        }
        keyframePointsFill.push({
          value: fill,
          time: animPoint / 100,
        });
      });
    });

    const animateElementFill = generateAnimateElement(
      "fill",
      keyframePointsFill
    );
    // add first svg as svg on page
    const animationGroupElement = document.getElementById(
      "morph"
    ) as SVGElement | null;
    if (!animationGroupElement) {
      console.log("Not found");
      return;
    }
    animationGroupElement.setAttribute("viewBox", path1.viewBox);
    const addPathToSVG = (
      pathString: string,
      pathFill: string,
      parentElement: Element,
      id: string
    ) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute("d", pathString);
      pathElement.setAttribute("fill", pathFill);
      pathElement.setAttribute("id", id);
      pathElement.appendChild(animateElementPaths);
      pathElement.appendChild(animateElementFill);
      parentElement.appendChild(pathElement);
    };

    addPathToSVG(
      numberedpath1,
      path1.fill,
      animationGroupElement,
      `morph${id}`
    );
  };

  // ANimate Paths SVG

  const animatePathsCSS = (
    path1: SavedPath,
    otherPaths: { path: SavedPath; animationPoints: number[] }[],
    id: number
  ) => {
    console.log(path1.fill);

    const vertexCount = getMaxVertexCount(otherPaths);

    const numberedpath1 = createStandardPath(path1.path, vertexCount);

    const numberedpaths = otherPaths.map((item) => {
      const standardPath = createStandardPath(item.path.path, vertexCount);
      return {
        standardPath: standardPath,
        animationPoints: item.animationPoints,
        fill: item.path.fill,
        id: item.path.id,
      };
    });
    const morphStyleSheet = document.getElementById("morphAnimationStyle");
    if (!morphStyleSheet) {
      return;
    }
    numberedpaths.forEach((item) => {
      setSVGPathCSSVarsString(
        (prev) =>
          prev +
          " " +
          `--path${item.id + vertexCount}: path("${item.standardPath}");`
      );
    });
    const keyframes = numberedpaths
      .map(
        (item) => `
      ${item.animationPoints
        .map((keyframe) => String(keyframe) + "%")
        .join(", ")}{
        d: var(--path${item.id + vertexCount});
        fill:${item.fill};
      }
    `
      )
      .join("");
    morphStyleSheet.innerHTML += `@keyframes morphAnim${id} {
      ${keyframes}
    }`;

    morphStyleSheet.innerHTML += `#morph${id}{
      animation: morphAnim${id} var(--animation-duration) var(--animation-timing-function) var(--animation-delay) var(--animation-iteration-count) var(--animation-direction);
      animation-timeline: var(--animation-timeline);
    }`;
    // Add 2nd SVG as style animation
    document.head.appendChild(morphStyleSheet);

    // add first svg as svg on page
    const animationSVG = document.getElementById(
      "morph"
    ) as SVGSVGElement | null;
    if (!animationSVG) {
      return;
    }
    animationSVG.setAttribute("viewBox", path1.viewBox);
    const addPathToSVG = (
      pathString: string,
      pathFill: string,
      svgElement: SVGElement,
      id: string
    ) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute("d", pathString);
      pathElement.setAttribute("fill", pathFill);
      pathElement.setAttribute("id", id);
      svgElement.appendChild(pathElement);
    };

    const newSVG = animationSVG.cloneNode(true) as SVGSVGElement;
    newSVG.setAttribute("id", `morph${id}`);

    addPathToSVG(numberedpath1, path1.fill, animationSVG, `morph${id}`);
  };

  const handleAddSVG = async () => {
    console.log("Running input change");

    if (!svgTextRef.current) {
      setLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 10));
      const value = svgTextRef.current.value;
      const newValue = DOMPurify.sanitize(value);
      updateSettings({ svgInput: newValue });
    } catch {
      console.error("Not able to process svg");
    } finally {
      console.log("Hello!");
      setLoading(false);
    }
  };
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    const fileContent = await processDropFile(event);
    if (svgTextRef.current && fileContent) {
      svgTextRef.current.value = fileContent;
    }
  };
  const handleFileInput = async (event: ChangeEvent) => {
    const fileContent = await processFileInput(event);
    if (svgTextRef.current && fileContent) {
      svgTextRef.current.value = fileContent;
    }
  };

  return (
    <div className="flex flex-col bg-primary m-4 rounded-xl px-5 py-2">
      <h2 className="text-2xl text-center text-secondary">Options</h2>

      <Tabs defaultValue="import" className="w-full">
        <TabsList>
          <TabsTrigger value="import">Import SVGs</TabsTrigger>
          <TabsTrigger value="svgomg">SVG Optimizer</TabsTrigger>
          {/* <TabsTrigger value="spline">Lea Verou Spline Tool</TabsTrigger> */}
          <TabsTrigger value="drag">Draggable Area</TabsTrigger>
        </TabsList>
        <TabsContent value="import">
          <div className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4">
            <div className="w-full md:w-2/3 border-solid border-2 rounded-md p-2">
              {/* Content */}
              <label htmlFor="formFile" className="form-label">
                Import an SVG file
              </label>
              <Input
                className=" max-w-sm"
                type="file"
                id="formFile"
                onChange={handleFileInput}
              />

              <div className="form-floating">
                <div
                  id="drop_zone"
                  onDrop={(event) => handleDrop(event as unknown as DragEvent)}
                >
                  <p>
                    Drag one or more files to this <i>drop zone</i>.
                  </p>
                  <label htmlFor="svgInput" hidden>
                    SVG Code
                  </label>
                  <Textarea
                    placeholder="Import an SVG by selecting it above, writing or pasting the code here, or dropping it in the textbox. When you see the code, press Import SVG."
                    id="svgInput"
                    name="svgInput"
                    onChange={() => console.log("I changed!")}
                    ref={svgTextRef}
                  ></Textarea>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start space-y-10 align-top border-solid border-2 rounded-md p-2">
              <label htmlFor="pathStepsInput" className="form-label">
                Path Steps for initial processing
              </label>
              <Slider
                min={2}
                max={1000}
                step={1}
                id="pathStepsInput"
                name="pathSteps"
                defaultValue={[settings.pathSteps]}
              ></Slider>

              <label htmlFor="toleranceInput" className="form-label">
                Resampling Tolerance
              </label>
              <Slider
                min={0.5}
                max={10}
                step={0.5}
                id="toleranceInput"
                name="tolerance"
                defaultValue={[settings.tolerance]}
              ></Slider>
              <Button
                className=" max-w-40"
                onClick={() => {
                  setLoading(true);
                  handleAddSVG();
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </>
                ) : (
                  "Process SVG"
                )}
              </Button>
              <div
                className="progress"
                role="progressbar"
                aria-label="Basic example"
              >
                <div
                  className="progress-bar"
                  style={{ width: 100 * progress + "%" }}
                ></div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="font">
          <div className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4">
            <iframe
              className="w-full aspect-video"
              src="https://danmarshall.github.io/google-font-to-svg-path/"
            ></iframe>
          </div>
        </TabsContent>
        <TabsContent value="svgomg">
          <div className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4">
            <iframe
              className="w-full aspect-video"
              src="https://svgomg.net/"
            ></iframe>
          </div>
        </TabsContent>
        {/* <TabsContent value="spline">
          <div className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4">
            <iframe
              className="w-3/4 aspect-video"
              src="https://cubic-bezier.com/"
            ></iframe>
          </div>
        </TabsContent> */}
        <TabsContent value="drag">
          <div
            className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4 w-full relative"
            style={{ height: "500px" }}
          >
            <SVGPlayground />
          </div>
        </TabsContent>
        <TabsContent value="empty">
          <div className="flex flex-wrap justify-evenly bg-secondary rounded-xl p-4"></div>
        </TabsContent>
      </Tabs>

      <div className="bg-secondary my-5 rounded-lg p-5">
        <div className="">
          <AnimationTiming svgs={savedSVGs} />
          <Button type="button" onClick={createAnimationSVG} disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>
                <span role="status">Loading...</span>
              </>
            ) : (
              "Create Animation"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;

import { useState, useContext, Fragment } from "react";
import { ProjectContext, SavedSVG } from "./ProjectProvider";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { TableCell, TableRow } from "./ui/table";

interface Props {
  svg: SavedSVG;
}

const SVGOptionsRow = ({ svg }: Props) => {
  const { project } = useContext(ProjectContext)!;
  const [active, setActive] = useState(false);
  const [percents, setPercents] = useState([0]);
  const [numberOfKeyframes, setNumberOfKeyframes] = useState(1);

  const handleSliderChange = (name: string, values: number[]) => {
    const value = values[0];
    const newPercents = percents;
    console.log(newPercents);
    newPercents[Number(name)] = value;
    setPercents(newPercents);
    project.updateAnimation(svg, newPercents);
  };

  const handleSetActive = (newActive: boolean) => {
    setActive(newActive);
    if (newActive) {
      project.updateAnimation(svg, percents);
    } else {
      project.updateAnimation(svg, []);
    }
  };
  return (
    <TableRow
      onClick={() => !active && handleSetActive(true)}
      className={active ? "activeRow" : "inactiveRow"}
    >
      <TableCell>
        <svg
          className="svgTablePreview w-2/3"
          fill="none"
          stroke="black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={svg.paths[0].viewBox}
        >
          <>
            {svg.paths.map((path) => {
              return <path key={path.id} d={path.path} fill={path.fill}></path>;
            })}
          </>
        </svg>
      </TableCell>
      <TableCell>{svg.paths.length}</TableCell>
      <TableCell>
        {active ? (
          <>
            <div
              className="flex justify-between w-full"
            >
              <span>
              <Button
                className=" bg-green-500 hover:bg-green-800"
                onClick={() => {
                  setNumberOfKeyframes(numberOfKeyframes + 1);
                  setPercents([...percents, 100]);
                  project.updateAnimation(svg, [...percents, 100]);
                }}
              >
                +
              </Button>
              <Button
                className="bg-red-500  hover:bg-red-900"
                onClick={() => {
                  setNumberOfKeyframes(numberOfKeyframes - 1);
                  setPercents(percents.slice(0, -1));
                  project.updateAnimation(svg, percents.slice(0, -1));
                }}
              >
                -
              </Button>
              </span>
              <Button
                className=" bg-red-500 p-2  w-fit h-fit aspect-square hover:bg-red-900"
                aria-label="Remove from animation"
                onClick={() => {
                  console.log("hello");
                  handleSetActive(false);
                }}
              >
                X
              </Button>
            </div>
            {Array.from({ length: numberOfKeyframes }, (value, index) => (
              <Fragment key={"sliders" + svg.id + index + value}>
                <div>{percents[index]}%</div>
                <label
                  htmlFor={"percentSlider" + svg.id + index}
                  className="form-label"
                >
                  Animation Timeline %
                </label>

                <Slider
                  id={"percentSlider" + svg.id + index}
                  name={String(index)}
                  onValueChange={(values) =>
                    handleSliderChange(String(index), values)
                  }
                  value={[percents[index]]}
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[percents[index]]}
                ></Slider>
              </Fragment>
            ))}
          </>
        ) : (
          "Click to Use"
        )}
      </TableCell>
    </TableRow>
  );
};

export default SVGOptionsRow;

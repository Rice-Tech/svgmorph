import { ChangeEvent, useState, useContext, Fragment } from "react";
import { ProjectContext, SavedSVG } from "./ProjectProvider";

interface Props {
  svg: SavedSVG;
}

const SVGOptionsRow = ({ svg }: Props) => {
  const { project } = useContext(ProjectContext)!;
  const [active, setActive] = useState(false);
  const [percents, setPercents] = useState([0]);
  const [numberOfKeyframes, setNumberOfKeyframes] = useState(1);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const name = event.target.name;
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
    <tr
      onClick={() => !active && handleSetActive(true)}
      className={active ? "activeRow" : "inactiveRow"}
    >
      <td>
        <svg
          className="svgTablePreview"
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
      </td>
      <td>{svg.paths.length}</td>
      <td>
        {active ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  setNumberOfKeyframes(numberOfKeyframes + 1);
                  setPercents([...percents, 100]);
                  project.updateAnimation(svg, [...percents, 100]);
                }}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setNumberOfKeyframes(numberOfKeyframes - 1);
                  setPercents(percents.slice(0, -1));
                  project.updateAnimation(svg, percents.slice(0, -1));
                }}
              >
                -
              </button>
              <button
                type="button"
                className="btn-close"
                aria-label="Remove from animation"
                onClick={() => {
                  console.log("hello");
                  handleSetActive(false);
                }}
              ></button>
            </div>
            {Array.from({ length: numberOfKeyframes }, (value, index) => (
              <Fragment key={"sliders" + svg.id + index +value}>
                <div>{percents[index]}%</div>
                <label
                  htmlFor={"percentSlider" + svg.id + index}
                  className="form-label"
                >
                  Animation Timeline %
                </label>
                <input
                  type="range"
                  id={"percentSlider" + svg.id + index}
                  name={String(index)}
                  className="form-range"
                  onChange={handleSliderChange}
                  value={percents[index]}
                />
              </Fragment>
            ))}
          </>
        ) : (
          "Click to Use"
        )}
      </td>
    </tr>
  );
};

export default SVGOptionsRow;

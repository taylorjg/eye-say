import PropTypes from "prop-types";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import words from "./words.json";

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const values = words.map((w) => w.value);

const fontScale = scaleLog({
  domain: [Math.min(...values), Math.max(...values)],
  range: [10, 100],
});

const fontSizeSetter = (datum) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

const MyWordCloud = ({ width, height }) => {
  return (
    <Wordcloud
      words={words}
      width={width}
      height={height}
      fontSize={fontSizeSetter}
      font={"Impact"}
      padding={2}
      rotate={0}
      random={fixedValueGenerator}
    >
      {(cloudWords) =>
        cloudWords.map((w, i) => (
          <Text
            key={w.text}
            fill={colors[i % colors.length]}
            textAnchor={"middle"}
            transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
            fontSize={w.size}
            fontFamily={w.font}
          >
            {w.text}
          </Text>
        ))
      }
    </Wordcloud>
  );
};

MyWordCloud.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export const App = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <ParentSize>
        {({ width, height }) => <MyWordCloud width={width} height={height} />}
      </ParentSize>
    </div>
  );
};

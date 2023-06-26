import PropTypes from "prop-types";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import words from "./words.json";

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const values = words.map((w) => w.value);

const fontScale = scaleLog({
  domain: [Math.min(...values), Math.max(...values)],
  range: [10, 100],
});

const fontSizeSetter = (datum) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

export const EyeSayWordCloud = ({ width, height }) => {
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

EyeSayWordCloud.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

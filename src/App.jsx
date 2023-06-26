import ParentSize from "@visx/responsive/lib/components/ParentSize";

import { EyeSayWordCloud } from "./EyeSayWordCloud";
import { Version } from "./Version";
import { StyledApp } from "./App.styles";

export const App = () => {
  return (
    <StyledApp>
      <ParentSize>
        {({ width, height }) => <EyeSayWordCloud width={width} height={height} />}
      </ParentSize>
      <Version />
    </StyledApp>
  );
};

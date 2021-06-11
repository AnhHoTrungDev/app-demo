import { FC } from "react";
import "./style/index.scss";

const AnimationBackgroundWrapper: FC = ({ children }) => {
  return (
    <div className="background-wrapper">
      {children}
      <div className="background-wrapper background-wrapper_wrapper">
        <div id="dots" />
        <div id="dots2" />
        <div id="dots3" />
        <div id="dots4" />
      </div>
    </div>
  );
};

export default AnimationBackgroundWrapper;

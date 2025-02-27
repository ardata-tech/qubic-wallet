import "./index.scss";


const HorizontalStack = ({ children, className, width }) => {
    return (
      <div className={`${"horizontal-stack"} ${className}`}>
        {children}
      </div>
    );
};
export default HorizontalStack
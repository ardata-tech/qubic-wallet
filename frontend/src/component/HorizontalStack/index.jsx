import "./index.scss";


const HorizontalStack = ({ children, className, gap, justifyContent }) => {
  return (
    <div
      style={{justifyContent, gap: gap ?? '4px' }}
      className={`${"horizontal-stack"} ${className}`}
    >
      {children}
    </div>
  );
};
export default HorizontalStack